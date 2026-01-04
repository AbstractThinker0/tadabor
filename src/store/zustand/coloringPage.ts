import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";

import type { selectedChaptersType } from "@/types";
import type { verseProps } from "quran-tools";
import type {
  coloredProps,
  colorProps,
} from "@/components/Pages/Coloring/consts";
import { initialSelectedChapters } from "@/util/consts";

import type { IColor, IVerseColor } from "@/types/db";
import { dbColors } from "@/util/dbFuncs";

import { tryCatch } from "@/util/trycatch";

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
  loading: boolean;
  complete: boolean;
  error: boolean;
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
  loading: false,
  complete: false,
  error: false,
};

const DEFAULT_COLORS: coloredProps = {
  "0": { colorID: "0", colorCode: "#3dc23d", colorDisplay: "Studied" },
  "1": { colorID: "1", colorCode: "#dfdf58", colorDisplay: "In progress" },
  "2": { colorID: "2", colorCode: "#da5252", colorDisplay: "Unexplored" },
};

export const useColoringPageStore = create(
  immer(
    combine(initialState, (set, get) => ({
      // Async action: Initialize colors from Dexie or create defaults
      initializeColors: async () => {
        const { complete, loading } = get();
        if (complete || loading) return;

        set((state) => {
          state.loading = true;
          state.error = false;
        });

        // Check if first time opening colors page
        if (localStorage.getItem("defaultColorsInitiated") === null) {
          // First time: create default colors
          for (const colorID of Object.keys(DEFAULT_COLORS)) {
            const color = DEFAULT_COLORS[colorID];
            await dbColors.save({
              id: color.colorID,
              name: color.colorDisplay,
              code: color.colorCode,
            });
          }

          localStorage.setItem("defaultColorsInitiated", "true");

          set((state) => {
            state.colorsList = { ...DEFAULT_COLORS };
            state.loading = false;
            state.complete = true;
          });
          return;
        }

        // Load saved colors from Dexie
        const { result: savedColors, error: colorsError } = await tryCatch(
          dbColors.loadAll()
        );

        if (colorsError) {
          console.error("Failed to load colors:", colorsError);
          set((state) => {
            state.loading = false;
            state.error = true;
          });
          return;
        }

        const loadedColors: coloredProps = {};
        savedColors.forEach((color: IColor) => {
          loadedColors[color.id] = {
            colorID: color.id,
            colorDisplay: color.name,
            colorCode: color.code,
          };
        });

        // Load saved verse colors from Dexie
        const { result: savedVersesColor, error: versesError } = await tryCatch(
          dbColors.loadVerses()
        );

        if (versesError) {
          console.error("Failed to load verse colors:", versesError);
          set((state) => {
            state.colorsList = loadedColors;
            state.loading = false;
            state.error = true;
          });
          return;
        }

        const loadedColoredVerses: coloredProps = {};
        savedVersesColor.forEach((verseColor: IVerseColor) => {
          if (loadedColors[verseColor.color_id]) {
            loadedColoredVerses[verseColor.verse_key] =
              loadedColors[verseColor.color_id];
          }
        });

        set((state) => {
          state.colorsList = loadedColors;
          state.coloredVerses = loadedColoredVerses;
          state.loading = false;
          state.complete = true;
        });
      },

      setChapter: (chapter: number) => {
        set((state) => {
          state.currentChapter = chapter;
          state.scrollKey = "";
        });
      },

      // Async action: Add a new color with persistence
      addColor: async (
        colorInput: Omit<colorProps, "colorID"> | colorProps
      ) => {
        const color: colorProps = {
          colorID: "colorID" in colorInput ? colorInput.colorID : uuidv4(),
          colorCode: colorInput.colorCode,
          colorDisplay: colorInput.colorDisplay,
        };

        const { error } = await tryCatch(
          dbColors.save({
            id: color.colorID,
            name: color.colorDisplay,
            code: color.colorCode,
          })
        );

        if (error) {
          console.error("Failed to save color:", error);
          return false;
        }

        set((state) => {
          state.colorsList[color.colorID] = color;
        });

        return true;
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

      // Async action: Delete a color with persistence
      deleteColor: async (colorID: string) => {
        // Delete color and all associated verse colors from Dexie
        const { error: colorError } = await tryCatch(dbColors.delete(colorID));

        if (colorError) {
          console.error("Failed to delete color and its verses:", colorError);
          return false;
        }

        set((state) => {
          delete state.colorsList[colorID];

          for (const verseKey in state.coloredVerses) {
            if (state.coloredVerses[verseKey].colorID === colorID) {
              delete state.coloredVerses[verseKey];
            }
          }

          delete state.selectedColors[colorID];
        });

        return true;
      },

      // Async action: Set verse color with persistence
      setVerseColor: async (verseKey: string, color: colorProps | null) => {
        if (color === null) {
          const { error } = await tryCatch(dbColors.deleteVerse(verseKey));
          if (error) {
            console.error("Failed to delete verse color:", error);
            return false;
          }
        } else {
          const { error } = await tryCatch(
            dbColors.saveVerse({
              verse_key: verseKey,
              color_id: color.colorID,
            })
          );
          if (error) {
            console.error("Failed to save verse color:", error);
            return false;
          }
        }

        set((state) => {
          if (color == null) {
            delete state.coloredVerses[verseKey];
          } else {
            state.coloredVerses[verseKey] = color;
          }
        });

        return true;
      },

      // Async action: Save all colors (used by EditColorsModal)
      saveColorsList: async (colorsList: coloredProps) => {
        // Save each color to Dexie
        for (const colorID of Object.keys(colorsList)) {
          const color = colorsList[colorID];
          const { error } = await tryCatch(
            dbColors.save({
              id: color.colorID,
              name: color.colorDisplay,
              code: color.colorCode,
            })
          );

          if (error) {
            console.error("Failed to save color:", error);
            return false;
          }
        }

        // Update colored verses with new color data
        const { coloredVerses } = get();
        const updatedColoredVerses: coloredProps = {};

        for (const verseKey of Object.keys(coloredVerses)) {
          const mappedColor = colorsList[coloredVerses[verseKey]?.colorID];
          if (mappedColor) {
            updatedColoredVerses[verseKey] = mappedColor;
          }
        }

        set((state) => {
          state.colorsList = colorsList;
          state.coloredVerses = updatedColoredVerses;
        });

        return true;
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
