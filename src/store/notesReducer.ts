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
      if (state.notes[action.payload.name]) {
        state.notes[action.payload.name].text = action.payload.value;
      } else {
        state.notes[action.payload.name] = {
          text: action.payload.value,
          dir: "rtl",
        };
      }
    },
    changeNoteDir: (state, action: PayloadAction<ChangeNoteDirPayload>) => {
      if (state.notes[action.payload.name]) {
        state.notes[action.payload.name].dir = action.payload.value;
      } else {
        state.notes[action.payload.name] = {
          text: "",
          dir: action.payload.value,
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
