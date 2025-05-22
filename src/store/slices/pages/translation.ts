import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TranslationPageState {
  currentChapter: string;
  scrollKey: string;
  showSearchPanel: boolean;
  showSearchPanelMobile: boolean;
}

const initialState: TranslationPageState = {
  currentChapter: "1",
  scrollKey: "",
  showSearchPanel: true,
  showSearchPanelMobile: false,
};

const translationPageSlice = createSlice({
  name: "translationPage",
  initialState,
  reducers: {
    setCurrentChapter: (state, action: PayloadAction<string>) => {
      state.currentChapter = action.payload;
      state.scrollKey = "";
    },
    setScrollKey: (state, action: PayloadAction<string>) => {
      state.scrollKey =
        state.scrollKey === action.payload ? "" : action.payload;
    },
    setSearchPanel: (state, action: PayloadAction<boolean>) => {
      state.showSearchPanel = action.payload;
      state.showSearchPanelMobile = action.payload;
    },
  },
});

export const translationPageActions = translationPageSlice.actions;

export default translationPageSlice.reducer;
