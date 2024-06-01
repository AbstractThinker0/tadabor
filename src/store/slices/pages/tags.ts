import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { selectedChaptersType, verseProps } from "@/types";
import {
  tagProps,
  tagsProps,
  versesTagsProps,
} from "@/components/Pages/Tags/consts";
import { initialSelectedChapters } from "@/util/consts";

interface tagsStateProps {
  currentChapter: number;
  selectedChapters: selectedChaptersType;
  tags: tagsProps;
  currentTag: tagProps | null;
  versesTags: versesTagsProps;
  currentVerse: verseProps | null;
  selectedTags: tagsProps;
  scrollKey: string;
}

const initialState: tagsStateProps = {
  currentChapter: 1,
  selectedChapters: initialSelectedChapters,
  tags: {},
  currentTag: null,
  versesTags: {},
  currentVerse: null,
  selectedTags: {},
  scrollKey: "",
};

const tagsPageSlice = createSlice({
  name: "tagsPage",
  initialState,
  reducers: {
    setChapter: (state, action: PayloadAction<number>) => {
      state.currentChapter = action.payload;
      state.scrollKey = "";
    },
    setSelectedChapters: (
      state,
      action: PayloadAction<selectedChaptersType>
    ) => {
      state.selectedChapters = action.payload;
    },
    toggleSelectChapter: (state, action: PayloadAction<number>) => {
      state.selectedChapters[action.payload] =
        !state.selectedChapters[action.payload];
    },
    addTag: (state, action: PayloadAction<tagProps>) => {
      const newTag: tagProps = action.payload;
      state.tags[newTag.tagID] = newTag;
    },
    setTags: (state, action: PayloadAction<tagsProps>) => {
      state.tags = action.payload;
    },
    setCurrentTag: (state, action: PayloadAction<tagProps>) => {
      state.currentTag = action.payload;
    },
    deleteTag: (state, action: PayloadAction<string>) => {
      delete state.tags[action.payload];

      for (const verseKey in state.versesTags) {
        state.versesTags[verseKey] = state.versesTags[verseKey].filter(
          (tag) => tag !== action.payload
        );
      }

      delete state.selectedTags[action.payload];
    },
    setCurrentVerse: (state, action: PayloadAction<verseProps | null>) => {
      state.currentVerse = action.payload;
    },
    setVerseTags: (
      state,
      action: PayloadAction<{ verseKey: string; tags: string[] | null }>
    ) => {
      if (action.payload.tags === null) {
        delete state.versesTags[action.payload.verseKey];
      } else {
        state.versesTags[action.payload.verseKey] = action.payload.tags;
      }
    },
    setVersesTags: (state, action: PayloadAction<versesTagsProps>) => {
      state.versesTags = action.payload;
    },
    selectTag: (state, action: PayloadAction<tagProps>) => {
      state.scrollKey = "";
      state.selectedTags[action.payload.tagID] = action.payload;
    },
    deselectTag: (state, action: PayloadAction<string>) => {
      delete state.selectedTags[action.payload];
    },
    gotoChapter: (state, action: PayloadAction<string>) => {
      state.selectedTags = {};
      state.currentChapter = Number(action.payload);
    },
    setScrollKey: (state, action: PayloadAction<string>) => {
      state.scrollKey =
        state.scrollKey === action.payload ? "" : action.payload;
    },
  },
});

export const tagsPageActions = tagsPageSlice.actions;

export default tagsPageSlice.reducer;
