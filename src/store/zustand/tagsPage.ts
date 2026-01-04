import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";

import type { selectedChaptersType } from "@/types";
import type { verseProps } from "quran-tools";
import type {
  tagProps,
  tagsProps,
  versesTagsProps,
} from "@/components/Pages/Tags/consts";
import { initialSelectedChapters } from "@/util/consts";

import type { ITag, IVerseTags } from "@/types/db";
import { dbFuncs } from "@/util/dbFuncs";

import { tryCatch } from "@/util/trycatch";

interface TagsPageState {
  currentChapter: number;
  selectedChapters: selectedChaptersType;
  tags: tagsProps;
  currentTag: tagProps | null;
  versesTags: versesTagsProps;
  selectedVerse: string;
  currentVerse: verseProps | null;
  selectedTags: tagsProps;
  scrollKey: string;
  showSearchPanel: boolean;
  showSearchPanelMobile: boolean;
  loading: boolean;
  complete: boolean;
  error: boolean;
}

const initialState: TagsPageState = {
  currentChapter: 1,
  selectedChapters: initialSelectedChapters,
  tags: {},
  currentTag: null,
  versesTags: {},
  selectedVerse: "",
  currentVerse: null,
  selectedTags: {},
  scrollKey: "",
  showSearchPanel: true,
  showSearchPanelMobile: false,
  loading: false,
  complete: false,
  error: false,
};

export const useTagsPageStore = create(
  immer(
    combine(initialState, (set, get) => ({
      // Async action: Initialize tags from Dexie
      initializeTags: async () => {
        const { complete, loading } = get();
        if (complete || loading) return;

        set((state) => {
          state.loading = true;
          state.error = false;
        });

        // Load saved tags from Dexie
        const { result: savedTags, error: tagsError } = await tryCatch(
          dbFuncs.loadTags()
        );

        if (tagsError) {
          console.error("Failed to load tags:", tagsError);
          set((state) => {
            state.loading = false;
            state.error = true;
          });
          return;
        }

        const loadedTags: tagsProps = {};
        savedTags.forEach((tag: ITag) => {
          loadedTags[tag.id] = {
            tagID: tag.id,
            tagDisplay: tag.name,
          };
        });

        // Load saved verse tags from Dexie
        const { result: savedVersesTags, error: versesError } = await tryCatch(
          dbFuncs.loadVersesTags()
        );

        if (versesError) {
          console.error("Failed to load verse tags:", versesError);
          set((state) => {
            state.tags = loadedTags;
            state.loading = false;
            state.error = true;
          });
          return;
        }

        const loadedVersesTags: versesTagsProps = {};
        savedVersesTags.forEach((verseTags: IVerseTags) => {
          loadedVersesTags[verseTags.verse_key] = verseTags.tags_ids;
        });

        set((state) => {
          state.tags = loadedTags;
          state.versesTags = loadedVersesTags;
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

      // Async action: Add a new tag with persistence
      addTag: async (tagInput: Omit<tagProps, "tagID"> | tagProps) => {
        const tag: tagProps = {
          tagID: "tagID" in tagInput ? tagInput.tagID : uuidv4(),
          tagDisplay: tagInput.tagDisplay,
        };

        const { error } = await tryCatch(
          dbFuncs.saveTag({
            id: tag.tagID,
            name: tag.tagDisplay,
          })
        );

        if (error) {
          console.error("Failed to save tag:", error);
          return false;
        }

        set((state) => {
          state.tags[tag.tagID] = tag;
        });

        return true;
      },

      setCurrentTag: (tag: tagProps | null) => {
        set((state) => {
          state.currentTag = tag;
        });
      },

      // Async action: Delete a tag with persistence
      deleteTag: async (tagID: string) => {
        // Delete tag and associated updates in Dexie
        // dbFuncs.deleteTag handles removing the tag from verses_tags as well
        const { error: tagError } = await tryCatch(dbFuncs.deleteTag(tagID));

        if (tagError) {
          console.error("Failed to delete tag:", tagError);
          return false;
        }

        set((state) => {
          delete state.tags[tagID];

          for (const verseKey in state.versesTags) {
            state.versesTags[verseKey] = state.versesTags[verseKey].filter(
              (tag) => tag !== tagID
            );
          }

          delete state.selectedTags[tagID];
        });

        return true;
      },

      setCurrentVerse: (verse: verseProps | null) => {
        set((state) => {
          state.currentVerse = verse;
        });
      },

      // Async action: Set verse tags with persistence
      setVerseTags: async (verseKey: string, tags: string[] | null) => {
        if (tags === null) {
          const { error } = await tryCatch(dbFuncs.deleteVerseTags(verseKey));
          if (error) {
            console.error("Failed to delete verse tags:", error);
            return false;
          }
        } else {
          // Assuming dbFuncs.saveVerseTags handles existing records (upsert)
          const { error } = await tryCatch(
            dbFuncs.saveVerseTags({
              verse_key: verseKey,
              tags_ids: tags,
            })
          );
          if (error) {
            console.error("Failed to save verse tags:", error);
            return false;
          }
        }

        set((state) => {
          if (tags === null) {
            delete state.versesTags[verseKey];
          } else {
            state.versesTags[verseKey] = tags;
          }
        });

        return true;
      },

      selectTag: (tag: tagProps) => {
        set((state) => {
          state.scrollKey = "";
          state.selectedTags[tag.tagID] = tag;
        });
      },

      deselectTag: (tagID: string) => {
        set((state) => {
          delete state.selectedTags[tagID];
        });
      },

      gotoChapter: (chapter: number) => {
        set((state) => {
          state.selectedTags = {};
          state.currentChapter = chapter;
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
