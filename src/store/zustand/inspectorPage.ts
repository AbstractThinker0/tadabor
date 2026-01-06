import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface InspectorPageState {
  currentChapter: string;
  scrollKey: string;
  showSearchPanel: boolean;
  showSearchPanelMobile: boolean;
}

const initialState: InspectorPageState = {
  currentChapter: "1",
  scrollKey: "",
  showSearchPanel: true,
  showSearchPanelMobile: false,
};

export const useInspectorPageStore = create(
  immer(
    combine(initialState, (set) => ({
      setCurrentChapter: (currentChapter: string) => {
        set((state) => {
          state.currentChapter = currentChapter;
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
