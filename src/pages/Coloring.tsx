import { Reducer, useEffect, useReducer, useRef, useState } from "react";
import useQuran from "../context/QuranContext";
import { verseProps } from "../types";
import { getTextColor } from "../components/Coloring/util";
import VerseModal from "../components/Coloring/VerseModal";
import AddColorModal from "../components/Coloring/AddColorModal";
import { colorProps, coloredProps } from "../components/Coloring/consts";
import SelectedVerses from "../components/Coloring/SelectedVerses";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  IColor,
  IVerseColor,
  dbDeleteColor,
  dbDeleteVerseColor,
  dbLoadColors,
  dbLoadVersesColor,
  dbSaveColor,
  dbSaveVerseColor,
} from "../util/db";
import DeleteColorModal from "../components/Coloring/DeleteColorModal";

interface stateProps {
  currentChapter: number;
  chapterToken: string;
  colorsList: colorProps[];
  selectedColors: coloredProps;
  coloredVerses: coloredProps;
  currentVerse: verseProps | null;
  currentColor: colorProps | null;
}

enum CL_ACTIONS {
  SET_CHAPTER = "dispatchSetChapter",
  SET_CHAPTER_TOKEN = "dispatchSetChapterToken",
  SET_COLORS_LIST = "dispatchSetColorsList",
  ADD_COLOR = "dispatchAddColor",
  SELECT_COLOR = "dispatchSelectColor",
  DESELECT_COLOR = "dispatchDeselectColor",
  DELETE_COLOR = "dispatchDeleteColor",
  SET_VERSE_COLOR = "dispatchSetVerseColor",
  SET_COLORED_VERSES = "dispatchSetColoredVerses",
  SET_CURRENT_VERSE = "dispatchSetCurrentVerse",
  SET_CURRENT_COLOR = "dispatchSetCurrentColor",
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
        colorsList: [...state.colorsList, { ...newColor }],
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
      let colorsList = state.colorsList.filter(
        (color) => color.colorID !== action.payload
      );

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
        colorsList: colorsList,
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
  const { chapterNames, allQuranText } = useQuran();
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let savedColors: IColor[];

      savedColors = await dbLoadColors();

      let initialColors: colorProps[] = [];

      savedColors.forEach((color) => {
        initialColors.push({
          colorID: color.id,
          colorDisplay: color.name,
          colorCode: color.code,
        });
      });

      dispatchClAction(CL_ACTIONS.SET_COLORS_LIST, initialColors);

      let savedVersesColor: IVerseColor[];

      savedVersesColor = await dbLoadVersesColor();

      let initialColoredVerses: coloredProps = {};

      savedVersesColor.forEach((verseColor) => {
        initialColoredVerses[verseColor.verse_key] = {
          colorID: verseColor.id,
          colorDisplay: verseColor.name,
          colorCode: verseColor.code,
        };
      });

      dispatchClAction(CL_ACTIONS.SET_COLORED_VERSES, initialColoredVerses);

      setLoadingState(false);
    }
    if (localStorage.getItem("defaultColorsInitiated") === null) {
      const initialColors: colorProps[] = [
        { colorID: "0", colorCode: "#00ff00", colorDisplay: "Studied" },
        { colorID: "1", colorCode: "#ffff00", colorDisplay: "In progress" },
        { colorID: "2", colorCode: "#ff0000", colorDisplay: "Unexplored" },
      ];

      dispatchClAction(CL_ACTIONS.SET_COLORS_LIST, initialColors);
      initialColors.forEach((color) => {
        dbSaveColor({
          id: color.colorID,
          name: color.colorDisplay,
          code: color.colorCode,
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
    colorsList: [],
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

  function onClickDeleteSelected(colorID: string) {
    dispatchClAction(CL_ACTIONS.DESELECT_COLOR, colorID);
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

  /*
  function onClickEditColor(colorID: string) {
    dispatchClAction(CL_ACTIONS.DELETE_COLOR, colorID);
  }
  */

  function onClickVerseColor(verse: verseProps) {
    setCurrentVerse(verse);
  }

  function setCurrentVerse(verse: verseProps | null) {
    dispatchClAction(CL_ACTIONS.SET_CURRENT_VERSE, verse);
  }

  function addColor(color: colorProps) {
    dispatchClAction(CL_ACTIONS.ADD_COLOR, color);
  }

  function setVerseColor(verseKey: string, color: colorProps | null) {
    if (color === null) {
      dbDeleteVerseColor(verseKey);
    } else {
      dbSaveVerseColor({
        verse_key: verseKey,
        id: color.colorID,
        name: color.colorDisplay,
        code: color.colorCode,
      });
    }

    dispatchClAction(CL_ACTIONS.SET_VERSE_COLOR, {
      verseKey: verseKey,
      color: color,
    });
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
          {state.colorsList.length > 0
            ? state.colorsList.map((color) => (
                <div
                  key={color.colorID}
                  className="chapters-side-colors-item text-center rounded mb-1"
                  style={{
                    backgroundColor: color.colorCode,
                    color: getTextColor(color.colorCode),
                  }}
                >
                  <div
                    onClick={() => onClickSelectColor(color)}
                    className="opacity-0"
                  >
                    🗑
                  </div>
                  <div
                    className="flex-grow-1"
                    onClick={() => onClickSelectColor(color)}
                  >
                    {color.colorDisplay}
                  </div>
                  <div
                    data-bs-toggle="modal"
                    data-bs-target="#deleteColorModal"
                    onClick={() => onClickDeleteColor(color)}
                  >
                    🗑
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
                state.coloredVerses[verseKey].colorID ===
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
        </div>
        <AddColorModal addColor={addColor} />
      </div>
      <div className="verses-side">
        <div className="verses-side-colors" dir="ltr">
          {Object.keys(state.selectedColors).map((colorID) => (
            <div
              key={colorID}
              className="verses-side-colors-item text-center rounded"
              style={
                state.selectedColors[colorID]
                  ? {
                      backgroundColor: state.selectedColors[colorID].colorCode,
                      color: getTextColor(
                        state.selectedColors[colorID].colorCode
                      ),
                    }
                  : {}
              }
            >
              <div></div>
              <div>{state.selectedColors[colorID].colorDisplay}</div>
              <div
                className="verses-side-colors-item-close"
                onClick={(e) => onClickDeleteSelected(colorID)}
              >
                X
              </div>
            </div>
          ))}
        </div>
        <div className="card verse-list fs-4" dir="rtl">
          {Object.keys(state.selectedColors).length ? (
            <SelectedVerses
              selectedColors={state.selectedColors}
              coloredVerses={state.coloredVerses}
            />
          ) : (
            <>
              <div className="card-title">
                سورة {chapterNames[state.currentChapter - 1].name}
              </div>
              {allQuranText[state.currentChapter - 1].verses.map((verse) => (
                <div
                  className="verse-item"
                  key={verse.key}
                  style={
                    state.coloredVerses[verse.key]
                      ? {
                          backgroundColor:
                            state.coloredVerses[verse.key].colorCode,
                          color: getTextColor(
                            state.coloredVerses[verse.key].colorCode
                          ),
                        }
                      : {}
                  }
                >
                  {verse.versetext} ({verse.verseid}){" "}
                  <button
                    className="verse-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#verseModal"
                    onClick={(e) => onClickVerseColor(verse)}
                  >
                    🎨
                  </button>
                </div>
              ))}
            </>
          )}
          <VerseModal
            colorsList={state.colorsList}
            currentVerse={state.currentVerse}
            setVerseColor={setVerseColor}
            setCurrentVerse={setCurrentVerse}
            verseColor={
              state.currentVerse
                ? state.coloredVerses[state.currentVerse.key]
                  ? state.coloredVerses[state.currentVerse.key]
                  : null
                : null
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Coloring;
