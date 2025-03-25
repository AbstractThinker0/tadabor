import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Searcher2PageState {
  verseTab: string;
  tabIndex: string;
  searchString: string;
  searchIdentical: boolean;
  searchDiacritics: boolean;
  searchStart: boolean;
  scrollKey: string;
}

const initialState: Searcher2PageState = {
  verseTab: "",
  tabIndex: "searcherTab",
  searchString: "",
  searchIdentical: false,
  searchDiacritics: false,
  searchStart: false,
  scrollKey: "",
};

const searcher2PageSlice = createSlice({
  name: "searcher2Page",
  initialState,
  reducers: {
    setTabIndex: (state, action: PayloadAction<string>) => {
      state.tabIndex = action.payload;
    },
    setVerseTab: (state, action: PayloadAction<string>) => {
      //
      state.verseTab = action.payload;
      state.tabIndex = "verseTab";
    },
    setSearchString: (state, action: PayloadAction<string>) => {
      //
      state.searchString = action.payload;
    },
    setSearchDiacritics: (state, action: PayloadAction<boolean>) => {
      state.searchDiacritics = action.payload;
    },
    setSearchIdentical: (state, action: PayloadAction<boolean>) => {
      state.searchIdentical = action.payload;
      state.searchStart = false;
    },
    setSearchStart: (state, action: PayloadAction<boolean>) => {
      state.searchStart = action.payload;
      state.searchIdentical = false;
    },
    setScrollKey: (state, action: PayloadAction<string>) => {
      state.scrollKey = action.payload;
    },
  },
});

export const searcher2PageActions = searcher2PageSlice.actions;

export default searcher2PageSlice.reducer;
