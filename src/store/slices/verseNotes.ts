import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserNotesType } from "@/types";

interface ChangeNotePayload {
  name: string;
  value: string;
}

interface ChangeNoteDirPayload {
  name: string;
  value: string;
}

const initialState: UserNotesType = {};

const verseNotesSlice = createSlice({
  name: "verseNotes",
  initialState,
  reducers: {
    changeNote: (state, action: PayloadAction<ChangeNotePayload>) => {
      const { name, value } = action.payload;

      if (state[name]) {
        state[name].text = value;
      } else {
        state[name] = {
          text: value,
          dir: "",
        };
      }
    },
    changeNoteDir: (state, action: PayloadAction<ChangeNoteDirPayload>) => {
      const { name, value } = action.payload;

      if (state[name]) {
        state[name].dir = value;
      } else {
        state[name] = {
          text: "",
          dir: value,
        };
      }
    },
    notesLoaded: (state, action: PayloadAction<UserNotesType>) => {
      return action.payload;
    },
  },
});

export const verseNotesActions = verseNotesSlice.actions;

export default verseNotesSlice.reducer;
