import { nfsDefault, nfsStored, qfsDefault, qfsStored } from "@/util/consts";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  quranFontSize: number;
  notesFontSize: number;
}

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

const initialState: SettingsState = {
  quranFontSize: getInitialQFS(),
  notesFontSize: getInitialNFS(),
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
  },
});

export const settingsActions = settingsSlice.actions;

export default settingsSlice.reducer;
