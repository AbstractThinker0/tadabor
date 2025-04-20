import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const keyCenterVerses = "centerVerses";
const defaultCenterVerses = localStorage.getItem(keyCenterVerses) === "true";

interface NavigationState {
  currentPage: string;
  centerVerses: boolean;
}

const initialState: NavigationState = {
  currentPage: "",
  centerVerses: defaultCenterVerses,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setCenterVerses: (state, action: PayloadAction<boolean>) => {
      state.centerVerses = action.payload;
      localStorage.setItem(keyCenterVerses, action.payload ? "true" : "false");
    },
  },
});

export const navigationActions = navigationSlice.actions;

export default navigationSlice.reducer;
