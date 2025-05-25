import {
  fontsList,
  qfDefault,
  qfStored,
  nfStored,
  nfDefault,
  nfsDefault,
  nfsStored,
  qfsDefault,
  qfsStored,
} from "@/util/consts";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const getInitialQFS = () => {
  const stored = parseFloat(localStorage.getItem(qfsStored) || "");

  if (isNaN(stored) || stored < 1 || stored > 4) {
    localStorage.setItem(qfsStored, String(qfsDefault));
    return qfsDefault;
  }

  return stored;
};

const getInitialNFS = () => {
  const stored = parseFloat(localStorage.getItem(nfsStored) || "");

  if (isNaN(stored) || stored < 1 || stored > 4) {
    localStorage.setItem(nfsStored, String(nfsDefault));
    return nfsDefault;
  }

  return stored;
};

const getInitialQF = () => {
  const stored = localStorage.getItem(qfStored) || "";

  if (!fontsList.includes(stored)) {
    localStorage.setItem(qfStored, qfDefault);
    return qfDefault;
  }

  return stored;
};

const getInitialNF = () => {
  const stored = localStorage.getItem(nfStored) || "";

  if (!fontsList.includes(stored)) {
    localStorage.setItem(nfStored, nfDefault);
    return nfDefault;
  }

  return stored;
};

interface SettingsState {
  quranFontSize: number;
  notesFontSize: number;
  quranFont: string;
  notesFont: string;
}

const initialState: SettingsState = {
  quranFontSize: getInitialQFS(),
  notesFontSize: getInitialNFS(),
  quranFont: getInitialQF(),
  notesFont: getInitialNF(),
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setQuranFS: (state, action: PayloadAction<number>) => {
      state.quranFontSize = action.payload;
    },
    setNotesFS: (state, action: PayloadAction<number>) => {
      state.notesFontSize = action.payload;
    },
    setQuranFont: (state, action: PayloadAction<string>) => {
      state.quranFont = action.payload;
    },
    setNotesFont: (state, action: PayloadAction<string>) => {
      state.notesFont = action.payload;
    },
  },
});

export const settingsActions = settingsSlice.actions;

export default settingsSlice.reducer;
