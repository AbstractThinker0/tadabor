import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type NoteType = "verse" | "translation" | "root";
export type NoteSortOption = "rank" | "status" | "date";

const keyYourNotesSortBy: Record<NoteType, string> = {
  verse: "yourNotesSortByVerse",
  translation: "yourNotesSortByTranslation",
  root: "yourNotesSortByRoot",
};

const getDefaultSortBy = (noteType: NoteType): NoteSortOption => {
  const storedSortBy = localStorage.getItem(keyYourNotesSortBy[noteType]);

  if (
    storedSortBy === "rank" ||
    storedSortBy === "status" ||
    storedSortBy === "date"
  ) {
    return storedSortBy;
  }

  return "date";
};

interface YourNotesPageState {
  currentTab: string;
  sortBy: Record<NoteType, NoteSortOption>;
}

const initialState: YourNotesPageState = {
  currentTab: "versesTab",
  sortBy: {
    verse: getDefaultSortBy("verse"),
    translation: getDefaultSortBy("translation"),
    root: getDefaultSortBy("root"),
  },
};

export const useYourNotesPageStore = create(
  immer(
    combine(initialState, (set) => ({
      setCurrentTab: (currentTab: string) => {
        set((state) => {
          state.currentTab = currentTab;
        });
      },
      setSortBy: (noteType: NoteType, sortBy: NoteSortOption) => {
        set((state) => {
          state.sortBy[noteType] = sortBy;
        });
        localStorage.setItem(keyYourNotesSortBy[noteType], sortBy);
      },
    }))
  )
);
