import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import quranClass from "@/util/quranService";

import { quranSearcher } from "@/util/quranSearch";

import {
  verseMatchResult,
  searchIndexProps,
  selectedChaptersType,
} from "@/types";

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
      state.searchingChapters = filteredChapters.map((chapterID) =>
        quranService.getChapterName(chapterID)
      );
      state.scrollKey = "";

      const result = quranSearcher.byWord(
        state.searchString,
        quranService,
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
      state.searchingChapters = filteredChapters.map((chapterID) =>
        quranService.getChapterName(chapterID)
      );
      state.scrollKey = "";

      const result = quranSearcher.byRoot(
        state.searchString,
        quranService,
        filteredChapters
      );

      if (result) {
        state.searchResult = result.matchVerses;
        state.searchIndexes = result.derivations;
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
    },
    setScrollKey: (state, action: PayloadAction<string>) => {
      state.scrollKey =
        state.scrollKey === action.payload ? "" : action.payload;
    },
  },
});

export const qbPageActions = qbPageSlice.actions;

export default qbPageSlice.reducer;
