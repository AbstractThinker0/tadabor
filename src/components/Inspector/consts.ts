import { ActionsUnion, createActionPayload } from "@/types/useReducer";

export interface stateProps {
  currentChapter: number;
  scrollKey: string;
}

export enum IS_ACTIONS {
  SET_CHAPTER = "dispatchSetChapter",
  SET_SCROLL_KEY = "dispatchSetScrollKey",
  GOTO_CHAPTER = "dispatchGotoChapter",
}

export const isActions = {
  setChapter: createActionPayload<IS_ACTIONS.SET_CHAPTER, number>(
    IS_ACTIONS.SET_CHAPTER
  ),
  setScrollKey: createActionPayload<IS_ACTIONS.SET_SCROLL_KEY, string>(
    IS_ACTIONS.SET_SCROLL_KEY
  ),
  gotoChapter: createActionPayload<IS_ACTIONS.GOTO_CHAPTER, number>(
    IS_ACTIONS.GOTO_CHAPTER
  ),
};

export type clActionsProps = ActionsUnion<typeof isActions>;
