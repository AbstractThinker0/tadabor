import { configureStore, createSelector } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import translationsReducer from "@/store/slices/global/translations";

import cloudNotesReducer from "@/store/slices/global/cloudNotes";
import localNotesReducer from "@/store/slices/global/localNotes";

import settingsReducer from "@/store/slices/global/settings";
import navigationReducer from "@/store/slices/global/navigation";
import userReducer from "@/store/slices/global/user";

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
import audioPageReducer from "@/store/slices/pages/audio";

const store = configureStore({
  devTools: APP_MODE === "development",
  reducer: {
    translations: translationsReducer,

    cloudNotes: cloudNotesReducer,
    localNotes: localNotesReducer,

    settings: settingsReducer,
    navigation: navigationReducer,
    user: userReducer,

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
    audioPage: audioPageReducer,
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

export const selectLocalNote = (id: string) => {
  return (state: RootState) => state.localNotes.data[id];
};

const selectDataKeys = (guest?: boolean) => (state: RootState) =>
  guest ? state.localNotes.dataKeys : state.cloudNotes.dataKeys;

export const getNotesKeys = (type?: string, guest?: boolean) =>
  createSelector(selectDataKeys(guest), (keys) =>
    type ? keys.filter((id) => id.startsWith(type)) : keys.slice()
  );

export const selectCloudNote = (id: string) => {
  return (state: RootState) => state.cloudNotes.data[id];
};

export const isTranslationsLoading = (state: RootState) =>
  state.translations.loading;

export default store;
