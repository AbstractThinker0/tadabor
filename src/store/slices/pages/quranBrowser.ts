import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import quranClass from "@/util/quranService";
import {
  getDerivationsInVerse,
  normalizeAlif,
  onlySpaces,
  removeDiacritics,
  searchVerse,
} from "@/util/util";

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
    },
    setSearchStart: (state, action: PayloadAction<boolean>) => {
      state.searchStart = action.payload;
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

      // Check if we are search with diacrtics or they should be stripped off
      const normalizedToken = state.searchDiacritics
        ? state.searchString
        : normalizeAlif(removeDiacritics(state.searchString));

      // If an empty search token don't initiate a search
      if (onlySpaces(normalizedToken)) {
        state.searchError = true;
        return;
      }

      const matchVerses: verseMatchResult[] = [];

      filteredChapters.forEach((chapter) => {
        quranService.getVerses(chapter).forEach((verse) => {
          const result = searchVerse(
            verse,
            normalizedToken,
            state.searchIdentical,
            state.searchDiacritics,
            state.searchStart
          );

          if (result) {
            matchVerses.push(result);
          }
        });
      });

      if (matchVerses.length === 0) {
        state.searchError = true;
      } else {
        state.searchError = false;
        state.searchResult = matchVerses;
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

      if (onlySpaces(state.searchString)) {
        state.searchError = true;
        return;
      }

      const rootTarget = quranService.getRootByName(state.searchString);

      if (rootTarget === undefined) {
        state.searchError = true;
        return;
      }

      const occurencesArray = rootTarget.occurences;

      const matchVerses: verseMatchResult[] = [];
      const derivations: searchIndexProps[] = [];

      if (filteredChapters.length) {
        occurencesArray.forEach((item) => {
          const info = item.split(":");
          const currentVerse = quranService.getVerseByRank(info[0]);

          if (filteredChapters.includes(currentVerse.suraid)) {
            const wordIndexes = info[1].split(",");

            const chapterName = quranService.getChapterName(
              currentVerse.suraid
            );

            const { verseDerivations, verseResult } = getDerivationsInVerse(
              wordIndexes,
              currentVerse,
              chapterName
            );

            derivations.push(...verseDerivations);
            matchVerses.push(verseResult);
          }
        });
      }

      if (matchVerses.length === 0) {
        state.searchError = true;
      } else {
        state.searchResult = matchVerses;
        state.searchIndexes = derivations;
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
