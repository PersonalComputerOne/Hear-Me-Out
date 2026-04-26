import React, { useEffect, useRef } from "react";
import { useSyncedLyrics } from "../hooks/useSyncedLyrics";

interface LyricsProps {
  currentTime: number;
  trackTitle: string;
  bandName: string;
  duration: number;
  localLyrics?: { time: number; text: string }[];
  isFocused: boolean;
  onToggleFocus: () => void;
}

const LyricsPage: React.FC<LyricsProps> = ({
  currentTime,
  trackTitle,
  bandName,
  duration,
  localLyrics,
  isFocused,
  onToggleFocus,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLParagraphElement>(null);

  const { lyrics, loading } = useSyncedLyrics(
    bandName,
    trackTitle,
    duration,
    localLyrics,
  );

  const activeIndex = lyrics.reduce((acc, line, index) => {
    return currentTime >= line.time ? index : acc;
  }, 0);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  return (
    <div
      className="w-full h-full flex flex-col bg-gray-600 transition-all duration-700 cursor-pointer overflow-hidden select-none"
      onClick={onToggleFocus}
    >
      {/* Header */}
      <div
        className={`shrink-0 transition-all duration-700 ease-in-out ${
          isFocused
            ? "max-h-0 opacity-0 -translate-y-10 p-0"
            : "max-h-40 p-4 md:p-8 opacity-100 translate-y-0"
        }`}
      >
        <h1 className="text-lg md:text-2xl font-black text-white truncate tracking-tighter italic uppercase">
          {trackTitle}
        </h1>
        <p className="text-white uppercase tracking-[0.3em] text-[10px] font-bold">
          {bandName}
        </p>
      </div>

      {/* Lyrics scroll */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-2 px-6 md:px-16 no-scrollbar relative"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)",
        }}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        {loading && (
          <p className="text-white/40 text-sm text-center mt-8 animate-pulse">
            Loading lyrics...
          </p>
        )}

        {!loading && lyrics.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
            <img
              src="/assets/anj.gif"
              alt="No lyrics"
              className="w-32 h-32 md:w-80 md:h-80 object-cover rounded-full"
            />
            <p className="text-white text-sm uppercase tracking-widest font-bold text-center">
              No lyrics available
            </p>
          </div>
        )}

        <div className="flex flex-col">
          {lyrics.map((line, i) => {
            const isActive = i === activeIndex;
            return (
              <p
                id={`lyric-${i}`}
                key={`${i}-${line.time}`}
                ref={isActive ? activeRef : null}
                className={`text-2xl md:text-4xl py-3 md:py-6 font-black leading-tight tracking-tighter transition-all duration-500 origin-left ${
                  isActive
                    ? "text-white opacity-100 scale-105"
                    : "text-black opacity-80 scale-100"
                }`}
              >
                {line.text}
              </p>
            );
          })}
        </div>

        {/* Spacer at bottom */}
        <div className="h-16" />
      </div>
    </div>
  );
};

export default LyricsPage;
