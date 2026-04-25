import React from "react";
import { Band } from "../types";

interface Props {
  band: Band;
  size?: number;
  isPlaying?: boolean;
}

const SpinningDisc: React.FC<Props> = ({
  band,
  size = 120,
  isPlaying = true,
}) => {
  const discStyles = { width: `${size}px`, height: `${size}px` };

  return (
    <div
      style={discStyles}
      className="relative flex-shrink-0 flex items-center justify-center"
    >
      <style>{`
        @keyframes discRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        className="rounded-full overflow-hidden border-2 border-[#121212] shadow-2xl relative"
        style={{
          ...discStyles,
          animation: "discRotate 12s linear infinite",
          // This forces the rotation to stop/start based on isPlaying
          animationPlayState: isPlaying ? "running" : "paused",
        }}
      >
        <img
          src={band.discImg || "/assets/artist.jpg"}
          alt={`${band.name} disc`}
          className="w-full h-full object-cover"
        />

        {/* Vinyl Reflection Overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Center Spindle Hole */}
        <div className="absolute inset-0 m-auto w-3 h-3 bg-black rounded-full border border-white/20 z-10" />
      </div>
    </div>
  );
};

export default SpinningDisc;
