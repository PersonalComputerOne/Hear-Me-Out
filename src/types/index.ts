export interface LyricLine {
  time: number;
  text: string;
}

export interface Track {
  title: string;
  src?: string;
  youtubeId?: string;
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
