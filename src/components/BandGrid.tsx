import React, { useState, useRef, useEffect } from "react";
import { Band } from "../types";
import { bandThemes } from "../utils/bandThemes";

interface BandGridProps {
  bands: Band[];
  onSelect: (id: number) => void;
}

const BandGrid: React.FC<BandGridProps> = ({ bands, onSelect }) => {
  const slides = [bands[bands.length - 1], ...bands, bands[0]];
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  useEffect(() => {
    if (currentIndex === slides.length - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 450);
      return () => clearTimeout(timer);
    }
    if (currentIndex === 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(slides.length - 2);
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, slides.length]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handleSwipe = () => {
    const distance = touchStart.current - touchEnd.current;
    if (distance > 50) setCurrentIndex((prev) => prev + 1);
    if (distance < -50) setCurrentIndex((prev) => prev - 1);
    touchStart.current = 0;
    touchEnd.current = 0;
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      {/* DESKTOP */}
      <div className="hidden md:grid grid-cols-3 gap-4 max-w-[1400px] h-full px-8 py-8">
        {bands.map((band) => (
          <BandCard
            key={band.id}
            band={band}
            theme={bandThemes[band.id]}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* MOBILE carousel */}
      <div
        className="md:hidden w-full h-full flex items-center overflow-hidden touch-none"
        onTouchStart={(e) => (touchStart.current = e.targetTouches[0].clientX)}
        onTouchMove={(e) => (touchEnd.current = e.targetTouches[0].clientX)}
        onTouchEnd={handleSwipe}
      >
        <div
          className="flex h-full w-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning
              ? "transform 450ms cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
          }}
        >
          {slides.map((band, index) => (
            <div
              key={`${band.id}-${index}`}
              className="w-full h-full flex-shrink-0 flex items-center justify-center px-4 py-4"
            >
              <div className="w-full h-full max-h-[80vh]">
                <BandCard
                  band={band}
                  theme={bandThemes[band.id]}
                  onSelect={onSelect}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BandCard = ({ band, theme, onSelect }: any) => {
  const paletteBg = theme?.palette
    ? `linear-gradient(180deg, ${theme.palette[0]} 0%, ${theme.palette[1]} 50%, ${theme.palette[2]} 100%)`
    : "linear-gradient(180deg, #333 0%, #111 100%)";

  return (
    <div
      onClick={() => onSelect(band.id)}
      className="group relative overflow-hidden flex flex-col items-center cursor-pointer transition-all duration-700 rounded-3xl w-full h-full"
      style={{ backgroundColor: "#4c5564" }}
    >
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out z-10 opacity-0 group-hover:opacity-100"
        style={{ background: paletteBg }}
      />
      <div className="pt-12 md:pt-20 z-20 px-8 text-center">
        <h2
          className="text-3xl md:text-4xl uppercase tracking-[0.2em] text-white"
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
          className="w-full h-auto max-h-[55vh] object-contain transition-all duration-1000"
        />
      </div>
    </div>
  );
};

export default BandGrid;
