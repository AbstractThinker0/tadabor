import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import verseNotesReducer from "@/store/slices/global/verseNotes";
import transNotesReducer from "@/store/slices/global/transNotes";
import translationsReducer from "@/store/slices/global/translations";
import rootNotesReducer from "@/store/slices/global/rootNotes";

import settingsReducer from "@/store/slices/global/settings";

import qbPageReducer from "@/store/slices/pages/quranBrowser";
import rbPageReducer from "@/store/slices/pages/rootsBrowser";
import searcherPageReducer from "@/store/slices/pages/searcher";
import searcher2PageReducer from "@/store/slices/pages/searcher2";
import coloringPageReducer from "@/store/slices/pages/coloring";
import tagsPageReducer from "@/store/slices/pages/tags";
import inspectorPageReducer from "@/store/slices/pages/inspector";
import translationPageReducer from "@/store/slices/pages/translation";
import comparatorPageReducer from "@/store/slices/pages/comparator";
import ynPageReducer from "@/store/slices/pages/yourNotes";
import lettersPageReducer from "@/store/slices/pages/letters";

const store = configureStore({
  reducer: {
    verseNotes: verseNotesReducer,
    transNotes: transNotesReducer,
    translations: translationsReducer,
    rootNotes: rootNotesReducer,

    settings: settingsReducer,

    qbPage: qbPageReducer,
    rbPage: rbPageReducer,
    searcherPage: searcherPageReducer,
    searcher2Page: searcher2PageReducer,
    coloringPage: coloringPageReducer,
    tagsPage: tagsPageReducer,
    inspectorPage: inspectorPageReducer,
    translationPage: translationPageReducer,
    comparatorPage: comparatorPageReducer,
    ynPage: ynPageReducer,
    lettersPage: lettersPageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["payload.quranInstance"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const getAllNotesKeys = (state: RootState) => state.verseNotes.dataKeys;

export const selectNote = (key: string) => {
  return (state: RootState) => state.verseNotes.data[key];
};

export const getAllTransNotesKeys = (state: RootState) =>
  state.transNotes.dataKeys;

export const selectTransNote = (key: string) => {
  return (state: RootState) => state.transNotes.data[key];
};

export const getAllRootNotesKeys = (state: RootState) =>
  state.rootNotes.dataKeys;

export const selecRootNote = (key: string) => {
  return (state: RootState) => state.rootNotes.data[key];
};

export const isDataLoading = () => {
  return (state: RootState) =>
    state.rootNotes.loading &&
    state.transNotes.loading &&
    state.verseNotes.loading;
};

export const isRootNotesLoading = () => {
  return (state: RootState) => state.rootNotes.loading;
};

export const isTransNotesLoading = () => {
  return (state: RootState) => state.transNotes.loading;
};

export const isVerseNotesLoading = () => {
  return (state: RootState) => state.verseNotes.loading;
};

export default store;
