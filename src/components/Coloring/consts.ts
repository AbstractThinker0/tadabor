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
}
