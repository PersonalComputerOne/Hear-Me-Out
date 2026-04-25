import { useState, useEffect } from "react";

interface LyricLine {
  time: number;
  text: string;
}

interface UseSyncedLyricsResult {
  lyrics: LyricLine[];
  loading: boolean;
  source: "lrclib" | "local" | "none";
}

// Parses "[mm:ss.xx] lyric text" into { time, text }
function parseLRC(lrc: string): LyricLine[] {
  const lines = lrc.split("\n");
  const result: LyricLine[] = [];

  for (const line of lines) {
    const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
    if (!match) continue;
    const minutes = parseInt(match[1]);
    const seconds = parseInt(match[2]);
    const centiseconds = parseInt(match[3]);
    const text = match[4].trim();
    const time = minutes * 60 + seconds + centiseconds / 100;
    result.push({ time, text });
  }

  return result.sort((a, b) => a.time - b.time);
}

export function useSyncedLyrics(
  artist: string,
  trackTitle: string,
  duration: number,
  localLyrics?: LyricLine[],
): UseSyncedLyricsResult {
  const [lyrics, setLyrics] = useState<LyricLine[]>(localLyrics ?? []);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"lrclib" | "local" | "none">(
    localLyrics?.length ? "local" : "none",
  );

  useEffect(() => {
    if (!artist || !trackTitle) return;

    const controller = new AbortController();

    async function fetchLyrics() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          artist_name: artist,
          track_name: trackTitle,
          ...(duration ? { duration: String(Math.round(duration)) } : {}),
        });

        const res = await fetch(
          `https://lrclib.net/api/get?${params.toString()}`,
          { signal: controller.signal },
        );

        if (!res.ok) throw new Error("Not found");

        const data = await res.json();

        if (data.syncedLyrics) {
          const parsed = parseLRC(data.syncedLyrics);
          setLyrics(parsed);
          setSource("lrclib");
        } else if (data.plainLyrics) {
          // No timestamps — split into lines with even spacing
          const lines = data.plainLyrics
            .split("\n")
            .filter((l: string) => l.trim())
            .map((text: string, i: number) => ({ time: i * 3, text }));
          setLyrics(lines);
          setSource("lrclib");
        } else {
          throw new Error("No lyrics in response");
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        // Fall back to local lyrics
        if (localLyrics?.length) {
          setLyrics(localLyrics);
          setSource("local");
        } else {
          setLyrics([]);
          setSource("none");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchLyrics();
    return () => controller.abort();
  }, [artist, trackTitle, duration, localLyrics]);

  return { lyrics, loading, source };
}
