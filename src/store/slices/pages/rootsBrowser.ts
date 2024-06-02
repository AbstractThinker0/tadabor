import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface rbStateProps {
  showQuranTab: boolean;
  verseTab: string;
  searchString: string;
  searchInclusive: boolean;
  scrollKey: string;
}

const initialState: rbStateProps = {
  showQuranTab: false,
  verseTab: "",
  searchString: "",
  searchInclusive: false,
  scrollKey: "",
};

const rbPageSlice = createSlice({
  name: "rbPage",
  initialState,
  reducers: {
    setShowQuranTab: (state, action: PayloadAction<boolean>) => {
      state.showQuranTab = action.payload;
    },
    setVerseTab: (state, action: PayloadAction<string>) => {
      state.verseTab = action.payload;
      state.showQuranTab = true;
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
