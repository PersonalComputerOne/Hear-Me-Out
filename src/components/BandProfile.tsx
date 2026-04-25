import React, { useState } from "react";
import { Band } from "../types";
import { bandThemes } from "../utils/bandThemes";

interface Props {
  band: Band;
}

const BandProfile: React.FC<Props> = ({ band }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const theme = bandThemes[band.id];

  const paletteBg = theme?.palette
    ? `linear-gradient(180deg, ${theme.palette[0]} 0%, ${theme.palette[1]} 50%, ${theme.palette[2]} 100%)`
    : "linear-gradient(180deg, #333 0%, #111 100%)";

  return (
    <div
      className="group w-full h-[450px] md:h-full perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT SIDE */}

        <div
          className="absolute inset-none md:inset-0 backface-hidden rounded-b-none rounded-t-2xl overflow-hidden flex flex-col items-center"
          style={{ background: paletteBg }}
        >
          <div className="pt-20 z-20 px-8 text-center">
            <h2
              className="text-3xl md:text-5xl uppercase tracking-[0.2em] text-white"
              style={{
                fontFamily: "'Monoton', cursive",
                textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              {band.name}
            </h2>
          </div>

          <div className="mt-auto w-full flex justify-center items-end z-30">
            <img
              src={band.imageSrc}
              alt={band.name}
              className="w-full h-auto max-h-[45vh] object-contain transition-all duration-1000 transform translate-y-2 grayscale group-hover:grayscale-0"
            />
          </div>
        </div>

        {/* BACK SIDE */}

        <div className="absolute inset-none md:inset-0 backface-hidden rotate-y-180 rounded-b-none rounded-t-2xl flex flex-col px-8 py-4 overflow-hidden">
          {/* Base gray layer */}
          <div
            className="absolute inset-0 z-10"
            style={{ backgroundColor: "#4c5564" }}
          />

          {/* Palette layer (revealed on hover) */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-0" />

          {/* Content */}
          <div className="relative z-20 flex flex-col h-full">
            <h2
              className="mt-8 text-center text-xl md:text-3xl uppercase tracking-widest text-white mb-6 border-b border-white/20 pb-4"
              style={{ fontFamily: "'Monoton', cursive" }}
            >
              {band.name}
            </h2>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <p className="text-white text-justify text-sm md:text-lg leading-relaxed font-medium">
                {band.description || "No description available for this band."}
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              {/* Spinning Disc component would go here */}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default BandProfile;
