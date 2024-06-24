import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LettersDefinitionType, LettersDataByVerseType } from "@/types";
import { dbFuncs, ILetterData } from "@/util/db";
import { LetterRole } from "@/util/consts";

interface LettersPageState {
  currentChapter: number;
  scrollKey: string;
  showQuranTab: boolean;
  lettersDefinitions: LettersDefinitionType;
  definitionsLoading: boolean;
  definitionsComplete: boolean;
  definitionsError: boolean;
  lettersData: LettersDataByVerseType;
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
  false | ILetterData[],
  void,
  { state: { lettersPage: LettersPageState } }
>("lettersPage/fetchLettersData", async (_, { getState }) => {
  const { dataComplete } = getState().lettersPage;
  if (dataComplete) {
    return false;
  }

  const dbData = await dbFuncs.loadLettersData();

  return dbData;
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
      const letterInfo = action.payload.letter.split(":");
      const verseKey = letterInfo[0];
      const letterKey = letterInfo[1];

      if (!state.lettersData[verseKey]) {
        state.lettersData[verseKey] = {}; // Initialize if not already
      }

      state.lettersData[verseKey][letterKey] = {
        letter_key: letterKey,
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
          const notesData: LettersDataByVerseType = {};

          action.payload.forEach((letter) => {
            const letterInfo = letter.letter_key.split(":");
            const verseKey = letterInfo[0];
            const letterKey = letterInfo[1];

            if (!notesData[verseKey]) {
              notesData[verseKey] = {}; // Initialize if not already
            }

            notesData[verseKey][letterKey] = {
              letter_key: letterKey,
              letter_role: letter.letter_role,
              def_id: letter.def_id,
            };
          });

          state.lettersData = notesData;
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
