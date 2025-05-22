import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { dbFuncs } from "@/util/db";
import type {
  ChangeNoteDirPayload,
  ChangeNotePayload,
  LocalNoteProps,
  MarkSavedPayload,
} from "@/types";

interface LocalNotesStateProps {
  data: Record<string, LocalNoteProps>;
  dataKeys: string[];
  dataLoading: Record<string, boolean>;
  dataComplete: Record<string, boolean>;

  loading: boolean;
  complete: boolean;
  error: boolean;
}

const initialState: LocalNotesStateProps = {
  data: {},
  dataKeys: [],
  dataLoading: {},
  dataComplete: {},

  loading: true,
  complete: false,
  error: false,
};

export const fetchSingleLocalNote = createAsyncThunk<
  LocalNoteProps | null,
  string,
  { state: { localNotes: LocalNotesStateProps }; rejectValue: string }
>("localNotes/fetchSingleLocalNote", async (noteId, thunkAPI) => {
  const { getState, rejectWithValue } = thunkAPI;
  const { dataComplete } = getState().localNotes;

  // If the note is already loading, don't fetch it again
  // TODO: verify if this null return will cause a bug
  if (dataComplete[noteId]) return null;

  try {
    const note = await dbFuncs.loadLocalNote(noteId);

    if (!note) return null;

    return {
      ...note,
      saved: true,
      preSave: note.text,
    };
  } catch (error) {
    return rejectWithValue(`Failed to load note ${noteId}: ${error}`);
  }
});

export const fetchLocalNotes = createAsyncThunk<
  false | Record<string, LocalNoteProps>,
  void,
  { state: { localNotes: LocalNotesStateProps }; rejectValue: string }
>("localNotes/fetchLocalNotes", async (_, thunkAPI) => {
  const { getState, rejectWithValue } = thunkAPI;
  const { complete } = getState().localNotes;

  if (complete) return false;

  try {
    const dbData = await dbFuncs.loadLocalNotes();

    const notesData: Record<string, LocalNoteProps> = {};

    dbData.forEach((note) => {
      notesData[note.id] = {
        ...note,
        saved: true,
        preSave: note.text,
      };
    });

    return notesData;
  } catch (error) {
    return rejectWithValue(`Failed to load notes: ${error}`);
  }
});

const localNotesSlice = createSlice({
  name: "localNotes",
  initialState,
  reducers: {
    cacheNote: (state, action: PayloadAction<LocalNoteProps>) => {
      const note = action.payload;
      note.saved = true;
      note.preSave = note.text;
      state.data[note.id] = note;
      state.dataLoading[note.id] = false;

      if (!state.dataKeys.includes(note.id)) {
        state.dataKeys.push(note.id);
      }
    },
    changeNote: (state, action: PayloadAction<ChangeNotePayload>) => {
      const { name: id, value } = action.payload;

      if (state.data[id].text !== value) {
        state.data[id].text = value;
        state.data[id].saved = false;
      }

      if (state.data[id].preSave === state.data[id].text) {
        state.data[id].saved = true;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocalNotes.fulfilled, (state, action) => {
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
      .addCase(fetchLocalNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocalNotes.rejected, (state, action) => {
        state.error = true;

        // Log the custom error message passed with rejectWithValue
        if (action.payload) {
          console.error(
            "fetchLocalNotes rejected with message:",
            action.payload
          );
        } else {
          console.error(
            "fetchLocalNotes rejected without custom message:",
            action.error.message
          );
        }
      })
      .addCase(fetchSingleLocalNote.fulfilled, (state, action) => {
        if (action.payload) {
          state.data[action.payload.id] = action.payload;
          state.dataComplete[action.payload.id] = true;

          if (!state.dataKeys.includes(action.payload.id)) {
            state.dataKeys.push(action.payload.id);
          }
        }

        const noteId = action.meta.arg;
        state.dataLoading[noteId] = false;
      })
      .addCase(fetchSingleLocalNote.pending, (state, action) => {
        const noteId = action.meta.arg;

        state.dataLoading[noteId] = true;
      })
      .addCase(fetchSingleLocalNote.rejected, (state, action) => {
        state.error = true;

        // Log the custom error message passed with rejectWithValue
        if (action.payload) {
          console.error(
            "fetchSingleLocalNote rejected with message:",
            action.payload
          );
        } else {
          console.error(
            "fetchSingleLocalNote rejected without custom message:",
            action.error.message
          );
        }
      });
  },
});

export const localNotesActions = localNotesSlice.actions;

export default localNotesSlice.reducer;
