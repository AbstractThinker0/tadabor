import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  quranClass,
  verseMatchResult,
  searchIndexProps,
} from "quran-tools";

import type { selectedChaptersType } from "@/types";

import { SEARCH_METHOD } from "@/components/Pages/QuranBrowser/consts";
import { initialSelectedChapters } from "@/util/consts";

interface qbStateProps {
  selectChapter: number;
  selectedChapters: selectedChaptersType;
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

const initialState: qbStateProps = {
  selectChapter: 1,
  selectedChapters: initialSelectedChapters,
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

const qbPageSlice = createSlice({
  name: "qbPage",
  initialState,
  reducers: {
    setSelectedChapters: (
      state,
      action: PayloadAction<selectedChaptersType>
    ) => {
      state.selectedChapters = action.payload;
    },
    toggleSelectChapter: (state, action: PayloadAction<number>) => {
      state.selectedChapters[action.payload] =
        !state.selectedChapters[action.payload];
    },
    setSearchString: (state, action: PayloadAction<string>) => {
      state.searchString = action.payload;
    },
    setSearchDiacritics: (state, action: PayloadAction<boolean>) => {
      state.searchDiacritics = action.payload;
    },
    setSearchIdentical: (state, action: PayloadAction<boolean>) => {
      state.searchIdentical = action.payload;
      state.searchStart = false;
    },
    setSearchStart: (state, action: PayloadAction<boolean>) => {
      state.searchStart = action.payload;
      state.searchIdentical = false;
    },
    setSearchMethod: (state, action: PayloadAction<SEARCH_METHOD>) => {
      state.searchMethod = action.payload;
    },
    submitWordSearch: (
      state,
      action: PayloadAction<{ quranInstance: quranClass }>
    ) => {
      const quranService = action.payload.quranInstance;
      const filteredChapters = Object.keys(state.selectedChapters).filter(
        (chapterID) => state.selectedChapters[chapterID]
      );

      state.searchResult = [];
      state.searchIndexes = [];
      state.searchingString = state.searchString;
      state.searchingMethod = state.searchMethod;
      state.searchingChapters = filteredChapters;
      state.scrollKey = "";

      const result = quranService.searchByWord(
        state.searchString,
        filteredChapters,
        {
          searchDiacritics: state.searchDiacritics,
          searchIdentical: state.searchIdentical,
          searchStart: state.searchStart,
        }
      );

      if (result) {
        state.searchError = false;
        state.searchResult = result;
      } else {
        state.searchError = true;
      }
    },
    submitRootSearch: (
      state,
      action: PayloadAction<{ quranInstance: quranClass }>
    ) => {
      const quranService = action.payload.quranInstance;
      const filteredChapters = Object.keys(state.selectedChapters).filter(
        (chapterID) => state.selectedChapters[chapterID]
      );

      state.searchResult = [];
      state.searchIndexes = [];
      state.searchingString = state.searchString;
      state.searchingMethod = state.searchMethod;
      state.searchingChapters = filteredChapters;
      state.scrollKey = "";

      const result = quranService.searchByRoot(
        state.searchString,
        filteredChapters
      );

      if (result) {
        state.searchResult = result.matchVerses;
        state.searchIndexes = result.derivations;
        state.searchError = false;
      } else {
        state.searchError = true;
      }
    },
    gotoChapter: (state, action: PayloadAction<string>) => {
      state.searchError = false;
      state.searchResult = [];
      state.searchIndexes = [];
      state.selectChapter = Number(action.payload);
      state.scrollKey = "";
      state.searchingString = "";
    },
    setScrollKey: (state, action: PayloadAction<string>) => {
      state.scrollKey =
        state.scrollKey === action.payload ? "" : action.payload;
    },
    setSearchPanel: (state, action: PayloadAction<boolean>) => {
      state.showSearchPanel = action.payload;
      state.showSearchPanelMobile = action.payload;
    },
  },
});

export const qbPageActions = qbPageSlice.actions;

export default qbPageSlice.reducer;
