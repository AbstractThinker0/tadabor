import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { rootProps } from "quran-tools";

interface RootsObject {
  [key: string]: rootProps;
}

interface SearcherPageState {
  search_roots: RootsObject;
  verseTab: string;
  tabIndex: string;
  verses_count: number;
  scrollKey: string;
  showSearchPanel: boolean;
  showSearchPanelMobile: boolean;
}

const initialState: SearcherPageState = {
  search_roots: {},
  verseTab: "",
  tabIndex: "searcherTab",
  verses_count: 0,
  scrollKey: "",
  showSearchPanel: true,
  showSearchPanelMobile: false,
};

export const useSearcherPageStore = create(
  immer(
    combine(initialState, (set) => ({
      addRoot: (root: rootProps) => {
        set((state) => {
          state.search_roots[root.id] = root;
        });
      },
      deleteRoot: (root_id: string) => {
        set((state) => {
          delete state.search_roots[root_id];
        });
      },
      setTabIndex: (tabIndex: string) => {
        set((state) => {
          state.tabIndex = tabIndex;
        });
      },
      setVerseTab: (verseTab: string) => {
        set((state) => {
          state.verseTab = verseTab;
          state.tabIndex = "verseTab";
        });
      },
      setVersesCount: (verses_count: number) => {
        set((state) => {
          state.verses_count = verses_count;
        });
      },
      setScrollKey: (scrollKey: string) => {
        set((state) => {
          state.scrollKey = scrollKey;
        });
      },
      setSearchPanel: (isOpen: boolean) => {
        set((state) => {
          state.showSearchPanel = isOpen;
          state.showSearchPanelMobile = isOpen;
        });
      },
    }))
  )
);
