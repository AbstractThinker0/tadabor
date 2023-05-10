import {
  createActionPayload,
  quranProps,
  chapterProps,
  verseProps,
  rootProps,
  ActionsUnion,
  notesType,
  markedNotesType,
  notesDirectionType,
} from "../../types";

export interface searchIndexProps {
  name: string;
  key: string;
  text: string;
  wordIndex: string;
}

export interface versePart {
  text: string;
  highlight: boolean;
}

export interface searchResult {
  key: string;
  suraid: string;
  verseid: string;
  verseParts: versePart[];
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
  selectedRootError: boolean;
  searchMethod: SEARCH_METHOD;
  searchingMethod: SEARCH_METHOD;
  searchIndexes: searchIndexProps[];
  searchScope: SEARCH_SCOPE;
  searchingScope: SEARCH_SCOPE;
}

export enum QB_ACTIONS {
  SET_CHAPTERS = "dispatchSetChapters",
  SET_SEARCH_STRING = "dispatchSetSearchString",
  SET_SEARCH_DIACRITICS = "dispatchSetSearchDiacritics",
  SET_SEARCH_IDENTICAL = "dispatchSetSearchIdentical",
  SET_SEARCH_SCOPE = "dispatchSetSearchScope",
  SET_SEARCH_METHOD = "dispatchSetsearchMethod",
  SEARCH_WORD_SUBMIT = "dispatchSetSearchWordSubmit",
  SEARCH_ROOT_SUBMIT = "dispatchSetSearchRootSubmit",
  GOTO_CHAPTER = "dispatchGotoChapter",
}

export enum SEARCH_SCOPE {
  ALL_CHAPTERS = "searchAllChapters",
  MULTIPLE_CHAPTERS = "searchMultipleChapters",
  SINGLE_CHAPTER = "searchSingleChapter",
}

export enum SEARCH_METHOD {
  WORD = "optionWordSearch",
  ROOT = "optionRootSearch",
}

export const qbActions = {
  setChapters: createActionPayload<QB_ACTIONS.SET_CHAPTERS, string[]>(
    QB_ACTIONS.SET_CHAPTERS
  ),
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
  setSearchScope: createActionPayload<
    QB_ACTIONS.SET_SEARCH_SCOPE,
    SEARCH_SCOPE
  >(QB_ACTIONS.SET_SEARCH_SCOPE),
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
};

export type qbActionsProps = ActionsUnion<typeof qbActions>;

export enum DP_ACTIONS {
  CHANGE_NOTE = "dispatchChangeNote",
  CHANGE_NOTE_EDITABLE = "dipsatchChangeNoteEditable",
  CHANGE_NOTE_DIRECTION = "dispatchChangeNoteDirection",
  DATA_LOADED = "dispatchDataLoaded",
  SET_SCROLL_KEY = "dispatchSetScrollKey",
}

export const dpActions = {
  setNote: createActionPayload<
    DP_ACTIONS.CHANGE_NOTE,
    { name: string; value: string }
  >(DP_ACTIONS.CHANGE_NOTE),
  setNoteEditable: createActionPayload<
    DP_ACTIONS.CHANGE_NOTE_EDITABLE,
    { name: string; value: boolean }
  >(DP_ACTIONS.CHANGE_NOTE_EDITABLE),
  setNoteDir: createActionPayload<
    DP_ACTIONS.CHANGE_NOTE_DIRECTION,
    { name: string; value: string }
  >(DP_ACTIONS.CHANGE_NOTE_DIRECTION),
  dataLoaded: createActionPayload<
    DP_ACTIONS.DATA_LOADED,
    {
      extractNotes: notesType;
      markedNotes: markedNotesType;
      extractNotesDir: notesDirectionType;
    }
  >(DP_ACTIONS.DATA_LOADED),
  setScrollKey: createActionPayload<DP_ACTIONS.SET_SCROLL_KEY, string | null>(
    DP_ACTIONS.SET_SCROLL_KEY
  ),
};

export type dpActionsProps = ActionsUnion<typeof dpActions>;
