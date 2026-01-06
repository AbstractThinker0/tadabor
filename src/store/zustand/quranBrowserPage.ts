import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type {
  quranClass,
  verseMatchResult,
  searchIndexProps,
} from "quran-tools";

import type { selectedChaptersType } from "@/types";
import { SEARCH_METHOD } from "@/components/Pages/QuranBrowser/consts";
import { initialSelectedChapters } from "@/util/consts";

interface QuranBrowserPageState {
  selectChapter: number;
  selectedChapters: selectedChaptersType;
  selectedVerse: string;
  searchString: string;
  searchingString: string;
  searchingChapters: string[];
  searchResult: verseMatchResult[];
  searchDiacritics: boolean;
  searchIdentical: boolean;
  searchStart: boolean;
  searchError: boolean;
  searchMethod: SEARCH_METHOD;
  searchingMethod: SEARCH_METHOD;
  searchIndexes: searchIndexProps[];
  scrollKey: string;
  showSearchPanel: boolean;
  showSearchPanelMobile: boolean;
}

const initialState: QuranBrowserPageState = {
  selectChapter: 1,
  selectedChapters: initialSelectedChapters,
  selectedVerse: "",
  searchString: "",
  searchingString: "",
  searchingChapters: [],
  searchResult: [],
  searchDiacritics: false,
  searchIdentical: false,
  searchStart: false,
  searchError: false,
  searchMethod: SEARCH_METHOD.WORD,
  searchingMethod: SEARCH_METHOD.WORD,
  searchIndexes: [],
  scrollKey: "",
  showSearchPanel: true,
  showSearchPanelMobile: false,
};

export const useQuranBrowserPageStore = create(
  immer(
    combine(initialState, (set, get) => ({
      setSelectedChapters: (selectedChapters: selectedChaptersType) => {
        set((state) => {
          state.selectedChapters = selectedChapters;
        });
      },
      toggleSelectChapter: (chapter: number) => {
        set((state) => {
          state.selectedChapters[chapter] = !state.selectedChapters[chapter];
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
      setSearchMethod: (searchMethod: SEARCH_METHOD) => {
        set((state) => {
          state.searchMethod = searchMethod;
        });
      },
      submitWordSearch: (quranInstance: quranClass) => {
        const {
          searchString,
          searchMethod,
          selectedChapters,
          searchDiacritics,
          searchIdentical,
          searchStart,
        } = get();

        const filteredChapters = Object.keys(selectedChapters).filter(
          (chapterID) => selectedChapters[chapterID]
        );

        set((state) => {
          state.searchResult = [];
          state.searchIndexes = [];
          state.searchingString = searchString;
          state.searchingMethod = searchMethod;
          state.searchingChapters = filteredChapters;
          state.scrollKey = "";
        });

        const result = quranInstance.searchByWord(
          searchString,
          filteredChapters,
          {
            searchDiacritics,
            searchIdentical,
            searchStart,
          }
        );

        set((state) => {
          if (result) {
            state.searchError = false;
            state.searchResult = result;
          } else {
            state.searchError = true;
          }
        });
      },
      submitRootSearch: (quranInstance: quranClass) => {
        const { searchString, searchMethod, selectedChapters } = get();

        const filteredChapters = Object.keys(selectedChapters).filter(
          (chapterID) => selectedChapters[chapterID]
        );

        set((state) => {
          state.searchResult = [];
          state.searchIndexes = [];
          state.searchingString = searchString;
          state.searchingMethod = searchMethod;
          state.searchingChapters = filteredChapters;
          state.scrollKey = "";
        });

        const result = quranInstance.searchByRoot(
          searchString,
          filteredChapters
        );

        set((state) => {
          if (result) {
            state.searchResult = result.matchVerses;
            state.searchIndexes = result.derivations;
            state.searchError = false;
          } else {
            state.searchError = true;
          }
        });
      },
      gotoChapter: (chapter: string) => {
        set((state) => {
          state.searchError = false;
          state.searchResult = [];
          state.searchIndexes = [];
          state.selectChapter = Number(chapter);
          state.scrollKey = "";
          state.searchingString = "";
          state.selectedVerse = "";
        });
      },
      setSelectedVerse: (selectedVerse: string) => {
        set((state) => {
          state.selectedVerse = selectedVerse;
          state.scrollKey = selectedVerse;
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
