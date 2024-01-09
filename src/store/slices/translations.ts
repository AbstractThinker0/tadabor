import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { translationsProps } from "@/types";
import { fetchTranslations } from "@/util/fetchData";

// Create a single async thunk for multiple fetch requests
export const fetchAllTranslations = createAsyncThunk(
  "translations/fetchAllTranslations",
  async () => {
    const transData: translationsProps = await fetchTranslations();

    return { transData };
  }
);

const translationsSlice = createSlice({
  name: "translations",
  initialState: {
    error: false,
    loading: false,
    complete: false,
    data: {} as translationsProps,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTranslations.fulfilled, (state, action) => {
        state.loading = false;
        state.complete = true;
        state.data = action.payload.transData;
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
