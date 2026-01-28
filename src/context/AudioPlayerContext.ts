import { createContext } from "react";

export interface AudioPlayerContextValue {
  audioElement: HTMLAudioElement;
}

export const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(
  null
);
