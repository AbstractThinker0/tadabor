import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TAB } from "@/components/Pages/YourNotes/consts";

interface YourNotesPageState {
  currentTab: TAB;
}

const initialState: YourNotesPageState = {
  currentTab: TAB.VERSES,
};

const ynPageSlice = createSlice({
  name: "ynPage",
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<TAB>) => {
      state.currentTab = action.payload;
    },
  },
});

export const ynPageActions = ynPageSlice.actions;

export default ynPageSlice.reducer;
