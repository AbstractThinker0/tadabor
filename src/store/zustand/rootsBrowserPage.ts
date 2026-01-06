import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface RootsBrowserPageState {
  tabIndex: string;
  verseTab: string;
  searchString: string;
  searchInclusive: boolean;
  scrollKey: string;
}

const initialState: RootsBrowserPageState = {
  tabIndex: "rootsTab",
  verseTab: "",
  searchString: "",
  searchInclusive: false,
  scrollKey: "",
};

export const useRootsBrowserPageStore = create(
  immer(
    combine(initialState, (set) => ({
      setTabIndex: (tabIndex: string) => {
        set((state) => {
          state.tabIndex = tabIndex;
        });
      },
      setVerseTab: (verseTab: string) => {
        set((state) => {
          state.verseTab = verseTab;
          state.tabIndex = "verseTab";
        });
      },
      setSearchString: (searchString: string) => {
        set((state) => {
          state.searchString = searchString;
        });
      },
      setSearchInclusive: (searchInclusive: boolean) => {
        set((state) => {
          state.searchInclusive = searchInclusive;
        });
      },
      setScrollKey: (scrollKey: string) => {
        set((state) => {
          state.scrollKey = scrollKey;
        });
      },
    }))
  )
);
