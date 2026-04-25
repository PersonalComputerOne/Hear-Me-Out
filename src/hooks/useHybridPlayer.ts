import { useEffect, useRef, useState, useCallback } from "react";

type SourceType = "audio" | "youtube";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

let ytApiLoaded = false;
let ytApiLoading = false;
const ytReadyCallbacks: (() => void)[] = [];

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (ytApiLoaded) return resolve();
    ytReadyCallbacks.push(resolve);
    if (!ytApiLoading) {
      ytApiLoading = true;
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
      window.onYouTubeIframeAPIReady = () => {
        ytApiLoaded = true;
        ytReadyCallbacks.forEach((cb) => cb());
        ytReadyCallbacks.length = 0;
      };
    }
  });
}

export function useHybridPlayer(
  src: string | undefined,
  youtubeId: string | undefined,
  onEnded?: () => void,
) {
  const sourceType: SourceType = youtubeId ? "youtube" : "audio";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const ytIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onEndedRef = useRef(onEnded);
  const currentVolumeRef = useRef<number>(0.5);
  onEndedRef.current = onEnded;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ── AUDIO PLAYER ──
  useEffect(() => {
    if (sourceType !== "audio") return;
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEndedHandler = () => onEndedRef.current?.();

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEndedHandler);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEndedHandler);
    };
  }, [sourceType, src]);

  useEffect(() => {
    if (sourceType !== "audio" || !src || !audioRef.current) return;
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    audioRef.current.volume = currentVolumeRef.current;
    audioRef.current.load();
    audioRef.current.play().catch((e) => console.warn("Autoplay:", e));
  }, [src, sourceType]);

  // ── YOUTUBE POLLING ──
  const startYtPolling = useCallback(() => {
    if (ytIntervalRef.current) clearInterval(ytIntervalRef.current);
    ytIntervalRef.current = setInterval(() => {
      if (ytPlayerRef.current?.getCurrentTime) {
        setCurrentTime(ytPlayerRef.current.getCurrentTime());
      }
    }, 500);
  }, []);

  const stopYtPolling = useCallback(() => {
    if (ytIntervalRef.current) {
      clearInterval(ytIntervalRef.current);
      ytIntervalRef.current = null;
    }
  }, []);

  // ── YOUTUBE PLAYER ──
  useEffect(() => {
    if (sourceType !== "youtube" || !youtubeId) return;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    stopYtPolling();

    if (ytPlayerRef.current) {
      ytPlayerRef.current.destroy();
      ytPlayerRef.current = null;
    }

    loadYouTubeAPI().then(() => {
      if (!iframeContainerRef.current) return;

      iframeContainerRef.current.innerHTML = "";
      const div = document.createElement("div");
      iframeContainerRef.current.appendChild(div);

      ytPlayerRef.current = new window.YT.Player(div, {
        videoId: youtubeId,
        width: "320",
        height: "180",
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            setDuration(e.target.getDuration());
            e.target.setVolume(currentVolumeRef.current * 100);
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            const YT = window.YT.PlayerState;
            if (e.data === YT.PLAYING) {
              setIsPlaying(true);
              setDuration(e.target.getDuration());
              startYtPolling();
            } else if (e.data === YT.PAUSED) {
              setIsPlaying(false);
              stopYtPolling();
              setCurrentTime(e.target.getCurrentTime());
            } else if (e.data === YT.ENDED) {
              setIsPlaying(false);
              stopYtPolling();
              setCurrentTime(0);
              onEndedRef.current?.();
            }
          },
        },
      });
    });

    return () => stopYtPolling();
  }, [youtubeId, sourceType, startYtPolling, stopYtPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopYtPolling();
      ytPlayerRef.current?.destroy();
      ytPlayerRef.current = null;
    };
  }, [stopYtPolling]);

  // ── CONTROLS ──
  const toggle = useCallback(() => {
    if (sourceType === "audio" && audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
    } else if (ytPlayerRef.current) {
      isPlaying
        ? ytPlayerRef.current.pauseVideo()
        : ytPlayerRef.current.playVideo();
    }
    setIsPlaying((p) => !p);
  }, [sourceType, isPlaying]);

  const seek = useCallback(
    (time: number) => {
      if (sourceType === "audio" && audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      } else if (ytPlayerRef.current) {
        ytPlayerRef.current.seekTo(time, true);
        setCurrentTime(time);
      }
    },
    [sourceType],
  );

  const setVolume = useCallback(
    (vol: number) => {
      currentVolumeRef.current = vol;
      if (sourceType === "audio" && audioRef.current) {
        audioRef.current.volume = vol;
      } else if (ytPlayerRef.current) {
        ytPlayerRef.current.setVolume(vol * 100);
      }
    },
    [sourceType],
  );

  return {
    audioRef,
    iframeContainerRef,
    sourceType,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
    setVolume,
  };
}
