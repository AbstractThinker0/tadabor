import {
  CL_ACTIONS,
  stateProps,
  clActionsProps,
  colorProps,
} from "@/components/Coloring/consts";

function clReducer(state: stateProps, action: clActionsProps): stateProps {
  switch (action.type) {
    case CL_ACTIONS.SET_CHAPTER: {
      return { ...state, currentChapter: action.payload };
    }
    case CL_ACTIONS.SET_COLORS_LIST: {
      return { ...state, colorsList: action.payload };
    }
    case CL_ACTIONS.ADD_COLOR: {
      const newColor: colorProps = action.payload;

      return {
        ...state,
        colorsList: {
          ...state.colorsList,
          [newColor.colorID]: { ...newColor },
        },
      };
    }
    case CL_ACTIONS.SELECT_COLOR: {
      return {
        ...state,
        selectedColors: {
          ...state.selectedColors,
          [action.payload.colorID]: action.payload,
        },
      };
    }
    case CL_ACTIONS.DESELECT_COLOR: {
      const selectedColors = { ...state.selectedColors };
      delete selectedColors[action.payload];
      return {
        ...state,
        selectedColors: selectedColors,
      };
    }
    case CL_ACTIONS.DELETE_COLOR: {
      const newColorsList = { ...state.colorsList };
      delete newColorsList[action.payload];

      const coloredVerses = { ...state.coloredVerses };

      for (const verseKey in coloredVerses) {
        if (coloredVerses[verseKey].colorID === action.payload) {
          delete coloredVerses[verseKey];
        }
      }

      const selectedColors = { ...state.selectedColors };
      delete selectedColors[action.payload];

      return {
        ...state,
        colorsList: newColorsList,
        coloredVerses: coloredVerses,
        selectedColors: selectedColors,
      };
    }
    case CL_ACTIONS.SET_VERSE_COLOR: {
      const coloredVerses = { ...state.coloredVerses };

      if (action.payload.color === null) {
        delete coloredVerses[action.payload.verseKey];

        return {
          ...state,
          coloredVerses: coloredVerses,
        };
      }

      return {
        ...state,
        coloredVerses: {
          ...state.coloredVerses,
          [action.payload.verseKey]: action.payload.color,
        },
      };
    }
    case CL_ACTIONS.SET_COLORED_VERSES: {
      return { ...state, coloredVerses: { ...action.payload } };
    }
    case CL_ACTIONS.SET_CURRENT_VERSE: {
      return { ...state, currentVerse: action.payload };
    }
    case CL_ACTIONS.SET_CURRENT_COLOR: {
      return { ...state, currentColor: action.payload };
    }
    case CL_ACTIONS.SET_SELECTED_CHAPTERS: {
      return { ...state, selectedChapters: action.payload };
    }
    case CL_ACTIONS.TOGGLE_SELECT_CHAPTER: {
      const newSelectChapters = { ...state.selectedChapters };
      newSelectChapters[action.payload] = !newSelectChapters[action.payload];
      return { ...state, selectedChapters: newSelectChapters };
    }
    case CL_ACTIONS.SET_SCROLL_KEY: {
      const newKey = state.scrollKey === action.payload ? "" : action.payload;
      return { ...state, scrollKey: newKey };
    }
    case CL_ACTIONS.GOTO_CHAPTER: {
      return { ...state, selectedColors: {}, currentChapter: action.payload };
    }
  }
}

export default clReducer;
