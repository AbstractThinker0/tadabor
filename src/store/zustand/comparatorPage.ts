import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ComparatorPageState {
  currentChapter: string;
  currentVerse: string;
}

const initialState: ComparatorPageState = {
  currentChapter: "1",
  currentVerse: "",
};

export const useComparatorPageStore = create(
  immer(
    combine(initialState, (set) => ({
      setCurrentChapter: (currentChapter: string) => {
        set((state) => {
          state.currentChapter = currentChapter;
          state.currentVerse = "";
        });
      },
      setCurrentVerse: (currentVerse: string) => {
        set((state) => {
          state.currentVerse = currentVerse;
        });
      },
    }))
  )
);
