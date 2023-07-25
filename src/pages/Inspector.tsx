import { useReducer } from "react";

import ChaptersList from "../components/Inspector/ChaptersList";
import Display from "../components/Inspector/Display";
import {
  IS_ACTIONS,
  clActionsProps,
  isActions,
} from "../components/Inspector/consts";

interface stateProps {
  currentChapter: number;
  scrollKey: string;
}

function reducer(state: stateProps, action: clActionsProps): stateProps {
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

function Inspector() {
  const initialState: stateProps = {
    currentChapter: 1,
    scrollKey: "",
  };

  const [state, dispatchIsAction] = useReducer(reducer, initialState);

  function handleSelectChapter(chapterID: string) {
    dispatchIsAction(isActions.setChapter(Number(chapterID)));
  }

  return (
    <div className="inspector">
      <ChaptersList
        selectedChapter={state.currentChapter}
        handleSelectChapter={handleSelectChapter}
      />
      <Display
        currentChapter={state.currentChapter}
        dispatchIsAction={dispatchIsAction}
        scrollKey={state.scrollKey}
      />
    </div>
  );
}

export default Inspector;
