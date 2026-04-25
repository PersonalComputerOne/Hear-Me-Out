export interface LyricLine {
  time: number;
  text: string;
}

export interface Track {
  title: string;
  src?: string; // local mp3 — MCR only
  youtubeId?: string; // YouTube iframe — Mayday + Neck Deep
  name?: string;
  duration?: number;
  album?: string;
  lyrics?: LyricLine[];
}

export interface Band {
  id: number;
  name: string;
  image: string;
  imageSrc: string;
  discImg: string;
  audioSrc: string;
  description?: string;
  mbid?: string;
  tracks?: Track[];
}
