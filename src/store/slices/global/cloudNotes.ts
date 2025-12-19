import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { dbFuncs } from "@/util/db";
import type {
  ChangeNoteDirPayload,
  ChangeNotePayload,
  CloudNoteProps,
  MarkSavedPayload,
  NotesStateProps,
} from "@/types";

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

export const fetchSingleCloudNote = createAsyncThunk<
  CloudNoteProps | null,
  { noteId: string; userId: number },
  {
    state: { cloudNotes: NotesStateProps<CloudNoteProps> };
    rejectValue: string;
  }
>("cloudNotes/fetchSingleCloudNote", async ({ noteId, userId }, thunkAPI) => {
  const { getState, rejectWithValue } = thunkAPI;
  const { dataComplete } = getState().cloudNotes;

  // If the note is already is loading, don't fetch it again
  // TOD: check if we need to check for dataLoading[noteId] here
  if (dataComplete[noteId]) return null;

  try {
    const note = await dbFuncs.loadCloudNote(noteId);

    if (!note) return null;

    if (note.authorId !== userId) return null;

    return {
      ...note,
      saved: true,
      isSynced:
        note.date_synced && note.date_modified
          ? note.date_synced >= note.date_modified
          : !note.date_modified,
      preSave: note.text,
    };
  } catch (error) {
    return rejectWithValue(`Failed to load note ${noteId}: ${error}`);
  }
});

export const fetchCloudNotes = createAsyncThunk<
  false | Record<string, CloudNoteProps>,
  { userId: number },
  {
    state: { cloudNotes: NotesStateProps<CloudNoteProps> };
    rejectValue: string;
  }
>("cloudNotes/fetchCloudNotes", async ({ userId }, thunkAPI) => {
  const { getState, rejectWithValue } = thunkAPI;
  const { complete } = getState().cloudNotes;

  if (complete) {
    return false;
  }

  try {
    const dbData = await dbFuncs.loadCloudNotes();

    const notesData: Record<string, CloudNoteProps> = {};

    dbData.forEach((note) => {
      if (note.authorId !== userId) return;

      notesData[note.id] = {
        ...note,
        saved: true,
        isSynced:
          note.date_synced && note.date_modified
            ? note.date_synced >= note.date_modified
            : !note.date_modified,
        preSave: note.text,
      };
    });

    return notesData;
  } catch (error) {
    return rejectWithValue(`Failed to load notes: ${error}`);
  }
});

const cloudNotesSlice = createSlice({
  name: "cloudNotes",
  initialState,
  reducers: {
    cacheNote: (
      state,
      action: PayloadAction<CloudNoteProps & { isNew?: boolean }>
    ) => {
      const { isNew = true, ...note } = action.payload;

      // A new note that just got created
      if (isNew) {
        note.saved = false;
        note.isSynced = false;
      } else {
        // An old existing note
        note.saved = true;
        note.isSynced =
          note.date_synced && note.date_modified
            ? note.date_synced >= note.date_modified
            : !note.date_modified;
        note.preSave = note.text;
      }

      state.data[note.id] = note;
      state.dataLoading[note.id] = false;

      if (!state.dataKeys.includes(note.id)) {
        state.dataKeys.push(note.id);
      }
    },
    updateSyncDate: (state, action: PayloadAction<SyncDatePayload>) => {
      const { name, value } = action.payload;
      state.data[name].date_synced = value;
      state.data[name].isSynced = true;
    },
    changeNote: (state, action: PayloadAction<ChangeNotePayload>) => {
      const { name: id, value } = action.payload;

      if (state.data[id].text !== value) {
        state.data[id].text = value;
        state.data[id].saved = false;
        state.data[id].isSynced = false;
      }

      if (
        state.data[id].preSave === state.data[id].text &&
        state.data[id].text
      ) {
        state.data[id].saved = true;

        // Only restore isSynced if the preSave state was actually synced
        const note = state.data[id];
        if (
          note.date_synced &&
          note.date_modified &&
          note.date_synced >= note.date_modified
        ) {
          state.data[id].isSynced = true;
        }
      }
    },
    changeNoteDir: (state, action: PayloadAction<ChangeNoteDirPayload>) => {
      const { name: id, value } = action.payload;

      state.data[id].dir = value;
    },
    markSaved: (state, action: PayloadAction<MarkSavedPayload>) => {
      const { id, dateModified } = action.payload;
      state.data[id].saved = true;

      if (state.data[id].text !== state.data[id].preSave) {
        state.data[id].preSave = state.data[id].text;
        state.data[id].date_modified = dateModified;
      }
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCloudNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.complete = true;
        if (action.payload) {
          state.data = action.payload;
          state.dataKeys = Object.keys(action.payload);
          Object.keys(action.payload).forEach((key) => {
            state.dataLoading[key] = false;
          });
        }
      })
      .addCase(fetchCloudNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCloudNotes.rejected, (state, action) => {
        state.error = true;

        // Log the custom error message passed with rejectWithValue
        if (action.payload) {
          console.error(
            "fetchCloudNotes rejected with message:",
            action.payload
          );
        } else {
          console.error(
            "fetchCloudNotes rejected without custom message:",
            action.error.message
          );
        }
      })
      .addCase(fetchSingleCloudNote.fulfilled, (state, action) => {
        if (action.payload) {
          state.data[action.payload.id] = action.payload;
          state.dataComplete[action.payload.id] = true;

          if (!state.dataKeys.includes(action.payload.id)) {
            state.dataKeys.push(action.payload.id);
          }
        }

        const { noteId } = action.meta.arg;
        state.dataLoading[noteId] = false;
      })
      .addCase(fetchSingleCloudNote.pending, (state, action) => {
        const { noteId } = action.meta.arg;
        state.dataLoading[noteId] = true;
      })
      .addCase(fetchSingleCloudNote.rejected, (state, action) => {
        state.error = true;
        const { noteId } = action.meta.arg as {
          noteId: string;
          userId: number;
        };
        if (noteId) state.dataLoading[noteId] = false;

        // Log the custom error message passed with rejectWithValue
        if (action.payload) {
          console.error(
            "fetchSingleCloudNote rejected with message:",
            action.payload
          );
        } else {
          console.error(
            "fetchSingleCloudNote rejected without custom message:",
            action.error.message
          );
        }
      });
  },
});

export const cloudNotesActions = cloudNotesSlice.actions;

export default cloudNotesSlice.reducer;
