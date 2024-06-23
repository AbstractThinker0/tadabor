import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LettersDefinitionType, LettersDataType } from "@/types";
import { dbFuncs } from "@/util/db";
import { LetterRole } from "@/util/consts";

interface LettersPageState {
  currentChapter: number;
  scrollKey: string;
  showQuranTab: boolean;
  lettersDefinitions: LettersDefinitionType;
  definitionsLoading: boolean;
  definitionsComplete: boolean;
  definitionsError: boolean;
  lettersData: LettersDataType;
  dataLoading: boolean;
  dataComplete: boolean;
  dataError: boolean;
}

const initialState: LettersPageState = {
  currentChapter: 1,
  scrollKey: "",
  showQuranTab: false,
  lettersDefinitions: {},
  definitionsLoading: true,
  definitionsComplete: false,
  definitionsError: false,
  lettersData: {},
  dataLoading: true,
  dataComplete: false,
  dataError: false,
};

export const fetchLettersDefinitions = createAsyncThunk<
  false | LettersDefinitionType,
  void,
  { state: { lettersPage: LettersPageState } }
>("lettersPage/fetchLettersDefinitions", async (_, { getState }) => {
  const { definitionsComplete } = getState().lettersPage;
  if (definitionsComplete) {
    return false;
  }

  const dbData = await dbFuncs.loadLettersDefinition();

  const notesData: LettersDefinitionType = {};

  dbData.forEach((letter) => {
    notesData[letter.name] = {
      definition: letter.definition,
      dir: letter.dir,
      preset_id: letter.preset_id,
    };
  });

  return notesData;
});

export const fetchLettersData = createAsyncThunk<
  false | LettersDataType,
  void,
  { state: { lettersPage: LettersPageState } }
>("lettersPage/fetchLettersRoles", async (_, { getState }) => {
  const { dataComplete } = getState().lettersPage;
  if (dataComplete) {
    return false;
  }

  const dbData = await dbFuncs.loadLettersData();

  const notesData: LettersDataType = {};

  dbData.forEach((letter) => {
    notesData[letter.letter_key] = {
      letter_role: letter.letter_role,
      def_id: letter.def_id,
    };
  });

  return notesData;
});

const lettersPageSlice = createSlice({
  name: "lettersPage",
  initialState,
  reducers: {
    setCurrentChapter: (state, action: PayloadAction<number>) => {
      state.currentChapter = action.payload;
    },
    setScrollKey: (state, action: PayloadAction<string>) => {
      state.scrollKey =
        state.scrollKey === action.payload ? "" : action.payload;
    },
    setShowQuranTab: (state, action: PayloadAction<boolean>) => {
      state.showQuranTab = action.payload;
    },
    setLetterDefinition: (
      state,
      action: PayloadAction<{
        letter: string;
        definition: string;
        preset_id: string;
        dir?: string;
      }>
    ) => {
      state.lettersDefinitions[action.payload.letter] = {
        definition: action.payload.definition,
        dir: action.payload.dir,
        preset_id: action.payload.preset_id,
      };
    },
    setLetterData: (
      state,
      action: PayloadAction<{
        letter: string;
        role: LetterRole;
        def_id: string;
      }>
    ) => {
      state.lettersData[action.payload.letter] = {
        letter_role: action.payload.role,
        def_id: action.payload.def_id,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLettersDefinitions.fulfilled, (state, action) => {
        state.definitionsLoading = false;
        state.definitionsComplete = true;
        if (action.payload) {
          state.lettersDefinitions = action.payload;
        }
      })
      .addCase(fetchLettersDefinitions.pending, (state) => {
        state.definitionsLoading = true;
      })
      .addCase(fetchLettersDefinitions.rejected, (state) => {
        state.definitionsError = true;
      })
      .addCase(fetchLettersData.fulfilled, (state, action) => {
        state.dataLoading = false;
        state.dataComplete = true;
        if (action.payload) {
          state.lettersData = action.payload;
        }
      })
      .addCase(fetchLettersData.pending, (state) => {
        state.dataLoading = true;
      })
      .addCase(fetchLettersData.rejected, (state) => {
        state.dataError = true;
      });
  },
});

export const lettersPageActions = lettersPageSlice.actions;

export default lettersPageSlice.reducer;
