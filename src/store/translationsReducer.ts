import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { translationsType } from "../types";

interface ChangeTranslationPayload {
  name: string;
  value: string;
}

const initialState: translationsType = {};

export const translationsSlice = createSlice({
  name: "translations",
  initialState,
  reducers: {
    changeTranslation: (
      state,
      action: PayloadAction<ChangeTranslationPayload>
    ) => {
      const { name, value } = action.payload;

      state[name] = value;
    },
    translationsLoaded: (state, action: PayloadAction<translationsType>) => {
      return action.payload;
    },
  },
});

export const translationsActions = translationsSlice.actions;

export default translationsSlice.reducer;
