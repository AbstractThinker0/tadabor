import {
  IS_ACTIONS,
  clActionsProps,
  stateProps,
} from "@/components/Inspector/consts";

function isReducer(state: stateProps, action: clActionsProps): stateProps {
  switch (action.type) {
    case IS_ACTIONS.SET_CHAPTER: {
      return { ...state, currentChapter: action.payload };
    }
    case IS_ACTIONS.SET_SCROLL_KEY: {
      return { ...state, scrollKey: action.payload };
    }
    case IS_ACTIONS.GOTO_CHAPTER: {
      return { ...state, scrollKey: "", currentChapter: action.payload };
    }
  }
}

export default isReducer;
