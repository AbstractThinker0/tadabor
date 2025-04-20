import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChangeNotePayload, SavedNotePayload, UserNotesType } from "@/types";
import { dbFuncs } from "@/util/db";

interface TransNotesState {
  data: UserNotesType;
  dataKeys: string[];
  dataSaved: UserNotesType;
  loading: boolean;
  complete: boolean;
  error: boolean;
}

const initialState: TransNotesState = {
  data: {},
  dataKeys: [],
  dataSaved: {},
  loading: true,
  complete: false,
  error: false,
};

export const fetchTransNotes = createAsyncThunk<
  false | UserNotesType,
  void,
  { state: { transNotes: TransNotesState } }
>("transNotes/fetchTransNotes", async (_, { getState }) => {
  const { complete } = getState().transNotes;

  if (complete) {
    return false;
  }

  const dbData = await dbFuncs.loadTranslations();

  const notesData: UserNotesType = {};

  dbData.forEach((note) => {
    notesData[note.id] = {
      text: note.text,
      dir: "",
      saved: true,
    };
  });

  return notesData;
});

const transNotesSlice = createSlice({
  name: "transNotes",
  initialState,
  reducers: {
    changeTranslation: (state, action: PayloadAction<ChangeNotePayload>) => {
      const { name, value } = action.payload;

      if (state.data[name]) {
        if (state.data[name].text !== value) {
          state.data[name].text = value;
          state.data[name].saved = false;
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
    changeSavedTrans: (state, action: PayloadAction<SavedNotePayload>) => {
      const name = action.payload.name;
      state.data[name].saved = true;
      state.dataSaved[name] = state.data[name];
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

          state.dataSaved = action.payload;
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
