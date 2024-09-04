import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface YourNotesPageState {
  currentTab: number;
}

const initialState: YourNotesPageState = {
  currentTab: 0,
};

const ynPageSlice = createSlice({
  name: "ynPage",
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<number>) => {
      state.currentTab = action.payload;
    },
  },
});

export const ynPageActions = ynPageSlice.actions;

export default ynPageSlice.reducer;
