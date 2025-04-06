import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationState {
  currentPage: string;
}

const initialState: NavigationState = {
  currentPage: "",
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
  },
});

export const navigationActions = navigationSlice.actions;

export default navigationSlice.reducer;
