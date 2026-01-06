import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const keyCenterVerses = "centerVerses";
const keyToolsMode = "toolsMode";
const keyToolCopy = "toolCopy";
const keyToolNote = "toolNote";
const keyToolInspect = "toolInspect";
const keyVerseDisplay = "verseDisplay";

export type ToolsMode = "expanded" | "collapsed" | "hidden";
export type VerseDisplay = "line" | "panel" | "continous";

interface NavigationState {
  currentPage: string;
  centerVerses: boolean;
  toolsMode: ToolsMode;
  toolCopy: boolean;
  toolNote: boolean;
  toolInspect: boolean;
  verseDisplay: VerseDisplay;
  isSmallScreen: boolean;
  isBetaVersion: boolean;
  pageDirection: string;
}

const getDefaultCenterVerses = () =>
  localStorage.getItem(keyCenterVerses) === "true";
const getDefaultToolsMode = () =>
  (localStorage.getItem(keyToolsMode) || "expanded") as ToolsMode;
const getDefaultToolCopy = () => localStorage.getItem(keyToolCopy) !== "false";
const getDefaultToolNote = () => localStorage.getItem(keyToolNote) !== "false";
const getDefaultToolInspect = () =>
  localStorage.getItem(keyToolInspect) !== "false";
const getDefaultVerseDisplay = () =>
  (localStorage.getItem(keyVerseDisplay) || "line") as VerseDisplay;

const initialState: NavigationState = {
  currentPage: "",
  centerVerses: getDefaultCenterVerses(),
  toolsMode: getDefaultToolsMode(),
  toolCopy: getDefaultToolCopy(),
  toolNote: getDefaultToolNote(),
  toolInspect: getDefaultToolInspect(),
  verseDisplay: getDefaultVerseDisplay(),
  isSmallScreen: window.innerWidth <= 768 || window.innerHeight <= 480,
  isBetaVersion: localStorage.getItem("betaVersion") === "true",
  pageDirection: localStorage.getItem("i18nextLng") === null ? "rtl" : "ltr",
};

export const useNavigationStore = create(
  immer(
    combine(initialState, (set) => ({
      setCurrentPage: (currentPage: string) => {
        set((state) => {
          state.currentPage = currentPage;
        });
      },

      setCenterVerses: (centerVerses: boolean) => {
        set((state) => {
          state.centerVerses = centerVerses;
        });
        localStorage.setItem(keyCenterVerses, centerVerses ? "true" : "false");
      },

      toggleCenterVerses: () => {
        set((state) => {
          state.centerVerses = !state.centerVerses;
          localStorage.setItem(
            keyCenterVerses,
            state.centerVerses ? "true" : "false"
          );
        });
      },

      setVerseTools: (toolsMode: string) => {
        set((state) => {
          state.toolsMode = toolsMode as ToolsMode;
        });
        localStorage.setItem(keyToolsMode, toolsMode);
      },

      setToolCopy: (toolCopy: boolean) => {
        set((state) => {
          state.toolCopy = toolCopy;
        });
        localStorage.setItem(keyToolCopy, toolCopy ? "true" : "false");
      },

      setToolNote: (toolNote: boolean) => {
        set((state) => {
          state.toolNote = toolNote;
        });
        localStorage.setItem(keyToolNote, toolNote ? "true" : "false");
      },

      setToolInspect: (toolInspect: boolean) => {
        set((state) => {
          state.toolInspect = toolInspect;
        });
        localStorage.setItem(keyToolInspect, toolInspect ? "true" : "false");
      },

      setVerseDisplay: (verseDisplay: string) => {
        set((state) => {
          state.verseDisplay = verseDisplay as VerseDisplay;
        });
        localStorage.setItem(keyVerseDisplay, verseDisplay);
      },

      setSmallScreen: (isSmallScreen: boolean) => {
        set((state) => {
          state.isSmallScreen = isSmallScreen;
        });
      },

      setBetaStatus: (isBetaVersion: boolean) => {
        set((state) => {
          state.isBetaVersion = isBetaVersion;
        });
        localStorage.setItem("betaVersion", isBetaVersion ? "true" : "false");
      },

      setPageDirection: (pageDirection: string) => {
        set((state) => {
          state.pageDirection = pageDirection;
        });
      },
    }))
  )
);
