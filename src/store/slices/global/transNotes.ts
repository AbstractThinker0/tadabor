import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransNotesType } from "@/types";
import { dbFuncs } from "@/util/db";

interface ChangeTranslationPayload {
  name: string;
  value: string;
}

interface TransNotesState {
  data: TransNotesType;
  dataKeys: string[];
  loading: boolean;
  complete: boolean;
  error: boolean;
}

const initialState: TransNotesState = {
  data: {},
  dataKeys: [],
  loading: true,
  complete: false,
  error: false,
};

export const fetchTransNotes = createAsyncThunk<
  false | TransNotesType,
  void,
  { state: { transNotes: TransNotesState } }
>("transNotes/fetchTransNotes", async (_, { getState }) => {
  const { complete } = getState().transNotes;

  if (complete) {
    return false;
  }

  const dbData = await dbFuncs.loadTranslations();

  const notesData: TransNotesType = {};

  dbData.forEach((note) => {
    notesData[note.id] = note.text;
  });

  return notesData;
});

const transNotesSlice = createSlice({
  name: "transNotes",
  initialState,
  reducers: {
    changeTranslation: (
      state,
      action: PayloadAction<ChangeTranslationPayload>
    ) => {
      const { name, value } = action.payload;

      state.data[name] = value;

      if (!state.dataKeys.includes(name)) {
        state.dataKeys.push(name);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.complete = true;
        if (action.payload) {
          state.data = action.payload;
          state.dataKeys = Object.keys(action.payload);
        }
      })
      .addCase(fetchTransNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransNotes.rejected, (state) => {
        state.error = true;
      });
  },
});

export const transNotesActions = transNotesSlice.actions;

export default transNotesSlice.reducer;
