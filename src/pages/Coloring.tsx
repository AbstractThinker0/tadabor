import { useEffect, useReducer, useState } from "react";

import { selectedChaptersType, verseProps } from "@/types";
import { IColor, IVerseColor, dbFuncs } from "@/util/db";
import useQuran from "@/context/useQuran";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import {
  CL_ACTIONS,
  clActions,
  clActionsProps,
  colorProps,
  coloredProps,
} from "@/components/Coloring/consts";
import VersesSide from "@/components/Coloring/VersesSide";
import ChaptersSide from "@/components/Coloring/ChaptersSide";

interface stateProps {
  currentChapter: number;
  chapterToken: string;
  colorsList: coloredProps;
  selectedColors: coloredProps;
  coloredVerses: coloredProps;
  currentVerse: verseProps | null;
  currentColor: colorProps | null;
  selectedChapters: selectedChaptersType;
  scrollKey: string;
}

function reducer(state: stateProps, action: clActionsProps): stateProps {
  switch (action.type) {
    case CL_ACTIONS.SET_CHAPTER: {
      return { ...state, currentChapter: action.payload };
    }
    case CL_ACTIONS.SET_CHAPTER_TOKEN: {
      return { ...state, chapterToken: action.payload };
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

function Coloring() {
  const quranService = useQuran();
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const savedColors: IColor[] = await dbFuncs.loadColors();

      const initialColors: coloredProps = {};

      savedColors.forEach((color) => {
        initialColors[color.id] = {
          colorID: color.id,
          colorDisplay: color.name,
          colorCode: color.code,
        };
      });

      dispatchClAction(clActions.setColorsList(initialColors));

      const savedVersesColor: IVerseColor[] = await dbFuncs.loadVersesColor();

      const initialColoredVerses: coloredProps = {};

      savedVersesColor.forEach((verseColor) => {
        initialColoredVerses[verseColor.verse_key] =
          initialColors[verseColor.color_id];
      });

      dispatchClAction(clActions.setColoredVerses(initialColoredVerses));

      setLoadingState(false);
    }
    if (localStorage.getItem("defaultColorsInitiated") === null) {
      const initialColors: coloredProps = {
        "0": { colorID: "0", colorCode: "#3dc23d", colorDisplay: "Studied" },
        "1": {
          colorID: "1",
          colorCode: "#dfdf58",
          colorDisplay: "In progress",
        },
        "2": { colorID: "2", colorCode: "#da5252", colorDisplay: "Unexplored" },
      };

      dispatchClAction(clActions.setColorsList(initialColors));

      Object.keys(initialColors).forEach((colorID) => {
        dbFuncs.saveColor({
          id: initialColors[colorID].colorID,
          name: initialColors[colorID].colorDisplay,
          code: initialColors[colorID].colorCode,
        });
      });

      localStorage.setItem("defaultColorsInitiated", "true");
      setLoadingState(false);
    } else {
      fetchData();
    }
  }, []);

  const initialSelectedChapters: selectedChaptersType = {};

  quranService.chapterNames.forEach((chapter) => {
    initialSelectedChapters[chapter.id] = true;
  });

  const initialState: stateProps = {
    currentChapter: 1,
    chapterToken: "",
    colorsList: {},
    selectedColors: {},
    coloredVerses: {},
    currentVerse: null,
    currentColor: null,
    selectedChapters: initialSelectedChapters,
    scrollKey: "",
  };

  const [state, dispatchClAction] = useReducer(reducer, initialState);

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="coloring">
      <ChaptersSide
        chapterToken={state.chapterToken}
        currentChapter={state.currentChapter}
        colorsList={state.colorsList}
        currentColor={state.currentColor}
        coloredVerses={state.coloredVerses}
        selectedChapters={state.selectedChapters}
        dispatchClAction={dispatchClAction}
      />
      <VersesSide
        selectedColors={state.selectedColors}
        coloredVerses={state.coloredVerses}
        currentChapter={state.currentChapter}
        colorsList={state.colorsList}
        currentVerse={state.currentVerse}
        selectedChapters={state.selectedChapters}
        scrollKey={state.scrollKey}
        dispatchClAction={dispatchClAction}
      />
    </div>
  );
}

export default Coloring;
