import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { verseProps } from "@/types";

const defaultAutoPlay = localStorage.getItem("audioAutoPlay")
  ? localStorage.getItem("audioAutoPlay") === "true"
  : true;

const defaultChapter = localStorage.getItem("audioChapter") || "1";

interface AudioPageState {
  currentChapter: string;
  currentVerse: verseProps | null;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  autoPlay: boolean;
}

const initialState: AudioPageState = {
  currentChapter: defaultChapter,
  currentVerse: null,
  duration: 0,
  currentTime: 0,
  isPlaying: defaultAutoPlay,
  autoPlay: true,
};

const audioPageSlice = createSlice({
  name: "audioPage",
  initialState,
  reducers: {
    setCurrentChapter: (state, action: PayloadAction<string>) => {
      state.currentChapter = action.payload;
      localStorage.setItem("audioChapter", action.payload);
    },
    setCurrentVerse: (state, action: PayloadAction<verseProps>) => {
      state.currentVerse = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setAutoPlaying: (state, action: PayloadAction<boolean>) => {
      state.autoPlay = action.payload;
    },
  },
});

export const audioPageActions = audioPageSlice.actions;

export default audioPageSlice.reducer;
