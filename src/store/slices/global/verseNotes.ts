import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChangeNoteDirPayload,
  ChangeNotePayload,
  SavedNotePayload,
  UserNotesType,
} from "@/types";
import { dbFuncs } from "@/util/db";

interface VerseNotesType {
  data: UserNotesType;
  dataKeys: string[];
  dataSaved: UserNotesType;
  loading: boolean;
  complete: boolean;
  error: boolean;
}

const initialState: VerseNotesType = {
  data: {},
  dataKeys: [],
  dataSaved: {},
  loading: true,
  complete: false,
  error: false,
};

export const fetchVerseNotes = createAsyncThunk<
  false | UserNotesType,
  void,
  { state: { verseNotes: VerseNotesType } }
>("verseNotes/fetchVerseNotes", async (_, { getState }) => {
  const { complete } = getState().verseNotes;
  if (complete) {
    return false;
  }

  const dbData = await dbFuncs.loadNotes();

  const notesData: UserNotesType = {};

  dbData.forEach((note) => {
    notesData[note.id] = {
      text: note.text,
      dir: note.dir,
      saved: true,
    };
  });

  return notesData;
});

const verseNotesSlice = createSlice({
  name: "verseNotes",
  initialState,
  reducers: {
    changeNote: (state, action: PayloadAction<ChangeNotePayload>) => {
      const { name, value } = action.payload;

      if (state.data[name]) {
        if (state.data[name].text !== value) {
          state.data[name].text = value;
          state.data[name].saved = false;
        }

        if (
          state.dataSaved[name] &&
          state.dataSaved[name].text === state.data[name].text
        ) {
          state.data[name].saved = true;
        }
      } else {
        state.data[name] = {
          text: value,
          dir: "",
          saved: false,
        };
        state.dataKeys.push(name);
      }
    },
    changeNoteDir: (state, action: PayloadAction<ChangeNoteDirPayload>) => {
      const { name, value } = action.payload;

      if (state.data[name]) {
        state.data[name].dir = value;
      } else {
        state.data[name] = {
          text: "",
          dir: value,
        };
        state.dataKeys.push(name);
      }
    },
    changeSavedNote: (state, action: PayloadAction<SavedNotePayload>) => {
      const name = action.payload.name;
      state.data[name].saved = true;
      state.dataSaved[name] = state.data[name];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVerseNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.complete = true;
        if (action.payload) {
          state.data = action.payload;
          state.dataKeys = Object.keys(action.payload);

          state.dataSaved = action.payload;
        }
      })
      .addCase(fetchVerseNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVerseNotes.rejected, (state) => {
        state.error = true;
      });
  },
});

export const verseNotesActions = verseNotesSlice.actions;

export default verseNotesSlice.reducer;
