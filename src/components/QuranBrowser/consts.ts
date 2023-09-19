import {
  createActionPayload,
  quranProps,
  chapterProps,
  verseProps,
  rootProps,
  ActionsUnion,
  IMatch,
  searchIndexProps,
} from "../../types";

export interface searchResult {
  key: string;
  suraid: string;
  verseid: string;
  verseParts: IMatch[];
}

export interface qbStateProps {
  selectChapter: number;
  selectedChapters: string[];
  searchString: string;
  searchingString: string;
  searchingChapters: string[];
  searchResult: searchResult[];
  searchDiacritics: boolean;
  searchIdentical: boolean;
  searchError: boolean;
  searchMethod: SEARCH_METHOD;
  searchingMethod: SEARCH_METHOD;
  searchIndexes: searchIndexProps[];
  scrollKey: string;
}

export enum QB_ACTIONS {
  SET_SELECTED_CHAPTERS = "dispatchSetChapters",
  SET_SEARCH_STRING = "dispatchSetSearchString",
  SET_SEARCH_DIACRITICS = "dispatchSetSearchDiacritics",
  SET_SEARCH_IDENTICAL = "dispatchSetSearchIdentical",
  SET_SEARCH_METHOD = "dispatchSetsearchMethod",
  SEARCH_WORD_SUBMIT = "dispatchSetSearchWordSubmit",
  SEARCH_ROOT_SUBMIT = "dispatchSetSearchRootSubmit",
  GOTO_CHAPTER = "dispatchGotoChapter",
  SET_SCROLL_KEY = "dispatchSetScrollKey",
}

export enum SEARCH_METHOD {
  WORD = "optionWordSearch",
  ROOT = "optionRootSearch",
}

export const qbActions = {
  setSelectedChapters: createActionPayload<
    QB_ACTIONS.SET_SELECTED_CHAPTERS,
    string[]
  >(QB_ACTIONS.SET_SELECTED_CHAPTERS),
  setSearchString: createActionPayload<QB_ACTIONS.SET_SEARCH_STRING, string>(
    QB_ACTIONS.SET_SEARCH_STRING
  ),
  setSearchDiacritics: createActionPayload<
    QB_ACTIONS.SET_SEARCH_DIACRITICS,
    boolean
  >(QB_ACTIONS.SET_SEARCH_DIACRITICS),
  setSearchIdentical: createActionPayload<
    QB_ACTIONS.SET_SEARCH_IDENTICAL,
    boolean
  >(QB_ACTIONS.SET_SEARCH_IDENTICAL),
  setSearchMethod: createActionPayload<
    QB_ACTIONS.SET_SEARCH_METHOD,
    SEARCH_METHOD
  >(QB_ACTIONS.SET_SEARCH_METHOD),
  submitWordSearch: createActionPayload<
    QB_ACTIONS.SEARCH_WORD_SUBMIT,
    { allQuranText: quranProps[]; chapterNames: chapterProps[] }
  >(QB_ACTIONS.SEARCH_WORD_SUBMIT),
  submitRootSearch: createActionPayload<
    QB_ACTIONS.SEARCH_ROOT_SUBMIT,
    {
      absoluteQuran: verseProps[];
      chapterNames: chapterProps[];
      quranRoots: rootProps[];
    }
  >(QB_ACTIONS.SEARCH_ROOT_SUBMIT),
  gotoChapter: createActionPayload<QB_ACTIONS.GOTO_CHAPTER, string>(
    QB_ACTIONS.GOTO_CHAPTER
  ),
  setScrollKey: createActionPayload<QB_ACTIONS.SET_SCROLL_KEY, string>(
    QB_ACTIONS.SET_SCROLL_KEY
  ),
};

export type qbActionsProps = ActionsUnion<typeof qbActions>;
