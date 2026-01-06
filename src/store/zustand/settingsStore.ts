import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
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

export const useSettingsStore = create(
  immer(
    combine(initialState, (set) => ({
      setQuranFS: (size: number) => {
        set((state) => {
          state.quranFontSize = size;
        });
      },
      setNotesFS: (size: number) => {
        set((state) => {
          state.notesFontSize = size;
        });
      },
      setQuranFont: (font: string) => {
        set((state) => {
          state.quranFont = font;
        });
      },
      setNotesFont: (font: string) => {
        set((state) => {
          state.notesFont = font;
        });
      },
    }))
  )
);
