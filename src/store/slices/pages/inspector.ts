import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InspectorPageState {
  currentChapter: string;
  scrollKey: string;
  showSearchPanel: boolean;
  showSearchPanelMobile: boolean;
}

const initialState: InspectorPageState = {
  currentChapter: "1",
  scrollKey: "",
  showSearchPanel: true,
  showSearchPanelMobile: false,
};

const inspectorPageSlice = createSlice({
  name: "inspectorPage",
  initialState,
  reducers: {
    setCurrentChapter: (state, action: PayloadAction<string>) => {
      state.currentChapter = action.payload;
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

export const inspectorPageActions = inspectorPageSlice.actions;

export default inspectorPageSlice.reducer;
