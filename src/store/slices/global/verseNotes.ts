import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserNotesType } from "@/types";
import { dbFuncs } from "@/util/db";

interface ChangeNotePayload {
  name: string;
  value: string;
}

interface ChangeNoteDirPayload {
  name: string;
  value: string;
}

interface VerseNotesType {
  data: UserNotesType;
  dataKeys: string[];
  loading: boolean;
  complete: boolean;
  error: boolean;
}

const initialState: VerseNotesType = {
  data: {},
  dataKeys: [],
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
        state.data[name].text = value;
      } else {
        state.data[name] = {
          text: value,
          dir: "",
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVerseNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.complete = true;
        if (action.payload) {
          state.data = action.payload;
          state.dataKeys = Object.keys(action.payload);
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
