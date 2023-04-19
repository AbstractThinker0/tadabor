import { Reducer, useEffect, useReducer, useRef, useState } from "react";
import useQuran from "../context/QuranContext";
import { verseProps } from "../types";

import { getTextColor } from "../components/Coloring/util";
import {
  CL_ACTIONS,
  colorProps,
  coloredProps,
} from "../components/Coloring/consts";

import AddColorModal from "../components/Coloring/AddColorModal";
import DeleteColorModal from "../components/Coloring/DeleteColorModal";
import EditColorsModal from "../components/Coloring/EditColorsModal";

import LoadingSpinner from "../components/LoadingSpinner";

import {
  IColor,
  IVerseColor,
  dbDeleteColor,
  dbDeleteVerseColor,
  dbLoadColors,
  dbLoadVersesColor,
  dbSaveColor,
} from "../util/db";
import VersesSide from "../components/Coloring/VersesSide";

interface stateProps {
  currentChapter: number;
  chapterToken: string;
  colorsList: coloredProps;
  selectedColors: coloredProps;
  coloredVerses: coloredProps;
  currentVerse: verseProps | null;
  currentColor: colorProps | null;
}

interface reducerAction {
  type: CL_ACTIONS;
  payload: any;
}

function reducer(state: stateProps, action: reducerAction): stateProps {
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
      let newColor: colorProps;
      newColor = action.payload;

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
      let selectedColors = { ...state.selectedColors };
      delete selectedColors[action.payload];
      return {
        ...state,
        selectedColors: selectedColors,
      };
    }
    case CL_ACTIONS.DELETE_COLOR: {
      let newColorsList = { ...state.colorsList };
      delete newColorsList[action.payload];

      let coloredVerses = { ...state.coloredVerses };

      for (const verseKey in coloredVerses) {
        if (coloredVerses[verseKey].colorID === action.payload) {
          delete coloredVerses[verseKey];
        }
      }

      let selectedColors = { ...state.selectedColors };
      delete selectedColors[action.payload];

      return {
        ...state,
        colorsList: newColorsList,
        coloredVerses: coloredVerses,
        selectedColors: selectedColors,
      };
    }
    case CL_ACTIONS.SET_VERSE_COLOR: {
      let coloredVerses = { ...state.coloredVerses };

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
    default:
      throw action.type;
  }
}

function Coloring() {
  const { chapterNames } = useQuran();
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let savedColors: IColor[];

      savedColors = await dbLoadColors();

      let initialColors: coloredProps = {};

      savedColors.forEach((color) => {
        initialColors[color.id] = {
          colorID: color.id,
          colorDisplay: color.name,
          colorCode: color.code,
        };
      });

      dispatchClAction(CL_ACTIONS.SET_COLORS_LIST, initialColors);

      let savedVersesColor: IVerseColor[];

      savedVersesColor = await dbLoadVersesColor();

      let initialColoredVerses: coloredProps = {};

      savedVersesColor.forEach((verseColor) => {
        initialColoredVerses[verseColor.verse_key] =
          initialColors[verseColor.color_id];
      });

      dispatchClAction(CL_ACTIONS.SET_COLORED_VERSES, initialColoredVerses);

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

      dispatchClAction(CL_ACTIONS.SET_COLORS_LIST, initialColors);

      Object.keys(initialColors).forEach((colorID) => {
        dbSaveColor({
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

  const initialState: stateProps = {
    currentChapter: 1,
    chapterToken: "",
    colorsList: {},
    selectedColors: {},
    coloredVerses: {},
    currentVerse: null,
    currentColor: null,
  };

  const [state, dispatch] = useReducer<Reducer<stateProps, reducerAction>>(
    reducer,
    initialState
  );

  const dispatchClAction = (action: CL_ACTIONS, payload: any) =>
    dispatch({ type: action, payload: payload });

  const refChapter = useRef<HTMLDivElement | null>(null);

  function onClickChapter(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chapterID: number
  ) {
    dispatchClAction(CL_ACTIONS.SET_CHAPTER, chapterID);
    dispatchClAction(CL_ACTIONS.SET_CHAPTER_TOKEN, "");

    document.documentElement.scrollTop = 0;

    refChapter.current = event.currentTarget;
  }

  useEffect(() => {
    if (refChapter.current && refChapter.current.parentElement) {
      const child = refChapter.current;
      const parent = refChapter.current.parentElement;

      const parentOffsetTop = parent.offsetTop;

      if (
        parent.scrollTop + parentOffsetTop <
          child.offsetTop - parent.clientHeight + child.clientHeight * 2 ||
        parent.scrollTop + parentOffsetTop >
          child.offsetTop - child.clientHeight * 1.5
      ) {
        parent.scrollTop =
          child.offsetTop - parentOffsetTop - parent.clientHeight / 2;
      }
    }
  }, [state.currentChapter]);

  function onChangeChapterToken(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchClAction(CL_ACTIONS.SET_CHAPTER_TOKEN, event.target.value);
  }

  function onClickSelectColor(color: colorProps) {
    dispatchClAction(CL_ACTIONS.SELECT_COLOR, color);
  }

  function onClickDeleteColor(color: colorProps) {
    dispatchClAction(CL_ACTIONS.SET_CURRENT_COLOR, color);
  }

  function deleteColor(colorID: string) {
    dispatchClAction(CL_ACTIONS.DELETE_COLOR, colorID);
    dbDeleteColor(colorID);

    for (const verseKey in state.coloredVerses) {
      if (state.coloredVerses[verseKey].colorID === colorID) {
        dbDeleteVerseColor(verseKey);
      }
    }
  }

  function addColor(color: colorProps) {
    dispatchClAction(CL_ACTIONS.ADD_COLOR, color);
  }

  function setColorsList(colorsList: coloredProps) {
    dispatchClAction(CL_ACTIONS.SET_COLORS_LIST, colorsList);

    Object.keys(colorsList).forEach((colorID) => {
      dbSaveColor({
        id: colorsList[colorID].colorID,
        name: colorsList[colorID].colorDisplay,
        code: colorsList[colorID].colorCode,
      });
    });

    let newColoredVerses: coloredProps = {};
    Object.keys(state.coloredVerses).forEach((verseKey) => {
      newColoredVerses[verseKey] =
        colorsList[state.coloredVerses[verseKey].colorID];
    });

    dispatchClAction(CL_ACTIONS.SET_COLORED_VERSES, newColoredVerses);
  }

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="coloring">
      <div className="chapters-side">
        <input
          className="chapter-search"
          type="text"
          placeholder={chapterNames[state.currentChapter - 1].name}
          value={state.chapterToken}
          onChange={onChangeChapterToken}
        />
        <div className="chapter-list">
          {chapterNames
            .filter((chapter) => chapter.name.includes(state.chapterToken))
            .map((chapter) => (
              <div
                key={chapter.id}
                onClick={(event) => onClickChapter(event, chapter.id)}
                className={`chapter-list-item ${
                  state.currentChapter === chapter.id
                    ? "chapter-list-item-selected"
                    : ""
                }`}
              >
                {chapter.name}
              </div>
            ))}
        </div>
        <div className="text-center" dir="ltr">
          Colors list:
        </div>
        <div className="chapters-side-colors" dir="ltr">
          {Object.keys(state.colorsList).length > 0
            ? Object.keys(state.colorsList).map((colorID) => (
                <div
                  key={state.colorsList[colorID].colorID}
                  className="chapters-side-colors-item text-center rounded mb-1"
                  style={{
                    backgroundColor: state.colorsList[colorID].colorCode,
                    color: getTextColor(state.colorsList[colorID].colorCode),
                  }}
                >
                  <div
                    onClick={() =>
                      onClickSelectColor(state.colorsList[colorID])
                    }
                    className="opacity-0"
                  >
                    🗑️
                  </div>
                  <div
                    className="flex-grow-1"
                    onClick={() =>
                      onClickSelectColor(state.colorsList[colorID])
                    }
                  >
                    {state.colorsList[colorID].colorDisplay}
                  </div>
                  <div
                    data-bs-toggle="modal"
                    data-bs-target="#deleteColorModal"
                    onClick={() =>
                      onClickDeleteColor(state.colorsList[colorID])
                    }
                  >
                    🗑️
                  </div>
                </div>
              ))
            : ""}
        </div>
        <DeleteColorModal
          currentColor={state.currentColor}
          deleteColor={deleteColor}
          versesCount={
            Object.keys(state.coloredVerses).filter((verseKey) => {
              return (
                state.coloredVerses[verseKey]?.colorID ===
                state.currentColor?.colorID
              );
            }).length
          }
        />
        <div className="text-center d-flex gap-2" dir="ltr">
          <button
            className="btn btn-dark mt-1"
            data-bs-toggle="modal"
            data-bs-target="#colorsModal"
          >
            New color
          </button>
          <button
            className="btn btn-info mt-1"
            data-bs-toggle="modal"
            data-bs-target="#editColorsModal"
          >
            Edit colors
          </button>
        </div>
        <AddColorModal addColor={addColor} />
        <EditColorsModal
          colorsList={{ ...state.colorsList }}
          setColorsList={setColorsList}
        />
      </div>
      <VersesSide
        selectedColors={state.selectedColors}
        coloredVerses={state.coloredVerses}
        currentChapter={state.currentChapter}
        colorsList={state.colorsList}
        currentVerse={state.currentVerse}
        dispatchClAction={dispatchClAction}
      />
    </div>
  );
}

export default Coloring;
