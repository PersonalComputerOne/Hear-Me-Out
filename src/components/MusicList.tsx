import React from "react";
import { Track } from "../types";

interface Props {
  tracks: Track[];
  onSelect: (src: string | undefined, index: number) => void;
  activeIndex: number;
  activeDuration?: number;
  bandName: string;
}

const format = (s: number) => {
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}`;
};

const systemFont = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

const MusicList: React.FC<Props> = ({
  tracks,
  onSelect,
  activeIndex,
  activeDuration,
  bandName,
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden shadow-2xl border border-gray-100 md:rounded-t-2xl">
      <div className="p-2 md:p-4 border-b border-gray-100 bg-white shrink-0">
        <h3
          className="text-md md:text-lg font-black text-black uppercase tracking-tighter"
          style={{ fontFamily: systemFont }}
        >
          Music List
        </h3>
      </div>
      <ul className="flex-1 overflow-y-auto p-2 md:p-4 space-y-1 md:space-y-2 no-scrollbar bg-white">
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {tracks.map((t, i) => {
          const isActive = i === activeIndex;
          const displayDuration =
            isActive && activeDuration ? activeDuration : t.duration;
          return (
            <li
              key={i}
              className={`flex items-center justify-between p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
                isActive
                  ? "bg-black text-white shadow-lg translate-x-1"
                  : "hover:bg-gray-100 text-gray-900"
              }`}
              onClick={() => onSelect(t.src, i)}
            >
              <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                <span
                  className={`text-[10px] font-bold w-4 flex-shrink-0 ${
                    isActive ? "text-white/40" : "text-gray-300"
                  }`}
                  style={{ fontFamily: systemFont }}
                >
                  {isActive ? "→" : (i + 1).toString().padStart(2, "0")}
                </span>
                <div className="min-w-0 truncate">
                  <div
                    className="font-black text-md truncate"
                    style={{ fontFamily: systemFont }}
                  >
                    {t.title || "Unknown Title"}
                  </div>
                  <div
                    className={`text-sm tracking-widest font-bold truncate ${
                      isActive ? "text-white/50" : "text-gray-400"
                    }`}
                    style={{ fontFamily: systemFont }}
                  >
                    {bandName}
                  </div>
                </div>
              </div>
              <div
                className="text-xs opacity-60 ml-4 flex-shrink-0"
                style={{ fontFamily: systemFont }}
              >
                {displayDuration ? format(displayDuration) : "00:00"}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MusicList;
