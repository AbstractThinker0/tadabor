import { configureStore } from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";

import settingsReducer from "@/store/slices/global/settings";
import navigationReducer from "@/store/slices/global/navigation";

import qbPageReducer from "@/store/slices/pages/quranBrowser";
import rbPageReducer from "@/store/slices/pages/rootsBrowser";
import searcherPageReducer from "@/store/slices/pages/searcher";
import searcher2PageReducer from "@/store/slices/pages/searcher2";

import inspectorPageReducer from "@/store/slices/pages/inspector";
import translationPageReducer from "@/store/slices/pages/translation";
import comparatorPageReducer from "@/store/slices/pages/comparator";
import ynPageReducer from "@/store/slices/pages/yourNotes";
import audioPageReducer from "@/store/slices/pages/audio";

const store = configureStore({
  devTools: APP_MODE === "development",
  reducer: {
    settings: settingsReducer,
    navigation: navigationReducer,

    qbPage: qbPageReducer,
    rbPage: rbPageReducer,
    searcherPage: searcherPageReducer,
    searcher2Page: searcher2PageReducer,

    inspectorPage: inspectorPageReducer,
    translationPage: translationPageReducer,
    comparatorPage: comparatorPageReducer,
    ynPage: ynPageReducer,
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

export default store;
