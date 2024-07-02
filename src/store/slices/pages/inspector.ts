import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InspectorPageState {
  currentChapter: string;
  scrollKey: string;
}

const initialState: InspectorPageState = {
  currentChapter: "1",
  scrollKey: "",
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
  },
});

export const inspectorPageActions = inspectorPageSlice.actions;

export default inspectorPageSlice.reducer;
