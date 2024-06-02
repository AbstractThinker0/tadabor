import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TranslationPageState {
  currentChapter: number;
  scrollKey: string;
}

const initialState: TranslationPageState = {
  currentChapter: 1,
  scrollKey: "",
};

const translationPageSlice = createSlice({
  name: "translationPage",
  initialState,
  reducers: {
    setCurrentChapter: (state, action: PayloadAction<number>) => {
      state.currentChapter = action.payload;
      state.scrollKey = "";
    },
    setScrollKey: (state, action: PayloadAction<string>) => {
      state.scrollKey =
        state.scrollKey === action.payload ? "" : action.payload;
    },
  },
});

export const translationPageActions = translationPageSlice.actions;

export default translationPageSlice.reducer;
