import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Searcher2PageState {
  verseTab: string;
  showQuranTab: boolean;
  searchString: string;
  searchIdentical: boolean;
  searchDiacritics: boolean;
  searchStart: boolean;
}

const initialState: Searcher2PageState = {
  verseTab: "",
  showQuranTab: false,
  searchString: "",
  searchIdentical: false,
  searchDiacritics: false,
  searchStart: false,
};

const searcher2PageSlice = createSlice({
  name: "searcher2Page",
  initialState,
  reducers: {
    setShowQuranTab: (state, action: PayloadAction<boolean>) => {
      state.showQuranTab = action.payload;
    },
    setVerseTab: (state, action: PayloadAction<string>) => {
      //
      state.verseTab = action.payload;
      state.showQuranTab = true;
    },
    setSearchString: (state, action: PayloadAction<string>) => {
      //
      state.searchString = action.payload;
    },
    setSearchIdentical: (state, action: PayloadAction<boolean>) => {
      state.searchIdentical = action.payload;
    },
    setSearchDiacritics: (state, action: PayloadAction<boolean>) => {
      state.searchDiacritics = action.payload;
    },
    setSearchStart: (state, action: PayloadAction<boolean>) => {
      state.searchStart = action.payload;
    },
  },
});

export const searcher2PageActions = searcher2PageSlice.actions;

export default searcher2PageSlice.reducer;
