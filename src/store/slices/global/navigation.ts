import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const keyCenterVerses = "centerVerses";
const defaultCenterVerses = localStorage.getItem(keyCenterVerses) === "true";

const keyCompactVerses = "compactVerses";
const defaultCompactVerses = localStorage.getItem(keyCompactVerses) === "true";

interface NavigationState {
  currentPage: string;
  centerVerses: boolean;
  compactVerses: boolean;
  isSmallScreen: boolean;
  isBetaVersion: boolean;
}

const initialState: NavigationState = {
  currentPage: "",
  centerVerses: defaultCenterVerses,
  compactVerses: defaultCompactVerses,
  isSmallScreen: window.innerWidth <= 768 || window.innerHeight <= 480,
  isBetaVersion: localStorage.getItem("betaVersion") === "true",
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
    toggleCenterVerses: (state) => {
      state.centerVerses = !state.centerVerses;
      localStorage.setItem(
        keyCenterVerses,
        state.centerVerses ? "true" : "false"
      );
    },
    setCompactVerses: (state, action: PayloadAction<boolean>) => {
      state.compactVerses = action.payload;
      localStorage.setItem(keyCompactVerses, action.payload ? "true" : "false");
    },
    toggleCompactVerses: (state) => {
      state.compactVerses = !state.compactVerses;
      localStorage.setItem(
        keyCompactVerses,
        state.compactVerses ? "true" : "false"
      );
    },
    setSmallScreen: (state, action: PayloadAction<boolean>) => {
      state.isSmallScreen = action.payload;
    },
    setBetaStatus: (state, action: PayloadAction<boolean>) => {
      state.isBetaVersion = action.payload;

      localStorage.setItem("betaVersion", action.payload ? "true" : "false");
    },
  },
});

export const navigationActions = navigationSlice.actions;

export default navigationSlice.reducer;
