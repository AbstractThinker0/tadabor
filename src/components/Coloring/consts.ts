import {
  ActionsUnion,
  createActionPayload,
  selectedChaptersType,
  verseProps,
} from "../../types";

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
  SET_CHAPTER_TOKEN = "dispatchSetChapterToken",
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
}

export const clActions = {
  setChapter: createActionPayload<CL_ACTIONS.SET_CHAPTER, number>(
    CL_ACTIONS.SET_CHAPTER
  ),
  setChapterToken: createActionPayload<CL_ACTIONS.SET_CHAPTER_TOKEN, string>(
    CL_ACTIONS.SET_CHAPTER_TOKEN
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
};

export type clActionsProps = ActionsUnion<typeof clActions>;

export interface notesType {
  [key: string]: string;
}

export interface notesDirectionType {
  [key: string]: string;
}

export interface markedNotesType {
  [key: string]: boolean;
}

export enum VS_ACTIONS {
  SET_LOADING_STATE = "dispatchSetLoadingState",
  SET_USER_NOTES = "dspatchSetUserNotes",
  CHANGE_NOTE = "dispatchChangeNote",
  SET_EDITABLE_NOTES = "dispatchSetEditableNotes",
  CHANGE_NOTE_EDITABLE = "dipsatchChangeNoteEditable",
  SET_AREA_DIRECTION = "dispatchSetAreaDirection",
  CHANGE_NOTE_DIRECTION = "dispatchChangeNoteDirection",
  SUBMIT_NOTE = "dispatchSubmitNote",
  DATA_LOADED = "dispatchDataLoaded",
}

export const vsActions = {
  setNote: createActionPayload<
    VS_ACTIONS.CHANGE_NOTE,
    { name: string; value: string }
  >(VS_ACTIONS.CHANGE_NOTE),
  setNoteEditable: createActionPayload<
    VS_ACTIONS.CHANGE_NOTE_EDITABLE,
    { name: string; value: boolean }
  >(VS_ACTIONS.CHANGE_NOTE_EDITABLE),
  setNoteDir: createActionPayload<
    VS_ACTIONS.CHANGE_NOTE_DIRECTION,
    { name: string; value: string }
  >(VS_ACTIONS.CHANGE_NOTE_DIRECTION),
  dataLoaded: createActionPayload<
    VS_ACTIONS.DATA_LOADED,
    {
      extractNotes: notesType;
      markedNotes: markedNotesType;
      extractNotesDir: notesDirectionType;
    }
  >(VS_ACTIONS.DATA_LOADED),
};

export type vsActionsProps = ActionsUnion<typeof vsActions>;
