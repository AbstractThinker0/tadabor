import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const keyCenterVerses = "centerVerses";
const defaultCenterVerses = localStorage.getItem(keyCenterVerses) === "true";

const keyToolsMode = "toolsMode";
const defaultToolsMode = (localStorage.getItem(keyToolsMode) ||
  "expanded") as ToolsMode;

export type ToolsMode = "expanded" | "collapsed" | "hidden";

const keyToolCopy = "toolCopy";
const defaultToolCopy = localStorage.getItem(keyToolCopy) !== "false";
const keyToolNote = "toolNote";
const defaultToolNote = localStorage.getItem(keyToolNote) !== "false";
const keyToolInspect = "toolInspect";
const defaultToolInspect = localStorage.getItem(keyToolInspect) === "true";

export type VerseDisplay = "line" | "panel" | "continous";

const keyVerseDisplay = "verseDisplay";
const defaultVerseDisplay = (localStorage.getItem(keyVerseDisplay) ||
  "line") as VerseDisplay;

interface NavigationState {
  currentPage: string;
  centerVerses: boolean;
  toolsMode: ToolsMode;
  toolCopy: boolean;
  toolNote: boolean;
  toolInspect: boolean;
  verseDisplay: VerseDisplay;
  isSmallScreen: boolean;
  isBetaVersion: boolean;
}

const initialState: NavigationState = {
  currentPage: "",
  centerVerses: defaultCenterVerses,
  toolsMode: defaultToolsMode,
  toolCopy: defaultToolCopy,
  toolNote: defaultToolNote,
  toolInspect: defaultToolInspect,
  verseDisplay: defaultVerseDisplay,
  isSmallScreen: window.innerWidth <= 768 || window.innerHeight <= 480,
  isBetaVersion: localStorage.getItem("betaVersion") === "true",
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setCenterVerses: (state, action: PayloadAction<boolean>) => {
      state.centerVerses = action.payload;
      localStorage.setItem(keyCenterVerses, action.payload ? "true" : "false");
    },
    toggleCenterVerses: (state) => {
      state.centerVerses = !state.centerVerses;
      localStorage.setItem(
        keyCenterVerses,
        state.centerVerses ? "true" : "false"
      );
    },
    setVerseTools: (state, action: PayloadAction<string>) => {
      state.toolsMode = action.payload as ToolsMode;
      localStorage.setItem(keyToolsMode, action.payload);
    },
    setToolCopy: (state, action: PayloadAction<boolean>) => {
      state.toolCopy = action.payload;
      localStorage.setItem(keyToolCopy, action.payload ? "true" : "false");
    },
    setToolNote: (state, action: PayloadAction<boolean>) => {
      state.toolNote = action.payload;
      localStorage.setItem(keyToolNote, action.payload ? "true" : "false");
    },
    setToolInspect: (state, action: PayloadAction<boolean>) => {
      state.toolInspect = action.payload;
      localStorage.setItem(keyToolInspect, action.payload ? "true" : "false");
    },
    setVerseDisplay: (state, action: PayloadAction<string>) => {
      state.verseDisplay = action.payload as VerseDisplay;
      localStorage.setItem(keyVerseDisplay, action.payload);
    },
    setSmallScreen: (state, action: PayloadAction<boolean>) => {
      state.isSmallScreen = action.payload;
    },
    setBetaStatus: (state, action: PayloadAction<boolean>) => {
      state.isBetaVersion = action.payload;

      localStorage.setItem("betaVersion", action.payload ? "true" : "false");
    },
  },
});

export const navigationActions = navigationSlice.actions;

export default navigationSlice.reducer;
