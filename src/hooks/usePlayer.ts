import { useState } from "react";
import { Band } from "../types";

const usePlayer = (bands: Band[]) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrackSrc, setCurrentTrackSrc] = useState<string | undefined>(
    undefined,
  );
  const [currentTrackTitle, setCurrentTrackTitle] =
    useState<string>("Now Playing");
  const [currentTrackYouTubeId, setCurrentTrackYouTubeId] = useState<
    string | undefined
  >(undefined);
  const [currentTrackAlbum, setCurrentTrackAlbum] = useState<
    string | undefined
  >(undefined);

  const updateTrackByIndex = (band: Band, index: number) => {
    if (!band.tracks) return;
    const track = band.tracks[index];
    if (!track) return;
    setCurrentTrackIndex(index);
    setCurrentTrackSrc(track.src);
    setCurrentTrackTitle(track.title);
    setCurrentTrackYouTubeId(track.youtubeId);
    setCurrentTrackAlbum(track.album);
  };

  return {
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
    updateTrackByIndex,
  };
};

export default usePlayer;
