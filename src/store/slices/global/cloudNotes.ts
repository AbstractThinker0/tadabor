import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { dbFuncs } from "@/util/db";
import {
  ChangeNoteDirPayload,
  ChangeNotePayload,
  CloudNoteProps,
  MarkSavedPayload,
} from "@/types";

export interface SyncDatePayload {
  name: string;
  value: number;
}

interface CloudNotesStateProps {
  data: Record<string, CloudNoteProps>;
  dataKeys: string[];

  loading: boolean;
  complete: boolean;
  error: boolean;
}

const initialState: CloudNotesStateProps = {
  data: {},
  dataKeys: [],

  loading: true,
  complete: false,
  error: false,
};

export const fetchCloudNotes = createAsyncThunk<
  false | Record<string, CloudNoteProps>,
  void,
  { state: { cloudNotes: CloudNotesStateProps }; rejectValue: string }
>("cloudNotes/fetchCloudNotes", async (_, thunkAPI) => {
  const { getState, rejectWithValue } = thunkAPI;
  const { complete } = getState().cloudNotes;

  if (complete) {
    return false;
  }

  try {
    const dbData = await dbFuncs.loadCloudNotes();

    const notesData: Record<string, CloudNoteProps> = {};

    dbData.forEach((note) => {
      notesData[note.id] = {
        ...note,
        saved: true,
        isSynced: true,
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
    cacheNote: (state, action: PayloadAction<CloudNoteProps>) => {
      const note = action.payload;
      note.saved = true;
      note.isSynced = true;
      note.preSave = note.text;
      state.data[note.id] = note;

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

      if (state.data[id].preSave === state.data[id].text) {
        state.data[id].saved = true;
        state.data[id].isSynced = true;
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
      });
  },
});

export const cloudNotesActions = cloudNotesSlice.actions;

export default cloudNotesSlice.reducer;
