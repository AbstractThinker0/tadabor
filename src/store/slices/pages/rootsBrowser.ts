import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface rbStateProps {
  tabIndex: number;
  verseTab: string;
  searchString: string;
  searchInclusive: boolean;
  scrollKey: string;
}

const initialState: rbStateProps = {
  tabIndex: 0,
  verseTab: "",
  searchString: "",
  searchInclusive: false,
  scrollKey: "",
};

const rbPageSlice = createSlice({
  name: "rbPage",
  initialState,
  reducers: {
    setTabIndex: (state, action: PayloadAction<number>) => {
      state.tabIndex = action.payload;
    },
    setVerseTab: (state, action: PayloadAction<string>) => {
      state.verseTab = action.payload;
      state.tabIndex = 1;
    },
    setSearchString: (state, action: PayloadAction<string>) => {
      state.searchString = action.payload;
    },
    setSearchInclusive: (state, action: PayloadAction<boolean>) => {
      state.searchInclusive = action.payload;
    },
    setScrollKey: (state, action: PayloadAction<string>) => {
      state.scrollKey = action.payload;
    },
  },
});

export const rbPageActions = rbPageSlice.actions;

export default rbPageSlice.reducer;
