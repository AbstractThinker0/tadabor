import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { rootProps } from "@/types";

interface DeleteRootPayload {
  root_id: string;
}

interface AddRootPayload {
  root: rootProps;
}

interface RootsObject {
  [key: string]: rootProps;
}

interface SearcherPageState {
  search_roots: RootsObject;
  verseTab: string;
  showQuranTab: boolean;
  verses_count: number;
  scrollKey: string;
}

const initialState: SearcherPageState = {
  search_roots: {},
  verseTab: "",
  showQuranTab: false,
  verses_count: 0,
  scrollKey: "",
};

const searcherPageSlice = createSlice({
  name: "searcherPage",
  initialState,
  reducers: {
    addRoot: (state, action: PayloadAction<AddRootPayload>) => {
      const { root } = action.payload;
      state.search_roots[root.id] = root;
    },
    deleteRoot: (state, action: PayloadAction<DeleteRootPayload>) => {
      const { root_id } = action.payload;
      delete state.search_roots[root_id];
    },
    setShowQuranTab: (state, action: PayloadAction<boolean>) => {
      state.showQuranTab = action.payload;
    },
    setVerseTab: (state, action: PayloadAction<string>) => {
      //
      state.verseTab = action.payload;
      state.showQuranTab = true;
    },
    setVersesCount: (state, action: PayloadAction<number>) => {
      //
      state.verses_count = action.payload;
    },
    setScrollKey: (state, action: PayloadAction<string>) => {
      state.scrollKey = action.payload;
    },
  },
});

export const searcherPageActions = searcherPageSlice.actions;

export default searcherPageSlice.reducer;
