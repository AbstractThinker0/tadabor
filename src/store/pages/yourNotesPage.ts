import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface YourNotesPageState {
  currentTab: string;
}

const initialState: YourNotesPageState = {
  currentTab: "versesTab",
};

export const useYourNotesPageStore = create(
  immer(
    combine(initialState, (set) => ({
      setCurrentTab: (currentTab: string) => {
        set((state) => {
          state.currentTab = currentTab;
        });
      },
    }))
  )
);
