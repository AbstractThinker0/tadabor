import { selectedChaptersType, verseProps } from "@/types";
import { createActionPayload, ActionsUnion } from "@/types/useReducer";

export interface stateProps {
  currentChapter: number;
  colorsList: coloredProps;
  selectedColors: coloredProps;
  coloredVerses: coloredProps;
  currentVerse: verseProps | null;
  currentColor: colorProps | null;
  selectedChapters: selectedChaptersType;
  scrollKey: string;
}

export interface colorProps {
  colorID: string;
  colorCode: string;
  colorDisplay: string;
}

export interface coloredProps {
  [key: string]: colorProps;
}

export enum CL_ACTIONS {
  SET_CHAPTER = "dispatchSetChapter",
  SET_COLORS_LIST = "dispatchSetColorsList",
  ADD_COLOR = "dispatchAddColor",
  SELECT_COLOR = "dispatchSelectColor",
  DESELECT_COLOR = "dispatchDeselectColor",
  DELETE_COLOR = "dispatchDeleteColor",
  SET_VERSE_COLOR = "dispatchSetVerseColor",
  SET_COLORED_VERSES = "dispatchSetColoredVerses",
  SET_CURRENT_VERSE = "dispatchSetCurrentVerse",
  SET_CURRENT_COLOR = "dispatchSetCurrentColor",
  SET_SELECTED_CHAPTERS = "dispatchSetSelectedChapters",
  TOGGLE_SELECT_CHAPTER = "dispatchToggleSelectChapter",
  SET_SCROLL_KEY = "dispatchSetScrollKey",
  GOTO_CHAPTER = "dispatchGotoChapter",
}

export const clActions = {
  setChapter: createActionPayload<CL_ACTIONS.SET_CHAPTER, number>(
    CL_ACTIONS.SET_CHAPTER
  ),
  setColorsList: createActionPayload<CL_ACTIONS.SET_COLORS_LIST, coloredProps>(
    CL_ACTIONS.SET_COLORS_LIST
  ),
  addColor: createActionPayload<CL_ACTIONS.ADD_COLOR, colorProps>(
    CL_ACTIONS.ADD_COLOR
  ),
  selectColor: createActionPayload<CL_ACTIONS.SELECT_COLOR, colorProps>(
    CL_ACTIONS.SELECT_COLOR
  ),
  deselectColor: createActionPayload<CL_ACTIONS.DESELECT_COLOR, string>(
    CL_ACTIONS.DESELECT_COLOR
  ),
  deleteColor: createActionPayload<CL_ACTIONS.DELETE_COLOR, string>(
    CL_ACTIONS.DELETE_COLOR
  ),
  setVerseColor: createActionPayload<
    CL_ACTIONS.SET_VERSE_COLOR,
    {
      verseKey: string;
      color: colorProps | null;
    }
  >(CL_ACTIONS.SET_VERSE_COLOR),
  setColoredVerses: createActionPayload<
    CL_ACTIONS.SET_COLORED_VERSES,
    coloredProps
  >(CL_ACTIONS.SET_COLORED_VERSES),
  setCurrentVerse: createActionPayload<
    CL_ACTIONS.SET_CURRENT_VERSE,
    verseProps | null
  >(CL_ACTIONS.SET_CURRENT_VERSE),
  setCurrentColor: createActionPayload<
    CL_ACTIONS.SET_CURRENT_COLOR,
    colorProps
  >(CL_ACTIONS.SET_CURRENT_COLOR),
  setSelectedChapters: createActionPayload<
    CL_ACTIONS.SET_SELECTED_CHAPTERS,
    selectedChaptersType
  >(CL_ACTIONS.SET_SELECTED_CHAPTERS),
  toggleSelectChapter: createActionPayload<
    CL_ACTIONS.TOGGLE_SELECT_CHAPTER,
    number
  >(CL_ACTIONS.TOGGLE_SELECT_CHAPTER),
  setScrollKey: createActionPayload<CL_ACTIONS.SET_SCROLL_KEY, string>(
    CL_ACTIONS.SET_SCROLL_KEY
  ),
  gotoChapter: createActionPayload<CL_ACTIONS.GOTO_CHAPTER, number>(
    CL_ACTIONS.GOTO_CHAPTER
  ),
};

export type clActionsProps = ActionsUnion<typeof clActions>;
