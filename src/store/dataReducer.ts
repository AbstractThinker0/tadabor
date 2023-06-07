import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { translationsProps } from "../types";

// An axios instance that fetches data and cache it for long duration
const fetchJsonPerm = axios.create({
  baseURL: "/res",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": `max-age=31536000, immutable`,
  },
});

interface transListProps {
  [key: string]: { url: string };
}

const transList: transListProps = {
  "Muhammad Asad": { url: "/trans/Muhammad Asad.json" },
  "The Monotheist Group": { url: "/trans/The Monotheist Group.json" },
};

// Create a single async thunk for multiple fetch requests
export const fetchAllData = createAsyncThunk("data/fetchAllData", async () => {
  const transData: translationsProps = {};

  for (const key of Object.keys(transList)) {
    const response = await fetchJsonPerm.get(transList[key].url);

    transData[key] = response.data;
  }

  return { transData };
});

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    error: false,
    loading: false,
    complete: false,
    data: {} as translationsProps,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.complete = true;
        state.data = action.payload.transData;
      })
      .addCase(fetchAllData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllData.rejected, (state) => {
        state.error = true;
      });
  },
});

export const dataActions = dataSlice.actions;

export default dataSlice.reducer;
