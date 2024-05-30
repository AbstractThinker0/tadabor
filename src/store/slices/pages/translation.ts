import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TranslationPageState {
  currentChapter: number;
}

const initialState: TranslationPageState = {
  currentChapter: 1,
};

const translationPageSlice = createSlice({
  name: "translationPage",
  initialState,
  reducers: {
    setCurrentChapter: (state, action: PayloadAction<number>) => {
      state.currentChapter = action.payload;
    },
  },
});

export const translationPageActions = translationPageSlice.actions;

export default translationPageSlice.reducer;
