import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { verseProps } from "quran-tools";
import { DEFAULT_RECITER_ID } from "@/util/reciters";

const defaultAutoPlay = localStorage.getItem("audioAutoPlay")
  ? localStorage.getItem("audioAutoPlay") === "true"
  : true;

const defaultReciter =
  localStorage.getItem("audioReciter") || DEFAULT_RECITER_ID;

interface AudioPlayerState {
  currentVerse: verseProps | null;
  currentReciter: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  autoPlay: boolean;
  isPlayerVisible: boolean;
  isMinimized: boolean;
}

const initialState: AudioPlayerState = {
  currentVerse: null,
  currentReciter: defaultReciter,
  duration: 0,
  currentTime: 0,
  isPlaying: false,
  autoPlay: defaultAutoPlay,
  isPlayerVisible: false,
  isMinimized: false,
};

export const useAudioPlayerStore = create(
  immer(
    combine(initialState, (set) => ({
      setCurrentVerse: (currentVerse: verseProps | null) => {
        set((state) => {
          state.currentVerse = currentVerse;
        });
      },
      setCurrentReciter: (reciterId: string) => {
        set((state) => {
          state.currentReciter = reciterId;
        });
        localStorage.setItem("audioReciter", reciterId);
      },
      setDuration: (duration: number) => {
        set((state) => {
          state.duration = duration;
        });
      },
      setCurrentTime: (currentTime: number) => {
        set((state) => {
          state.currentTime = currentTime;
        });
      },
      setIsPlaying: (isPlaying: boolean) => {
        set((state) => {
          state.isPlaying = isPlaying;
        });
      },
      setAutoPlay: (autoPlay: boolean) => {
        set((state) => {
          state.autoPlay = autoPlay;
        });
        localStorage.setItem("audioAutoPlay", autoPlay ? "true" : "false");
      },
      setPlayerVisible: (visible: boolean) => {
        set((state) => {
          state.isPlayerVisible = visible;
        });
      },
      setMinimized: (minimized: boolean) => {
        set((state) => {
          state.isMinimized = minimized;
        });
      },
    }))
  )
);
