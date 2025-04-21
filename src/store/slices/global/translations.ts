import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { translationsProps } from "@/types";
import { fetchTranslations } from "@/util/fetchData";

interface TranslationsStateProps {
  data: translationsProps;
  loading: boolean;
  complete: boolean;
  error: boolean;
}

const initialState: TranslationsStateProps = {
  error: false,
  loading: true,
  complete: false,
  data: {} as translationsProps,
};

// Create a single async thunk for multiple fetch requests
export const fetchAllTranslations = createAsyncThunk<
  false | translationsProps,
  void,
  { state: { translations: TranslationsStateProps } }
>("translations/fetchAllTranslations", async (_, { getState }) => {
  const { complete } = getState().translations;

  if (complete) {
    return false;
  }
  const transData: translationsProps = await fetchTranslations();

  return transData;
});

const translationsSlice = createSlice({
  name: "translations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTranslations.fulfilled, (state, action) => {
        state.loading = false;
        state.complete = true;

        if (action.payload) {
          state.data = action.payload;
        }
      })
      .addCase(fetchAllTranslations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTranslations.rejected, (state) => {
        state.error = true;
      });
  },
});

export const translationsActions = translationsSlice.actions;

export default translationsSlice.reducer;
