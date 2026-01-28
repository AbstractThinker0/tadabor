import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const defaultChapter = localStorage.getItem("audioChapter") || "1";

interface AudioPageState {
  currentChapter: string;
  showSearchPanel: boolean;
  showSearchPanelMobile: boolean;
}

const initialState: AudioPageState = {
  currentChapter: defaultChapter,
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
      setSearchPanel: (isOpen: boolean) => {
        set((state) => {
          state.showSearchPanel = isOpen;
          state.showSearchPanelMobile = isOpen;
        });
      },
    }))
  )
);
