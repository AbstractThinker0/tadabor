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

const rootNotesSlice = createSlice({
  name: "rootNotes",
  initialState,
  reducers: {
    changeRootNote: (state, action: PayloadAction<ChangeNotePayload>) => {
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
    changeRootNoteDir: (state, action: PayloadAction<ChangeNoteDirPayload>) => {
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
    rootNotesLoaded: (state, action: PayloadAction<UserNotesType>) => {
      return action.payload;
    },
  },
});

export const rootNotesActions = rootNotesSlice.actions;

export default rootNotesSlice.reducer;
