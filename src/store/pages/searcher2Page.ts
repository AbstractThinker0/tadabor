import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Searcher2PageState {
  verseTab: string;
  tabIndex: string;
  searchString: string;
  searchIdentical: boolean;
  searchDiacritics: boolean;
  searchStart: boolean;
  scrollKey: string;
}

const initialState: Searcher2PageState = {
  verseTab: "",
  tabIndex: "searcherTab",
  searchString: "",
  searchIdentical: false,
  searchDiacritics: false,
  searchStart: false,
  scrollKey: "",
};

export const useSearcher2PageStore = create(
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
      setSearchDiacritics: (searchDiacritics: boolean) => {
        set((state) => {
          state.searchDiacritics = searchDiacritics;
        });
      },
      setSearchIdentical: (searchIdentical: boolean) => {
        set((state) => {
          state.searchIdentical = searchIdentical;
          state.searchStart = false;
        });
      },
      setSearchStart: (searchStart: boolean) => {
        set((state) => {
          state.searchStart = searchStart;
          state.searchIdentical = false;
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
