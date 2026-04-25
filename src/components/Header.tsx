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

  return (
    <header className="sticky top-0 z-[110] w-full px-6 md:px-12 py-6 flex items-center justify-between bg-black border-b-2 border-white text-white">
      {/* LOGO - relative and z-160 to stay above mobile overlay */}
      <div
        className="text-2xl md:text-3xl uppercase italic tracking-tighter text-white cursor-pointer relative z-[160]"
        style={{ fontFamily: "'Rubik Mono One', monospace" }}
        onClick={goHome}
      >
        HEAR ME OUT
      </div>

      {/* DESKTOP NAV - Hidden if no band is selected */}
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
              {band.name}
            </button>
          ))}
        </nav>
      )}

      {/* BURGER BUTTON - Only visible when a band is selected */}
      <button
        className={`md:hidden flex flex-col justify-center items-center w-10 h-10 border-2 border-white relative z-[160] transition-opacity duration-300 ${
          selectedBandId === null && !menuOpen
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
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
            className={`block h-0.5 w-6 bg-white absolute left-0 top-1/2 -translate-y-1/2 transition-opacity ${
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

      {/* MOBILE OVERLAY MENU - Fixed z-index at 150 */}
      <div
        className={`fixed top-0 left-0 w-full h-[60vh] bg-black border-b-2 border-white transition-all duration-500 md:hidden flex flex-col items-center justify-center z-[150] ${
          menuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* HERE */}
        <div className="sticky top-0 z-[110] w-full px-6 md:px-12 py-6 flex items-center justify-between bg-black text-white">
          <div
            className="text-2xl md:text-3xl uppercase italic tracking-tighter text-white cursor-pointer relative z-[160]"
            style={{ fontFamily: "'Rubik Mono One', monospace" }}
            onClick={goHome}
          >
            HEAR ME OUT
          </div>

          {/* BURGER BUTTON - Only visible when a band is selected */}
          <button
            className={`md:hidden flex flex-col justify-center items-center w-10 h-10 border-2 border-white relative z-[160] transition-opacity duration-300 ${
              selectedBandId === null && !menuOpen
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="relative w-6 h-6">
              <span
                className="block h-0.5 w-6 bg-white absolute left-0 transition-all duration-300"
                style={{
                  top: menuOpen ? "50%" : "10%",
                  transform: menuOpen
                    ? "translateY(-50%) rotate(45deg)"
                    : "none",
                }}
              />
              <span
                className={`block h-0.5 w-6 bg-white absolute left-0 top-1/2 -translate-y-1/2 transition-opacity ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className="block h-0.5 w-6 bg-white absolute left-0 transition-all duration-300"
                style={{
                  bottom: menuOpen ? "50%" : "10%",
                  transform: menuOpen
                    ? "translateY(50%) rotate(-45deg)"
                    : "none",
                }}
              />
            </div>
          </button>
        </div>
        {/* HERE */}

        {/* Mobile items only appear if a band is selected */}
        {selectedBandId !== null && (
          <nav className="w-full flex flex-col items-center gap-8 uppercase tracking-[0.2em] font-black text-2xl bg-black">
            <button
              className="border-t-2 border-white/20 w-full pt-4 text-white hover:text-gray-400 transition-colors"
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
                {band.name}
              </button>
            ))}
            <div className="pb-4" />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
