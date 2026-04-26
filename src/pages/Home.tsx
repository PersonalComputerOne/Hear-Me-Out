import React, { useState, useCallback } from "react";
import Header from "../components/Header";
import Player from "../components/Player";
import BandGrid from "../components/BandGrid";
import BandDashboard from "../components/BandDashboard";
import { bands } from "../data/bands";
import usePlayer from "../hooks/usePlayer";
import { Track } from "../types";

const Home: React.FC = () => {
  const [selectedBandId, setSelectedBandId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loadedTracks, setLoadedTracks] = useState<Track[]>([]);

  const {
    currentTrackIndex,
    currentTrackSrc,
    currentTrackTitle,
    currentTrackYouTubeId,
    currentTrackAlbum,
    setCurrentTrackIndex,
    setCurrentTrackSrc,
    setCurrentTrackTitle,
    setCurrentTrackYouTubeId,
    setCurrentTrackAlbum,
  } = usePlayer(bands);

  const selected = bands.find((b) => b.id === selectedBandId) || bands[0];
  const isHome = selectedBandId === null;

  const updateTrack = (index: number) => {
    const track = loadedTracks[index];
    if (!track) return;
    setCurrentTrackIndex(index);
    setCurrentTrackSrc(track.src);
    setCurrentTrackTitle(track.title);
    setCurrentTrackYouTubeId(track.youtubeId);
    setCurrentTrackAlbum(track.album);
  };

  const selectBand = (id: number | null) => {
    if (id === null) {
      setSelectedBandId(null);
      setLoadedTracks([]);
      return;
    }
    const band = bands.find((b) => b.id === id);
    if (!band) return;
    setSelectedBandId(id);
    setLoadedTracks([]);
  };

  const handleTracksLoaded = useCallback(
    (tracks: Track[]) => {
      setLoadedTracks(tracks);
      const first = tracks[0];
      if (first) {
        setCurrentTrackIndex(0);
        setCurrentTrackSrc(first.src);
        setCurrentTrackTitle(first.title);
        setCurrentTrackYouTubeId(first.youtubeId);
        setCurrentTrackAlbum(first.album);
      }
    },
    [
      setCurrentTrackIndex,
      setCurrentTrackSrc,
      setCurrentTrackTitle,
      setCurrentTrackYouTubeId,
      setCurrentTrackAlbum,
    ],
  );

  return (
    <div
      className="fixed w-full bg-black flex flex-col overflow-hidden"
      style={{ height: "100dvh" }}
    >
      <Header
        isHome={isHome}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        selectedBandId={selectedBandId}
        setSelectedBandId={selectBand}
        bands={bands}
        setCurrentTime={setCurrentTime}
        setCurrentTrackSrc={setCurrentTrackSrc}
        setCurrentTrackTitle={setCurrentTrackTitle}
        setCurrentTrackIndex={setCurrentTrackIndex}
        setShowPlayer={() => {}}
        setShowLyrics={() => {}}
        setShowMusicList={() => {}}
        setShowSelector={() => {}}
      />

      {/* Overlay to close menu when clicking outside */}
      {menuOpen && (
        <div
          className={`flex-1 flex flex-col min-h-0 ${menuOpen ? "hidden md:flex" : "flex"}`}
        />
      )}

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {isHome ? (
          <div className="flex-1">
            <BandGrid bands={bands} onSelect={(id) => selectBand(id)} />
          </div>
        ) : (
          <>
            <BandDashboard
              key={selectedBandId}
              band={selected}
              currentTrackIndex={currentTrackIndex}
              currentTrackSrc={currentTrackSrc}
              currentTrackTitle={currentTrackTitle}
              currentTime={currentTime}
              isFocused={isFocused}
              onToggleFocus={() => setIsFocused(!isFocused)}
              onSelectTrack={updateTrack}
              onTracksLoaded={handleTracksLoaded}
            />

            <Player
              band={selected}
              trackSrc={currentTrackSrc}
              trackYouTubeId={currentTrackYouTubeId}
              trackTitle={currentTrackTitle}
              trackAlbum={currentTrackAlbum}
              onTimeUpdate={setCurrentTime}
              onNext={() => {
                if (loadedTracks.length > 0)
                  updateTrack((currentTrackIndex + 1) % loadedTracks.length);
              }}
              onPrev={() => {
                if (loadedTracks.length > 0)
                  updateTrack(
                    (currentTrackIndex - 1 + loadedTracks.length) %
                      loadedTracks.length,
                  );
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
