import { useEffect, useReducer, useRef, useState } from "react";
import useQuran from "../context/QuranContext";
import { verseProps } from "../types";

import { getTextColor } from "../components/Coloring/util";
import {
  CL_ACTIONS,
  clActions,
  clActionsProps,
  colorProps,
  coloredProps,
} from "../components/Coloring/consts";

import AddColorModal from "../components/Coloring/AddColorModal";
import DeleteColorModal from "../components/Coloring/DeleteColorModal";
import EditColorsModal from "../components/Coloring/EditColorsModal";

import LoadingSpinner from "../components/LoadingSpinner";

import { IColor, IVerseColor, dbFuncs } from "../util/db";
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
  }
}

function Coloring() {
  const { chapterNames } = useQuran();
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let savedColors: IColor[];

      savedColors = await dbFuncs.loadColors();

      let initialColors: coloredProps = {};

      savedColors.forEach((color) => {
        initialColors[color.id] = {
          colorID: color.id,
          colorDisplay: color.name,
          colorCode: color.code,
        };
      });

      dispatchClAction(clActions.setColorsList(initialColors));

      let savedVersesColor: IVerseColor[];

      savedVersesColor = await dbFuncs.loadVersesColor();

      let initialColoredVerses: coloredProps = {};

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

  const initialState: stateProps = {
    currentChapter: 1,
    chapterToken: "",
    colorsList: {},
    selectedColors: {},
    coloredVerses: {},
    currentVerse: null,
    currentColor: null,
  };

  const [state, dispatchClAction] = useReducer(reducer, initialState);

  const refChapter = useRef<HTMLDivElement | null>(null);

  function onClickChapter(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chapterID: number
  ) {
    dispatchClAction(clActions.setChapter(chapterID));
    dispatchClAction(clActions.setChapterToken(""));

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
    dispatchClAction(clActions.setChapterToken(event.target.value));
  }

  function onClickSelectColor(color: colorProps) {
    dispatchClAction(clActions.selectColor(color));
  }

  function onClickDeleteColor(color: colorProps) {
    dispatchClAction(clActions.setCurrentColor(color));
  }

  function deleteColor(colorID: string) {
    dispatchClAction(clActions.deleteColor(colorID));
    dbFuncs.deleteColor(colorID);

    for (const verseKey in state.coloredVerses) {
      if (state.coloredVerses[verseKey].colorID === colorID) {
        dbFuncs.deleteVerseColor(verseKey);
      }
    }
  }

  function addColor(color: colorProps) {
    dispatchClAction(clActions.addColor(color));
  }

  function setColorsList(colorsList: coloredProps) {
    dispatchClAction(clActions.setColorsList(colorsList));

    Object.keys(colorsList).forEach((colorID) => {
      dbFuncs.saveColor({
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

    dispatchClAction(clActions.setColoredVerses(newColoredVerses));
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
