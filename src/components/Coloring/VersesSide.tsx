import { useReducer, Reducer, useCallback, useEffect, memo } from "react";

import useQuran from "../../context/QuranContext";
import { toast } from "react-toastify";
import { verseProps } from "../../types";
import {
  dbDeleteVerseColor,
  dbSaveVerseColor,
  INote,
  INoteDir,
  loadData,
  saveData,
} from "../../util/db";
import VerseModal from "./VerseModal";
import { CL_ACTIONS, colorProps, coloredProps } from "./consts";
import { getTextColor } from "./util";
import { TextForm } from "../TextForm";
import { useTranslation } from "react-i18next";
import { IconCircleArrowDownFilled } from "@tabler/icons-react";

enum VS_ACTIONS {
  SET_LOADING_STATE = "dispatchSetLoadingState",
  SET_USER_NOTES = "dspatchSetUserNotes",
  CHANGE_NOTE = "dispatchChangeNote",
  SET_EDITABLE_NOTES = "dispatchSetEditableNotes",
  CHANGE_NOTE_EDITABLE = "dipsatchChangeNoteEditable",
  SET_AREA_DIRECTION = "dispatchSetAreaDirection",
  CHANGE_NOTE_DIRECTION = "dispatchChangeNoteDirection",
  SUBMIT_NOTE = "dispatchSubmitNote",
  DATA_LOADED = "dispatchDataLoaded",
}

interface reducerAction {
  type: VS_ACTIONS;
  payload: any;
}

interface notesType {
  [key: string]: string;
}

interface notesDirectionType {
  [key: string]: string;
}

interface markedNotesType {
  [key: string]: boolean;
}

interface stateProps {
  loadingState: boolean;
  myNotes: notesType;
  editableNotes: markedNotesType;
  areaDirection: notesDirectionType;
}

function reducer(state: stateProps, action: reducerAction): stateProps {
  // ...
  switch (action.type) {
    case VS_ACTIONS.SET_LOADING_STATE: {
      return { ...state, loadingState: action.payload };
    }
    case VS_ACTIONS.SET_USER_NOTES: {
      return { ...state, myNotes: action.payload };
    }
    case VS_ACTIONS.CHANGE_NOTE: {
      return {
        ...state,
        myNotes: {
          ...state.myNotes,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case VS_ACTIONS.SET_EDITABLE_NOTES: {
      return { ...state, editableNotes: action.payload };
    }
    case VS_ACTIONS.CHANGE_NOTE_EDITABLE: {
      return {
        ...state,
        editableNotes: {
          ...state.editableNotes,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case VS_ACTIONS.SET_AREA_DIRECTION: {
      return { ...state, areaDirection: action.payload };
    }
    case VS_ACTIONS.CHANGE_NOTE_DIRECTION: {
      return {
        ...state,
        areaDirection: {
          ...state.areaDirection,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case VS_ACTIONS.SUBMIT_NOTE: {
      return {
        ...state,
        editableNotes: {
          ...state.editableNotes,
          [action.payload.name]: false,
        },
      };
    }
    case VS_ACTIONS.DATA_LOADED: {
      return {
        ...state,
        myNotes: action.payload.extractNotes,
        editableNotes: action.payload.markedNotes,
        areaDirection: action.payload.extractNotesDir,
        loadingState: false,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

interface VersesSideProps {
  selectedColors: coloredProps;
  coloredVerses: coloredProps;
  currentChapter: number;
  colorsList: coloredProps;
  currentVerse: verseProps | null;
  dispatchClAction: (action: CL_ACTIONS, payload: any) => void;
}

function VersesSide({
  selectedColors,
  coloredVerses,
  currentChapter,
  colorsList,
  currentVerse,
  dispatchClAction,
}: VersesSideProps) {
  const { chapterNames, allQuranText } = useQuran();

  const initialState: stateProps = {
    loadingState: true,
    myNotes: {},
    editableNotes: {},
    areaDirection: {},
  };

  const [state, dispatch] = useReducer<Reducer<stateProps, reducerAction>>(
    reducer,
    initialState
  );

  const dispatchVsAction = useCallback(
    (type: VS_ACTIONS, payload: any) => dispatch({ type, payload }),
    []
  );

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userNotes: INote[] = await loadData("notes");

      if (clientLeft) return;

      let markedNotes: markedNotesType = {};
      let extractNotes: notesType = {};
      userNotes.forEach((note) => {
        extractNotes[note.id] = note.text;
        markedNotes[note.id] = false;
      });

      let userNotesDir: INoteDir[] = await loadData("notes_dir");

      if (clientLeft) return;

      let extractNotesDir: notesType = {};

      userNotesDir.forEach((note) => {
        extractNotesDir[note.id] = note.dir;
      });

      dispatchVsAction(VS_ACTIONS.DATA_LOADED, {
        extractNotes,
        markedNotes,
        extractNotesDir,
      });
    }

    return () => {
      clientLeft = true;
    };
  }, [dispatchVsAction]);

  function onClickDeleteSelected(colorID: string) {
    dispatchClAction(CL_ACTIONS.DESELECT_COLOR, colorID);
  }

  const onClickVerseColor = useCallback(
    (verse: verseProps) => {
      dispatchClAction(CL_ACTIONS.SET_CURRENT_VERSE, verse);
    },
    [dispatchClAction]
  );

  function setCurrentVerse(verse: verseProps | null) {
    dispatchClAction(CL_ACTIONS.SET_CURRENT_VERSE, verse);
  }

  function setVerseColor(verseKey: string, color: colorProps | null) {
    if (color === null) {
      dbDeleteVerseColor(verseKey);
    } else {
      dbSaveVerseColor({
        verse_key: verseKey,
        color_id: color.colorID,
      });
    }

    dispatchClAction(CL_ACTIONS.SET_VERSE_COLOR, {
      verseKey: verseKey,
      color: color,
    });
  }

  return (
    <div className="verses-side">
      <div className="verses-side-colors" dir="ltr">
        {Object.keys(selectedColors).map((colorID) => (
          <div
            key={colorID}
            className="verses-side-colors-item text-center rounded"
            style={
              selectedColors[colorID]
                ? {
                    backgroundColor: selectedColors[colorID].colorCode,
                    color: getTextColor(selectedColors[colorID].colorCode),
                  }
                : {}
            }
          >
            <div></div>
            <div>{selectedColors[colorID].colorDisplay}</div>
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
        {Object.keys(selectedColors).length ? (
          <SelectedVerses
            selectedColors={selectedColors}
            coloredVerses={coloredVerses}
            myNotes={state.myNotes}
            areaDirection={state.areaDirection}
            editableNotes={state.editableNotes}
            dispatchVsAction={dispatchVsAction}
          />
        ) : (
          <>
            <div className="card-title">
              سورة {chapterNames[currentChapter - 1].name}
            </div>
            {allQuranText[currentChapter - 1].verses.map((verse) => (
              <div
                className="verse-item"
                key={verse.key}
                style={
                  coloredVerses[verse.key]
                    ? {
                        backgroundColor: coloredVerses[verse.key].colorCode,
                        color: getTextColor(coloredVerses[verse.key].colorCode),
                      }
                    : {}
                }
              >
                <VerseComponent
                  color={
                    coloredVerses[verse.key] ? coloredVerses[verse.key] : null
                  }
                  verse={verse}
                  onClickVerseColor={onClickVerseColor}
                />
                <InputTextForm
                  verseKey={verse.key}
                  verseNote={state.myNotes[verse.key] || ""}
                  noteEditable={state.editableNotes[verse.key]}
                  noteDirection={state.areaDirection[verse.key] || ""}
                  dispatchVsAction={dispatchVsAction}
                />
              </div>
            ))}
          </>
        )}
        <VerseModal
          colorsList={colorsList}
          currentVerse={currentVerse}
          setVerseColor={setVerseColor}
          setCurrentVerse={setCurrentVerse}
          verseColor={
            currentVerse
              ? coloredVerses[currentVerse.key]
                ? coloredVerses[currentVerse.key]
                : null
              : null
          }
        />
      </div>
    </div>
  );
}

interface VerseComponentProps {
  color: colorProps | null;
  verse: verseProps;
  onClickVerseColor: (verse: verseProps) => void;
}

const VerseComponent = memo(
  ({ verse, onClickVerseColor, color }: VerseComponentProps) => {
    return (
      <div>
        {verse.versetext} ({verse.verseid}){" "}
        <button
          className="verse-btn"
          data-bs-toggle="modal"
          data-bs-target="#verseModal"
          onClick={(e) => onClickVerseColor(verse)}
        >
          🎨
        </button>
        <button
          className="btn"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={"#collapseExample" + verse.key}
          aria-expanded="false"
          aria-controls={"collapseExample" + verse.key}
          style={
            color
              ? {
                  backgroundColor: color.colorCode,
                  color: getTextColor(color.colorCode),
                }
              : {}
          }
        >
          <IconCircleArrowDownFilled />
        </button>
      </div>
    );
  }
);

interface SelectedVersesProps {
  coloredVerses: coloredProps;
  selectedColors: coloredProps;
  myNotes: notesType;
  editableNotes: markedNotesType;
  areaDirection: notesDirectionType;
  dispatchVsAction: (type: VS_ACTIONS, payload: any) => void;
}

function SelectedVerses({
  coloredVerses,
  selectedColors,
  myNotes,
  editableNotes,
  areaDirection,
  dispatchVsAction,
}: SelectedVersesProps) {
  const { allQuranText, chapterNames } = useQuran();

  function getVerseByKey(key: string) {
    let info = key.split("-");
    return allQuranText[Number(info[0]) - 1].verses[Number(info[1]) - 1];
  }

  let selectedVerses = Object.keys(coloredVerses).filter((verseKey) =>
    Object.keys(selectedColors).includes(coloredVerses[verseKey].colorID)
  );

  return (
    <div>
      {selectedVerses.length ? (
        selectedVerses
          .sort((keyA, KeyB) => {
            let infoA = keyA.split("-");
            let infoB = KeyB.split("-");
            if (Number(infoA[0]) !== Number(infoB[0]))
              return Number(infoA[0]) - Number(infoB[0]);
            else return Number(infoA[1]) - Number(infoB[1]);
          })
          .map((verseKey) => {
            let verse = getVerseByKey(verseKey);
            return (
              <div
                className="verse-item"
                key={verseKey}
                style={{
                  backgroundColor: coloredVerses[verseKey].colorCode,
                  color: getTextColor(coloredVerses[verseKey].colorCode),
                }}
              >
                <div>
                  {verse.versetext} (
                  {chapterNames[Number(verse.suraid) - 1].name +
                    ":" +
                    verse.verseid}
                  )
                  <button
                    className="btn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={"#collapseExample" + verse.key}
                    aria-expanded="false"
                    aria-controls={"collapseExample" + verse.key}
                    style={{
                      backgroundColor: coloredVerses[verseKey].colorCode,
                      color: getTextColor(coloredVerses[verseKey].colorCode),
                    }}
                  >
                    <IconCircleArrowDownFilled />
                  </button>
                </div>
                <InputTextForm
                  verseKey={verse.key}
                  verseNote={myNotes[verse.key] || ""}
                  noteEditable={editableNotes[verse.key]}
                  noteDirection={areaDirection[verse.key] || ""}
                  dispatchVsAction={dispatchVsAction}
                />
              </div>
            );
          })
      ) : (
        <p className="text-center">
          There are no verses matching the selected colors
        </p>
      )}
    </div>
  );
}

interface InputTextFormProps {
  verseKey: string;
  verseNote: string;
  noteEditable: boolean;
  noteDirection: string;
  dispatchVsAction: (type: VS_ACTIONS, payload: any) => void;
}

const InputTextForm = memo(
  ({
    verseKey,
    verseNote,
    noteEditable,
    noteDirection,
    dispatchVsAction,
  }: InputTextFormProps) => {
    const { t } = useTranslation();

    const handleNoteChange = useCallback(
      (name: string, value: string) => {
        dispatchVsAction(VS_ACTIONS.CHANGE_NOTE, { name, value });
      },
      [dispatchVsAction]
    );

    const handleInputSubmit = useCallback(
      (key: string, value: string) => {
        saveData("notes", {
          id: key,
          text: value,
          date_created: Date.now(),
          date_modified: Date.now(),
        })
          .then(function () {
            toast.success(t("save_success") as string);
          })
          .catch(function () {
            toast.success(t("save_failed") as string);
          });

        dispatchVsAction(VS_ACTIONS.SUBMIT_NOTE, { name: key });
      },
      [dispatchVsAction, t]
    );

    const handleSetDirection = useCallback(
      (verse_key: string, dir: string) => {
        dispatchVsAction(VS_ACTIONS.CHANGE_NOTE_DIRECTION, {
          name: verse_key,
          value: dir,
        });

        saveData("notes_dir", { id: verse_key, dir: dir });
      },
      [dispatchVsAction]
    );

    const handleEditClick = useCallback(
      (inputKey: string) => {
        dispatchVsAction(VS_ACTIONS.CHANGE_NOTE_EDITABLE, {
          name: inputKey,
          value: true,
        });
      },
      [dispatchVsAction]
    );

    return (
      <TextForm
        inputKey={verseKey}
        inputValue={verseNote}
        isEditable={noteEditable}
        inputDirection={noteDirection}
        handleInputChange={handleNoteChange}
        handleEditClick={handleEditClick}
        handleSetDirection={handleSetDirection}
        handleInputSubmit={handleInputSubmit}
        className="verse-item-note"
      />
    );
  }
);

InputTextForm.displayName = "InputTextForm";

export default VersesSide;
