import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { ICloudNote } from "@/types/db";
import { dbNotes } from "@/util/dbFuncs";

import type {
  ChangeNoteDirPayload,
  ChangeNotePayload,
  CloudNoteProps,
  MarkSavedPayload,
  NotesStateProps,
} from "@/types";
import { fromZustandToDexie } from "@/util/notes";
import { tryCatch } from "@/util/trycatch";

export interface SyncDatePayload {
  name: string;
  value: number;
}

const initialState: NotesStateProps<CloudNoteProps> = {
  data: {},
  dataKeys: [],
  dataLoading: {},
  dataComplete: {},

  loading: false,
  complete: false,
  error: false,
};

const inFlight = new Map<string, Promise<CloudNoteProps | null>>();

const computeIsSynced = (note: CloudNoteProps) =>
  note.date_synced && note.date_modified
    ? note.date_synced >= note.date_modified
    : !note.date_modified;

export const useCloudNotesStore = create(
  immer(
    combine(initialState, (set, get) => ({
      fetchCloudNotes: async (userId: number) => {
        const { complete, loading } = get();

        if (complete || loading) {
          return false;
        }

        set((state) => {
          state.loading = true;
          state.error = false;
        });

        const { result, error } = await tryCatch(dbNotes.loadAllCloud(userId));

        if (error) {
          console.error("Failed to load notes:", error);
          set((state) => {
            state.loading = false;
            state.error = true;
          });
          return false;
        }

        const notesData: Record<string, CloudNoteProps> = {};

        result.forEach((note) => {
          notesData[note.id] = {
            ...note,
            saved: true,
            isSynced: computeIsSynced(note),
            preSave: note.text,
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

      fetchSingleCloudNote: async (payload: {
        noteId: string;
        userId: number;
      }) => {
        const { noteId, userId } = payload;
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
              dbNotes.loadCloud(noteId, userId)
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

            const enriched: CloudNoteProps = {
              ...note,
              saved: true,
              isSynced: computeIsSynced(note),
              preSave: note.text,
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

      cacheNote: (payload: CloudNoteProps & { isNew?: boolean }) => {
        const { isNew = true, ...note } = payload;

        set((state) => {
          if (isNew) {
            note.saved = false;
            note.isSynced = false;
          } else {
            note.saved = true;
            note.isSynced = computeIsSynced(note);
            note.preSave = note.text;
          }

          state.data[note.id] = note;
          state.dataLoading[note.id] = false;
          state.dataComplete[note.id] = true;

          if (!state.dataKeys.includes(note.id)) {
            state.dataKeys.push(note.id);
          }
        });

        // Persist cached notes coming from backend/sync flows.
        // Avoid persisting new (draft) notes created by typing before an explicit save.
        if (!isNew) {
          dbNotes.saveCloud(fromZustandToDexie(note)).catch((err) => {
            console.error("Failed to persist cached cloud note:", err);
          });
        }
      },

      updateSyncDate: (payload: SyncDatePayload) => {
        const { name, value } = payload;

        set((state) => {
          const note = state.data[name];
          if (!note) return;
          note.date_synced = value;
          note.isSynced = true;
        });

        // Update local DB with sync date (non-blocking)
        dbNotes.updateCloudSyncDate(name, value).catch((err) => {
          console.error("Failed to update sync date in local DB:", err);
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
            note.isSynced = false;
          }

          if (note.preSave === note.text && note.text) {
            note.saved = true;
            note.isSynced = computeIsSynced(note);
          }
        });
      },

      changeNoteDir: (payload: ChangeNoteDirPayload) => {
        const { name: id, value } = payload;
        set((state) => {
          const note = state.data[id];
          if (!note) return;
          note.dir = value;
        });
      },

      markSaved: async (payload: MarkSavedPayload<ICloudNote>) => {
        const { saveData } = payload;

        const { error } = await tryCatch(dbNotes.saveCloud(saveData));

        if (error) {
          console.error("Failed to save note locally:", error);
          return false;
        }

        set((state) => {
          const note = state.data[saveData.id];
          if (!note) return false;

          note.saved = true;

          if (note.text !== note.preSave) {
            note.preSave = note.text;
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
