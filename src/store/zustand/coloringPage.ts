import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { selectedChaptersType } from "@/types";
import type { verseProps } from "quran-tools";
import type {
  coloredProps,
  colorProps,
} from "@/components/Pages/Coloring/consts";
import { initialSelectedChapters } from "@/util/consts";

interface ColoringPageState {
  currentChapter: number;
  colorsList: coloredProps;
  selectedColors: coloredProps;
  coloredVerses: coloredProps;
  selectedVerse: string;
  currentVerse: verseProps | null;
  currentColor: colorProps | null;
  selectedChapters: selectedChaptersType;
  scrollKey: string;
  showSearchPanel: boolean;
  showSearchPanelMobile: boolean;
}

const initialState: ColoringPageState = {
  currentChapter: 1,
  colorsList: {},
  selectedColors: {},
  coloredVerses: {},
  selectedVerse: "",
  currentVerse: null,
  currentColor: null,
  selectedChapters: initialSelectedChapters,
  scrollKey: "",
  showSearchPanel: true,
  showSearchPanelMobile: false,
};

export const useColoringPageStore = create(
  immer(
    combine(initialState, (set) => ({
      setChapter: (chapter: number) => {
        set((state) => {
          state.currentChapter = chapter;
          state.scrollKey = "";
        });
      },

      setColorsList: (colorsList: coloredProps) => {
        set((state) => {
          state.colorsList = colorsList;
        });
      },

      addColor: (color: colorProps) => {
        set((state) => {
          state.colorsList[color.colorID] = color;
        });
      },

      selectColor: (color: colorProps) => {
        set((state) => {
          state.selectedColors[color.colorID] = color;
        });
      },

      deselectColor: (colorID: string) => {
        set((state) => {
          delete state.selectedColors[colorID];
        });
      },

      deleteColor: (colorID: string) => {
        set((state) => {
          delete state.colorsList[colorID];

          for (const verseKey in state.coloredVerses) {
            if (state.coloredVerses[verseKey].colorID === colorID) {
              delete state.coloredVerses[verseKey];
            }
          }

          delete state.selectedColors[colorID];
        });
      },

      setVerseColor: (verseKey: string, color: colorProps | null) => {
        set((state) => {
          if (color == null) {
            delete state.coloredVerses[verseKey];
          } else {
            state.coloredVerses[verseKey] = color;
          }
        });
      },

      setColoredVerses: (coloredVerses: coloredProps) => {
        set((state) => {
          state.coloredVerses = coloredVerses;
        });
      },

      setCurrentVerse: (verse: verseProps | null) => {
        set((state) => {
          state.currentVerse = verse;
        });
      },

      setCurrentColor: (color: colorProps) => {
        set((state) => {
          state.currentColor = color;
        });
      },

      setSelectedChapters: (selectedChapters: selectedChaptersType) => {
        set((state) => {
          state.selectedChapters = selectedChapters;
        });
      },

      toggleSelectChapter: (chapter: number) => {
        set((state) => {
          state.selectedChapters[chapter] = !state.selectedChapters[chapter];
        });
      },

      setSelectedVerse: (verse: string) => {
        set((state) => {
          state.selectedVerse = verse;
          state.scrollKey = verse;
        });
      },

      setScrollKey: (key: string) => {
        set((state) => {
          state.scrollKey = state.scrollKey === key ? "" : key;
        });
      },

      gotoChapter: (chapter: number) => {
        set((state) => {
          state.selectedColors = {};
          state.currentChapter = chapter;
        });
      },

      setSearchPanel: (isOpen: boolean) => {
        set((state) => {
          state.showSearchPanel = isOpen;
          state.showSearchPanelMobile = isOpen;
        });
      },

      reset: () => {
        set(() => ({ ...initialState }));
      },
    }))
  )
);
