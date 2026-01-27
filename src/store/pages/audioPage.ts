import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { verseProps } from "quran-tools";
import { DEFAULT_RECITER_ID } from "@/util/reciters";

const defaultAutoPlay = localStorage.getItem("audioAutoPlay")
  ? localStorage.getItem("audioAutoPlay") === "true"
  : true;

const defaultChapter = localStorage.getItem("audioChapter") || "1";

const defaultReciter =
  localStorage.getItem("audioReciter") || DEFAULT_RECITER_ID;

interface AudioPageState {
  currentChapter: string;
  currentVerse: verseProps | null;
  currentReciter: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  autoPlay: boolean;
  showSearchPanel: boolean;
  showSearchPanelMobile: boolean;
}

const initialState: AudioPageState = {
  currentChapter: defaultChapter,
  currentVerse: null,
  currentReciter: defaultReciter,
  duration: 0,
  currentTime: 0,
  isPlaying: defaultAutoPlay,
  autoPlay: true,
  showSearchPanel: true,
  showSearchPanelMobile: false,
};

export const useAudioPageStore = create(
  immer(
    combine(initialState, (set) => ({
      setCurrentChapter: (currentChapter: string) => {
        set((state) => {
          state.currentChapter = currentChapter;
        });
        localStorage.setItem("audioChapter", currentChapter);
      },
      setCurrentVerse: (currentVerse: verseProps | null) => {
        set((state) => {
          state.currentVerse = currentVerse;
        });
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
      setAutoPlaying: (autoPlay: boolean) => {
        set((state) => {
          state.autoPlay = autoPlay;
        });
      },
      setCurrentReciter: (reciterId: string) => {
        set((state) => {
          state.currentReciter = reciterId;
        });
        localStorage.setItem("audioReciter", reciterId);
      },
      setSearchPanel: (isOpen: boolean) => {
        set((state) => {
          state.showSearchPanel = isOpen;
          state.showSearchPanelMobile = isOpen;
        });
      },
    }))
  )
);
