import React, { useState, useEffect } from "react";
import { useHybridPlayer } from "../hooks/useHybridPlayer";
import SpinningDisc from "./SpinningDisc";
import { Band } from "../types";

const SkipBackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="19 20 9 12 19 4 19 20"></polygon>
    <line
      x1="5"
      y1="19"
      x2="5"
      y2="5"
      stroke="currentColor"
      strokeWidth="2"
    ></line>
  </svg>
);
const SkipForwardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 4 15 12 5 20 5 4"></polygon>
    <line
      x1="19"
      y1="5"
      x2="19"
      y2="19"
      stroke="currentColor"
      strokeWidth="2"
    ></line>
  </svg>
);
const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);
const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);
const VolumeIcon = ({ muted }: { muted?: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    {muted ? (
      <line x1="23" y1="1" x2="1" y2="23" stroke="white"></line>
    ) : (
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    )}
  </svg>
);
const MaximizeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const formatTime = (s: number) => {
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}`;
};

interface PlayerProps {
  band: Band;
  trackSrc: string | undefined;
  trackYouTubeId: string | undefined;
  trackTitle?: string;
  trackAlbum?: string;
  onNext?: () => void;
  onPrev?: () => void;
  onTimeUpdate: (time: number) => void;
}

const Player: React.FC<PlayerProps> = ({
  band,
  trackSrc,
  trackYouTubeId,
  trackTitle,
  trackAlbum,
  onNext,
  onPrev,
  onTimeUpdate,
}) => {
  const {
    iframeContainerRef,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
    setVolume,
  } = useHybridPlayer(trackSrc, trackYouTubeId, onNext);

  const [volume, setVolumeState] = useState(0.5);
  const [prevVolume, setPrevVolume] = useState(0.5);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    onTimeUpdate(currentTime);
  }, [currentTime, onTimeUpdate]);

  useEffect(() => {
    setVolume(volume);
  }, [volume, setVolume]);

  const handleToggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolumeState(0);
    } else {
      setVolumeState(prevVolume || 0.5);
    }
  };

  const progressPercent = (currentTime / (duration || 1)) * 100;

  return (
    <>
      {/* Hidden YouTube iframe */}
      <div
        style={{
          position: "fixed",
          width: 1,
          height: 1,
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
          bottom: 0,
          left: 0,
        }}
      >
        <div ref={iframeContainerRef} style={{ width: 320, height: 180 }} />
      </div>

      {/* MAXIMIZED OVERLAY */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-all duration-500 ease-in-out flex flex-col ${isMaximized ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
          <div className="sticky top-0 z-[100] w-full px-6 md:px-12 py-7 md:py-6 flex items-center justify-center bg-black border-b-2 border-white text-white">
            <h2
              className="text-2xl md:text-3xl uppercase italic tracking-tighter text-white"
              style={{ fontFamily: "'Rubik Mono One', monospace" }}
            >
              HEAR ME OUT
            </h2>
          </div>
          <div className="flex-1 flex items-center justify-center px-10 pb-20 bg-gray-600">
            <div className="transition-all duration-700 ease-in-out max-w-lg w-full">
              {band.image ? (
                <img
                  src={band.image}
                  alt={`${band.name} album art`}
                  className="w-full aspect-square object-cover rounded-md shadow-2xl border border-white/5"
                />
              ) : (
                <div className="w-full aspect-square bg-white/5 rounded-md flex items-center justify-center text-white/20 uppercase text-2xl tracking-widest p-10 text-center">
                  No Art Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE PLAYER ── */}
      <div className="md:hidden w-full bg-black border-t border-white/10 z-50 px-3 pt-2 pb-2">
        {/* Progress bar */}
        <div className="w-full flex items-center gap-2 mb-2">
          <span className="text-[10px] text-white tabular-nums shrink-0">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 relative h-4 flex items-center">
            <div className="absolute w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              step="1"
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="absolute h-2.5 w-2.5 bg-white rounded-full pointer-events-none"
              style={{ left: `calc(${progressPercent}% - 5px)` }}
            />
          </div>
          <span className="text-[10px] text-white tabular-nums shrink-0">
            {formatTime(duration || 0)}
          </span>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          {/* Track info */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <SpinningDisc band={band} size={32} isPlaying={isPlaying} />
            <div className="min-w-0 truncate">
              <div className="text-white text-sm font-bold truncate">
                {trackTitle || "Select a track"}
              </div>
              <div className="text-gray-400 text-sm truncate">
                {band.name.replace("\n", " ")}
              </div>
            </div>
          </div>
          {/* Playback controls */}
          <div className="flex items-center gap-3 shrink-0 mx-3">
            <button onClick={onPrev} className="text-white">
              <SkipBackIcon />
            </button>
            <button
              onClick={toggle}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-black shadow-xl shrink-0"
            >
              {isPlaying ? (
                <PauseIcon />
              ) : (
                <div className="ml-0.5">
                  <PlayIcon />
                </div>
              )}
            </button>
            <button onClick={onNext} className="text-white">
              <SkipForwardIcon />
            </button>
          </div>
          {/* Maximize */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-white"
            >
              <MaximizeIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP PLAYER ── */}
      <div className="hidden md:block w-full bg-black border-t border-white/10 py-3 px-4 z-50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-x-4">
          {/* LEFT: Track Info */}
          <div className="flex items-center gap-4 w-1/4 min-w-0">
            <SpinningDisc band={band} size={36} isPlaying={isPlaying} />
            <div className="min-w-0 truncate">
              <div className="text-white text-xs font-bold truncate">
                {trackTitle || "Select a track"}
              </div>
              <div className="text-gray-400 text-xs tracking-widest truncate">
                {band.name.replace("\n", " ")}
              </div>
              {trackAlbum && (
                <div className="text-gray-600 text-xs truncate">
                  {trackAlbum}
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Controls + Progress */}
          <div className="flex flex-col items-center flex-1 max-w-xl">
            <div className="flex items-center gap-10 mb-1">
              <button
                onClick={onPrev}
                className="text-white hover:text-gray-400 transition-all active:scale-90"
              >
                <SkipBackIcon />
              </button>
              <button
                onClick={toggle}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-all shadow-xl"
              >
                {isPlaying ? (
                  <PauseIcon />
                ) : (
                  <div className="ml-1">
                    <PlayIcon />
                  </div>
                )}
              </button>
              <button
                onClick={onNext}
                className="text-white hover:text-gray-400 transition-all active:scale-90"
              >
                <SkipForwardIcon />
              </button>
            </div>

            <div className="w-full flex items-center gap-3">
              <span className="text-xs text-white w-10 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative h-6 flex items-center">
                <div className="absolute w-full h-1 bg-white/20 rounded-full border border-white/50 overflow-hidden">
                  <div
                    className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  step="0.1"
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 appearance-none"
                />
                <div
                  className="absolute h-3 w-3 bg-white rounded-full shadow-md pointer-events-none"
                  style={{ left: `calc(${progressPercent}% - 6px)` }}
                />
              </div>
              <span className="text-xs text-white w-10 tabular-nums">
                {formatTime(duration || 0)}
              </span>
            </div>
          </div>

          {/* RIGHT: Volume + Maximize */}
          <div className="flex items-center gap-6 justify-end w-1/4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                className="text-white hover:text-gray-400 transition-colors"
              >
                <VolumeIcon muted={volume === 0} />
              </button>
              <div className="relative w-24 h-6 flex items-center">
                <div className="absolute w-full h-1 bg-white/20 rounded-full border border-white/50 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolumeState(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 appearance-none"
                />
                <div
                  className="absolute h-2.5 w-2.5 bg-white rounded-full shadow-md pointer-events-none"
                  style={{ left: `calc(${volume * 100}% - 5px)` }}
                />
              </div>
            </div>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className={`transition-all duration-300 ${isMaximized ? "text-white scale-110" : "text-white hover:text-gray-400"}`}
            >
              <MaximizeIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;
