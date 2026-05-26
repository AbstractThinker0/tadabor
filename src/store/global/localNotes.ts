import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { ILocalNote } from "@/types/db";
import { dbNotes } from "@/util/dbFuncs";

import type {
  ChangeNotePayload,
  LocalNoteProps,
  MarkSavedPayload,
  NotesStateProps,
} from "@/types/notes";
import { hasNoteChanged } from "@/util/notes";
import { tryCatch } from "@/util/trycatch";

const initialState: NotesStateProps<LocalNoteProps> = {
  data: {},
  dataKeys: [],
  dataLoading: {},
  dataComplete: {},

  loading: true,
  complete: false,
  error: false,
};

const inFlight = new Map<string, Promise<LocalNoteProps | null>>();

export const useLocalNotesStore = create(
  immer(
    combine(initialState, (set, get) => ({
      fetchLocalNotes: async () => {
        const { complete } = get();
        if (complete) return false;

        set((state) => {
          state.loading = true;
          state.error = false;
        });

        const { result, error } = await tryCatch(dbNotes.loadAllLocal());

        if (error) {
          console.error("Failed to load notes:", error);
          set((state) => {
            state.loading = false;
            state.error = true;
          });
          return false;
        }

        const notesData: Record<string, LocalNoteProps> = {};

        result.forEach((note) => {
          notesData[note.id] = {
            ...note,
            saved: true,
            preSave: note.text,
            preSaveDir: note.dir ?? "",
            hasPersistedVersion: true,
          };
        });

        set((state) => {
          state.data = notesData;
          state.dataKeys = Object.keys(notesData);
          state.loading = false;
          state.complete = true;

          state.dataKeys.forEach((key) => {
            state.dataLoading[key] = false;
            state.dataComplete[key] = true;
          });
        });

        return notesData;
      },

      fetchSingleLocalNote: async (noteId: string) => {
        const { dataComplete, dataLoading } = get();

        if (dataComplete[noteId] || dataLoading[noteId]) return null;

        const existing = inFlight.get(noteId);
        if (existing) return existing;

        const promise = (async () => {
          try {
            set((state) => {
              state.dataLoading[noteId] = true;
              state.error = false;
            });

            const { result: note, error } = await tryCatch(
              dbNotes.loadLocal(noteId)
            );

            if (error) {
              console.error(`Failed to load note ${noteId}:`, error);
              set((state) => {
                state.error = true;
                state.dataLoading[noteId] = false;
              });
              return null;
            }

            set((state) => {
              state.dataLoading[noteId] = false;
            });

            if (!note) return null;

            const enriched: LocalNoteProps = {
              ...note,
              saved: true,
              preSave: note.text,
              preSaveDir: note.dir ?? "",
              hasPersistedVersion: true,
            };

            set((state) => {
              state.data[enriched.id] = enriched;

              if (!state.dataKeys.includes(enriched.id)) {
                state.dataKeys.push(enriched.id);
              }

              state.dataComplete[enriched.id] = true;
              state.dataLoading[enriched.id] = false;
            });

            return enriched;
          } finally {
            inFlight.delete(noteId);
          }
        })();

        inFlight.set(noteId, promise);
        return promise;
      },

      cacheNote: (note: LocalNoteProps) => {
        set((state) => {
          note.saved = false;
          note.preSaveDir = note.preSaveDir ?? note.dir ?? "";
          note.hasPersistedVersion = note.hasPersistedVersion ?? false;
          state.data[note.id] = note;
          state.dataLoading[note.id] = false;
          state.dataComplete[note.id] = true;

          if (!state.dataKeys.includes(note.id)) {
            state.dataKeys.push(note.id);
          }
        });
      },

      changeNote: (payload: ChangeNotePayload) => {
        const { name: id, value } = payload;

        set((state) => {
          const note = state.data[id];
          if (!note) return;

          if (note.text !== value) {
            note.text = value;
            note.saved = false;
          }

          if (!hasNoteChanged(note) && note.text) {
            note.saved = true;
          }
        });
      },

      changeNoteDir: (payload: ChangeNotePayload) => {
        const { name: id, value } = payload;
        set((state) => {
          const note = state.data[id];
          if (!note) return;
          note.dir = value;
          note.saved = !hasNoteChanged(note) && !!note.text;
        });
      },

      markSaved: async (payload: MarkSavedPayload<ILocalNote>) => {
        const { saveData } = payload;

        const { error } = await tryCatch(dbNotes.saveLocal(saveData));

        if (error) {
          console.error("Failed to save note locally:", error);
          return false;
        }

        set((state) => {
          const note = state.data[saveData.id];
          if (!note) return false;

          note.saved = true;
          note.hasPersistedVersion = true;

          if (hasNoteChanged(note)) {
            note.preSave = note.text;
            note.preSaveDir = note.dir ?? "";
            note.date_modified = saveData.date_modified;
          }
        });

        return true;
      },

      reset: () => {
        set(() => ({ ...initialState }));
      },
    }))
  )
);
