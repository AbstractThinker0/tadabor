import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { translationsProps } from "@/types";
import { fetchTranslations } from "@/util/fetchData";
import { tryCatch } from "@/util/trycatch";

interface TranslationsState {
  data: translationsProps;
  loading: boolean;
  complete: boolean;
  error: boolean;
}

const initialState: TranslationsState = {
  data: {},
  loading: false,
  complete: false,
  error: false,
};

export const useTranslationsStore = create(
  immer(
    combine(initialState, (set, get) => ({
      fetchTranslations: async () => {
        const { complete } = get();

        if (complete) return false;

        set((state) => {
          state.loading = true;
          state.error = false;
        });

        const { result, error } = await tryCatch(fetchTranslations());

        if (error) {
          console.error("Failed to load translations:", error);
          set((state) => {
            state.loading = false;
            state.error = true;
          });
          return false;
        }

        set((state) => {
          state.data = result;
          state.loading = false;
          state.complete = true;
          state.error = false;
        });

        return result;
      },
    }))
  )
);
