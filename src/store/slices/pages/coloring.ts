import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { selectedChaptersType, verseProps } from "@/types";
import { coloredProps, colorProps } from "@/components/Pages/Coloring/consts";
import { initialSelectedChapters } from "@/util/consts";

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

const initialState: stateProps = {
  currentChapter: 1,
  colorsList: {},
  selectedColors: {},
  coloredVerses: {},
  currentVerse: null,
  currentColor: null,
  selectedChapters: initialSelectedChapters,
  scrollKey: "",
};

const coloringPageSlice = createSlice({
  name: "coloringPage",
  initialState,
  reducers: {
    setChapter: (state, action: PayloadAction<number>) => {
      state.currentChapter = action.payload;
      state.scrollKey = "";
    },
    setColorsList: (state, action: PayloadAction<coloredProps>) => {
      state.colorsList = action.payload;
    },
    addColor: (state, action: PayloadAction<colorProps>) => {
      const newColor = action.payload;

      state.colorsList[newColor.colorID] = newColor;
    },
    selectColor: (state, action: PayloadAction<colorProps>) => {
      const newColor = action.payload;

      state.selectedColors[newColor.colorID] = newColor;
    },
    deselectColor: (state, action: PayloadAction<string>) => {
      delete state.selectedColors[action.payload];
    },
    deleteColor: (state, action: PayloadAction<string>) => {
      delete state.colorsList[action.payload];

      for (const verseKey in state.coloredVerses) {
        if (state.coloredVerses[verseKey].colorID === action.payload) {
          delete state.coloredVerses[verseKey];
        }
      }

      delete state.selectedColors[action.payload];
    },
    setVerseColor: (
      state,
      action: PayloadAction<{ verseKey: string; color: colorProps | null }>
    ) => {
      if (action.payload.color == null) {
        delete state.coloredVerses[action.payload.verseKey];
      } else {
        state.coloredVerses[action.payload.verseKey] = action.payload.color;
      }
    },
    setColoredVerses: (state, action: PayloadAction<coloredProps>) => {
      state.coloredVerses = action.payload;
    },
    setCurrentVerse: (state, action: PayloadAction<verseProps | null>) => {
      state.currentVerse = action.payload;
    },
    setCurrentColor: (state, action: PayloadAction<colorProps>) => {
      state.currentColor = action.payload;
    },
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
    setScrollKey: (state, action: PayloadAction<string>) => {
      state.scrollKey =
        state.scrollKey === action.payload ? "" : action.payload;
    },
    gotoChapter: (state, action: PayloadAction<number>) => {
      state.selectedColors = {};
      state.currentChapter = action.payload;
    },
  },
});

export const coloringPageActions = coloringPageSlice.actions;

export default coloringPageSlice.reducer;
