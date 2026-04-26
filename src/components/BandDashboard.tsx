import React, { useEffect, useState } from "react";
import { Band, Track } from "../types";
import MusicList from "./MusicList";
import LyricsPage from "./LyricsPage";
import BandProfile from "./BandProfile";

type MobileTab = "list" | "lyrics" | "profile";

interface Props {
  band: Band;
  currentTrackIndex: number;
  currentTrackSrc: string | undefined;
  currentTrackTitle: string;
  currentTime: number;
  isFocused: boolean;
  onToggleFocus: () => void;
  onSelectTrack: (index: number) => void;
  onTracksLoaded: (tracks: Track[]) => void;
}

const BandDashboard: React.FC<Props> = ({
  band,
  currentTrackIndex,
  currentTrackSrc,
  currentTrackTitle,
  currentTime,
  isFocused,
  onToggleFocus,
  onSelectTrack,
  onTracksLoaded,
}) => {
  const [mobileTab, setMobileTab] = useState<MobileTab>("list");
  const tracks = band.tracks ?? [];
  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (tracks.length > 0) {
      onTracksLoaded(tracks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [band.id, onTracksLoaded]);

  return (
    <main className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-0 md:gap-4 md:px-4 md:pt-4 overflow-hidden">
      {/* MOBILE TABS */}
      <div className="flex md:hidden border-b-2 border-white/10 bg-black shrink-0">
        {(["list", "lyrics", "profile"] as MobileTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
              mobileTab === tab
                ? "text-black border-2 border-black bg-white"
                : "text-white border-2 border-white"
            }`}
          >
            {tab === "list" ? "Tracks" : tab === "lyrics" ? "Lyrics" : "Band"}
          </button>
        ))}
      </div>

      {/* COLUMN 1: MUSIC LIST */}
      <div
        className={`md:col-span-3 md:h-full overflow-hidden ${
          mobileTab === "list" ? "flex flex-col flex-1" : "hidden md:block"
        }`}
      >
        {/* No radius on mobile, rounded on desktop */}
        <div className="w-full h-full md:rounded-t-2xl overflow-hidden">
          <MusicList
            tracks={tracks}
            activeIndex={currentTrackIndex}
            bandName={band.name}
            onSelect={(_src, index) => {
              onSelectTrack(index);
              setMobileTab("lyrics");
            }}
          />
        </div>
      </div>

      {/* COLUMN 2: LYRICS */}
      <div
        className={`md:col-span-5 md:h-full overflow-hidden ${
          mobileTab === "lyrics" ? "flex flex-col flex-1" : "hidden md:block"
        }`}
      >
        <div className="w-full h-full md:rounded-t-2xl overflow-hidden">
          <LyricsPage
            currentTime={currentTime}
            trackTitle={currentTrackTitle}
            bandName={band.name.replace("\n", " ")}
            duration={currentTrack?.duration ?? 0}
            localLyrics={currentTrack?.lyrics}
            isFocused={isFocused}
            onToggleFocus={onToggleFocus}
          />
        </div>
      </div>

      {/* COLUMN 3: BAND PROFILE */}
      <div
        className={`md:col-span-4 md:h-full overflow-hidden ${
          mobileTab === "profile" ? "flex flex-col flex-1" : "hidden md:block"
        }`}
      >
        <div className="w-full h-full md:rounded-t-2xl overflow-hidden">
          <BandProfile band={band} />
        </div>
      </div>
    </main>
  );
};

export default BandDashboard;
