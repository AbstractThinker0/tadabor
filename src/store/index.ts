import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import notesReducer from "./notesReducer";
import translationsReducer from "./translationsReducer";
import dataReducer from "./dataReducer";
import rootNotesReducer from "./rootNotesReducer";

const store = configureStore({
  reducer: {
    notes: notesReducer,
    translations: translationsReducer,
    data: dataReducer,
    rootNotes: rootNotesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const selectNote = (key: string) => {
  return (state: RootState) => state.notes[key];
};

export const getAllNotes = () => {
  return (state: RootState) => state.notes;
};

export const selectTranslation = (key: string) => {
  return (state: RootState) => state.translations[key];
};

export const selecRootNote = (key: string) => {
  return (state: RootState) => state.rootNotes[key];
};

export const getAllRootNotes = () => {
  return (state: RootState) => state.rootNotes;
};

export default store;
