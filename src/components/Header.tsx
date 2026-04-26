import React from "react";
import { Band } from "../types";

interface HeaderProps {
  isHome: boolean;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  selectedBandId: number | null;
  setSelectedBandId: (id: number | null) => void;
  setShowPlayer: (value: boolean) => void;
  setShowLyrics: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMusicList: (value: boolean) => void;
  setShowSelector: (value: boolean) => void;
  setCurrentTime: (value: number) => void;
  bands: Band[];
  setCurrentTrackSrc?: (src: string) => void;
  setCurrentTrackTitle?: (title: string) => void;
  setCurrentTrackIndex?: (index: number) => void;
}

const Header: React.FC<HeaderProps> = ({
  menuOpen,
  setMenuOpen,
  selectedBandId,
  setSelectedBandId,
  setShowPlayer,
  setShowLyrics,
  setShowMusicList,
  setShowSelector,
  setCurrentTime,
  bands,
}) => {
  const goHome = () => {
    setSelectedBandId(null);
    setShowPlayer(false);
    setShowLyrics(false);
    setShowMusicList(false);
    setShowSelector(false);
    setMenuOpen(false);
    setCurrentTime(0);
  };

  const handleSelectBand = (id: number) => {
    setSelectedBandId(id);
    setMenuOpen(false);
  };

  const showBurger = selectedBandId !== null || menuOpen;

  return (
    <div className="sticky top-0 z-[110] w-full bg-black border-b-2 border-white text-white">
      {/* HEADER BAR */}
      <header className="w-full px-6 md:px-12 py-4 md:py-6 flex items-center justify-between">
        {/* LOGO */}
        <div
          className="text-2xl md:text-3xl uppercase italic tracking-tighter text-white cursor-pointer"
          style={{ fontFamily: "'Rubik Mono One', monospace" }}
          onClick={goHome}
        >
          HEAR ME OUT
        </div>

        {/* DESKTOP NAV */}
        {selectedBandId !== null && (
          <nav className="hidden md:flex items-center gap-8 font-bold uppercase text-xs tracking-[0.2em]">
            <button
              onClick={goHome}
              className="transition-colors duration-200 px-2 py-1 text-white/50 hover:text-white"
            >
              Home
            </button>
            {bands.slice(0, 3).map((band) => (
              <button
                key={band.id}
                onClick={() => handleSelectBand(band.id)}
                className={`transition-all duration-300 px-2 py-1 ${
                  selectedBandId === band.id
                    ? "text-white underline underline-offset-[12px] decoration-white decoration-2"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {band.name.replace("\n", " ")}
              </button>
            ))}
          </nav>
        )}

        {/* BURGER */}
        <button
          className={`md:hidden flex flex-col justify-center items-center w-10 h-10 border-2 border-white transition-opacity duration-300 ${
            showBurger ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6">
            <span
              className="block h-0.5 w-6 bg-white absolute left-0 transition-all duration-300"
              style={{
                top: menuOpen ? "50%" : "10%",
                transform: menuOpen ? "translateY(-50%) rotate(45deg)" : "none",
              }}
            />
            <span
              className={`block h-0.5 w-6 bg-white absolute left-0 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className="block h-0.5 w-6 bg-white absolute left-0 transition-all duration-300"
              style={{
                bottom: menuOpen ? "50%" : "10%",
                transform: menuOpen ? "translateY(50%) rotate(-45deg)" : "none",
              }}
            />
          </div>
        </button>
      </header>

      {/* MOBILE DROPDOWN — part of sticky header so it pushes content down */}
      {menuOpen && selectedBandId !== null && (
        <div className="md:hidden w-full bg-black border-t border-white/20">
          <nav className="flex flex-col items-center py-6 gap-6 uppercase tracking-[0.2em] font-black text-xl">
            <button
              className="text-white/50 hover:text-white transition-colors"
              onClick={goHome}
            >
              Home
            </button>
            {bands.slice(0, 3).map((band) => (
              <button
                key={band.id}
                className={`transition-all ${
                  selectedBandId === band.id
                    ? "text-white underline underline-offset-8 decoration-white"
                    : "text-white/40 hover:text-white"
                }`}
                onClick={() => handleSelectBand(band.id)}
              >
                {band.name.replace("\n", " ")}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;
