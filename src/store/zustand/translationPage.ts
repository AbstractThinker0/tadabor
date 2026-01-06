import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface TranslationPageState {
  currentChapter: string;
  scrollKey: string;
  showSearchPanel: boolean;
  showSearchPanelMobile: boolean;
}

const initialState: TranslationPageState = {
  currentChapter: "1",
  scrollKey: "",
  showSearchPanel: true,
  showSearchPanelMobile: false,
};

export const useTranslationPageStore = create(
  immer(
    combine(initialState, (set) => ({
      setCurrentChapter: (currentChapter: string) => {
        set((state) => {
          state.currentChapter = currentChapter;
          state.scrollKey = "";
        });
      },
      setScrollKey: (scrollKey: string) => {
        set((state) => {
          state.scrollKey = state.scrollKey === scrollKey ? "" : scrollKey;
        });
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
