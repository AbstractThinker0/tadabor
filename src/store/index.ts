import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import verseNotesReducer from "./slices/verseNotes";
import transNotesReducer from "./slices/transNotes";
import translationsReducer from "./slices/translations";
import rootNotesReducer from "./slices/rootNotes";
import searcherPageReducer from "./slices/searcherPage";

const store = configureStore({
  reducer: {
    verseNotes: verseNotesReducer,
    transNotes: transNotesReducer,
    translations: translationsReducer,
    rootNotes: rootNotesReducer,
    searcherPage: searcherPageReducer,
  },
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
