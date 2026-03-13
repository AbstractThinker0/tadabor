import { createContext } from "react";

export interface AudioPlayerContextValue {
  playAudio: () => Promise<void>;
  pauseAudio: () => void;
  seekAudio: (time: number) => void;
  setVerseAudio: (verseRank: number, reciterId: string) => void;
}

export const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(
  null
);
