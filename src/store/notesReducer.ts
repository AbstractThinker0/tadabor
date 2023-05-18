import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserNotesType } from "../types";

export interface NotesState {
  notes: UserNotesType;
}

interface ChangeNotePayload {
  name: string;
  value: string;
}

interface ChangeNoteDirPayload {
  name: string;
  value: string;
}

const initialState: NotesState = { notes: {} };

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    changeNote: (state, action: PayloadAction<ChangeNotePayload>) => {
      const { name, value } = action.payload;

      if (state.notes[name]) {
        state.notes[name].text = value;
      } else {
        state.notes[name] = {
          text: value,
          dir: "rtl",
        };
      }
    },
    changeNoteDir: (state, action: PayloadAction<ChangeNoteDirPayload>) => {
      const { name, value } = action.payload;

      if (state.notes[name]) {
        state.notes[name].dir = value;
      } else {
        state.notes[name] = {
          text: "",
          dir: value,
        };
      }
    },
    notesLoaded: (state, action: PayloadAction<UserNotesType>) => {
      state.notes = action.payload;
    },
  },
});

export const notesActions = notesSlice.actions;

export default notesSlice.reducer;
