import React, { useEffect } from "react";
import { Band, Track } from "../types";
import MusicList from "./MusicList";
import LyricsPage from "./LyricsPage";
import BandProfile from "./BandProfile";

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
  const tracks = band.tracks ?? [];
  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (tracks.length > 0) {
      onTracksLoaded(tracks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [band.id, onTracksLoaded]);

  return (
    <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 px-4 pt-4 overflow-y-auto md:overflow-hidden">
      <div className="md:col-span-3 min-h-[400px] md:h-full overflow-hidden">
        <MusicList
          tracks={tracks}
          activeIndex={currentTrackIndex}
          bandName={band.name}
          onSelect={(_src, index) => onSelectTrack(index)}
        />
      </div>

      <div className="md:col-span-5 min-h-[500px] md:h-full rounded-b-none rounded-t-2xl overflow-hidden">
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

      <div className="md:col-span-4 min-h-[450px] md:h-full">
        <BandProfile band={band} />
      </div>
    </main>
  );
};

export default BandDashboard;
