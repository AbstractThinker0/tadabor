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

interface RootNotesType {
  data: UserNotesType;
  loading: boolean;
  complete: boolean;
  error: boolean;
}

const initialState: RootNotesType = {
  data: {},
  loading: true,
  complete: false,
  error: false,
};

export const fetchRootNotes = createAsyncThunk<
  false | UserNotesType,
  void,
  { state: { rootNotes: RootNotesType } }
>("rootNotes/fetchRootNotes", async (_, { getState }) => {
  const { complete } = getState().rootNotes;

  if (complete) {
    return false;
  }

  const dbData = await dbFuncs.loadRootNotes();

  const notesData: UserNotesType = {};

  dbData.forEach((note) => {
    notesData[note.id] = {
      text: note.text,
      dir: note.dir,
    };
  });

  return notesData;
});

const rootNotesSlice = createSlice({
  name: "rootNotes",
  initialState,
  reducers: {
    changeRootNote: (state, action: PayloadAction<ChangeNotePayload>) => {
      const { name, value } = action.payload;

      if (state.data[name]) {
        state.data[name].text = value;
      } else {
        state.data[name] = {
          text: value,
          dir: "",
        };
      }
    },
    changeRootNoteDir: (state, action: PayloadAction<ChangeNoteDirPayload>) => {
      const { name, value } = action.payload;

      if (state.data[name]) {
        state.data[name].dir = value;
      } else {
        state.data[name] = {
          text: "",
          dir: value,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRootNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.complete = true;
        if (action.payload) state.data = action.payload;
      })
      .addCase(fetchRootNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRootNotes.rejected, (state) => {
        state.error = true;
      });
  },
});

export const rootNotesActions = rootNotesSlice.actions;

export default rootNotesSlice.reducer;
