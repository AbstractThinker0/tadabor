import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface YourNotesPageState {
  currentTab: string;
}

const initialState: YourNotesPageState = {
  currentTab: "versesTab",
};

const ynPageSlice = createSlice({
  name: "ynPage",
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<string>) => {
      state.currentTab = action.payload;
    },
  },
});

export const ynPageActions = ynPageSlice.actions;

export default ynPageSlice.reducer;
