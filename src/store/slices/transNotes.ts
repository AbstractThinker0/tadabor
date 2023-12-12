import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransNotesType } from "@/types";

interface ChangeTranslationPayload {
  name: string;
  value: string;
}

const initialState: TransNotesType = {};

const transNotesSlice = createSlice({
  name: "transNotes",
  initialState,
  reducers: {
    changeTranslation: (
      state,
      action: PayloadAction<ChangeTranslationPayload>
    ) => {
      const { name, value } = action.payload;

      state[name] = value;
    },
    translationsLoaded: (state, action: PayloadAction<TransNotesType>) => {
      return action.payload;
    },
  },
});

export const transNotesActions = transNotesSlice.actions;

export default transNotesSlice.reducer;
