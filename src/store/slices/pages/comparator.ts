import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ComparatorPageState {
  currentChapter: string;
  currentVerse: string;
}

const initialState: ComparatorPageState = {
  currentChapter: "1",
  currentVerse: "",
};

const comparatorPageSlice = createSlice({
  name: "comparatorPage",
  initialState,
  reducers: {
    setCurrentChapter: (state, action: PayloadAction<string>) => {
      state.currentChapter = action.payload;
    },
    setCurrentVerse: (state, action: PayloadAction<string>) => {
      state.currentVerse = action.payload;
    },
  },
});

export const comparatorPageActions = comparatorPageSlice.actions;

export default comparatorPageSlice.reducer;
