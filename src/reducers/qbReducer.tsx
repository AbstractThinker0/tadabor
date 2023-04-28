import {
  QB_ACTIONS,
  qbStateProps,
  qbActionsProps,
} from "../components/QuranBrowser/consts";
import { qbSearchRoot, qbSearchWord } from "./qbActionSearch";

function qbReducer(state: qbStateProps, action: qbActionsProps): qbStateProps {
  // ...
  switch (action.type) {
    case QB_ACTIONS.SET_CHAPTERS: {
      return { ...state, selectedChapters: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_STRING: {
      return { ...state, searchString: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_DIACRITICS: {
      return { ...state, searchDiacritics: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_IDENTICAL: {
      return { ...state, searchIdentical: action.payload };
    }
    case QB_ACTIONS.SET_RADIO_SEARCH: {
      return { ...state, radioSearchMethod: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_SCOPE: {
      return { ...state, searchScope: action.payload };
    }
    case QB_ACTIONS.SEARCH_ROOT_SUBMIT: {
      return qbSearchRoot(state, action.payload);
    }
    case QB_ACTIONS.SEARCH_WORD_SUBMIT: {
      return qbSearchWord(state, action.payload);
    }
    case QB_ACTIONS.GOTO_CHAPTER: {
      return {
        ...state,
        searchError: false,
        selectedRootError: false,
        searchResult: [],
        searchIndexes: [],
        selectChapter: Number(action.payload),
        selectedChapters: [action.payload],
      };
    }
  }
}

export default qbReducer;
