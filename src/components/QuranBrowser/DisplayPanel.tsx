import {
  useReducer,
  Reducer,
  useEffect,
  useRef,
  useCallback,
  memo,
  Fragment,
  createContext,
  useContext,
} from "react";

import { toast } from "react-toastify";
import { INote, INoteDir, loadData, saveData } from "../../util/db";

import LoadingSpinner from "../LoadingSpinner";
import { ArrowDownCircleFill } from "react-bootstrap-icons";

import { TextForm } from "../TextForm";

import * as bootstrap from "bootstrap";
import { useTranslation } from "react-i18next";

import useQuran, {
  verseProps,
  derivationProps,
} from "../../context/QuranContext";
import { QB_ACTIONS, useQuranBrowser } from "../../pages/QuranBrowser";

enum DP_ACTIONS {
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
  type: DP_ACTIONS;
  payload: any;
}

interface versesRefProp {
  [key: string]: HTMLDivElement;
}

interface notesType {
  [key: string]: string;
}

interface markedNotesType {
  [key: string]: boolean;
}

interface stateProps {
  loadingState: boolean;
  myNotes: notesType;
  editableNotes: markedNotesType;
  areaDirection: notesType;
}

function reducer(state: stateProps, action: reducerAction): stateProps {
  // ...
  switch (action.type) {
    case DP_ACTIONS.SET_LOADING_STATE: {
      return { ...state, loadingState: action.payload };
    }
    case DP_ACTIONS.SET_USER_NOTES: {
      return { ...state, myNotes: action.payload };
    }
    case DP_ACTIONS.CHANGE_NOTE: {
      return {
        ...state,
        myNotes: {
          ...state.myNotes,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case DP_ACTIONS.SET_EDITABLE_NOTES: {
      return { ...state, editableNotes: action.payload };
    }
    case DP_ACTIONS.CHANGE_NOTE_EDITABLE: {
      return {
        ...state,
        editableNotes: {
          ...state.editableNotes,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case DP_ACTIONS.SET_AREA_DIRECTION: {
      return { ...state, areaDirection: action.payload };
    }
    case DP_ACTIONS.CHANGE_NOTE_DIRECTION: {
      return {
        ...state,
        areaDirection: {
          ...state.areaDirection,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case DP_ACTIONS.SUBMIT_NOTE: {
      return {
        ...state,
        editableNotes: {
          ...state.editableNotes,
          [action.payload.name]: false,
        },
      };
    }
    case DP_ACTIONS.DATA_LOADED: {
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

interface DisplayPanelProps {
  searchingChapters: string[];
  scrollKey: string | null;
  searchResult: verseProps[];
  searchError: boolean;
  selectedRootError: boolean;
  searchingString: string;
  searchingAllQuran: boolean;
  selectChapter: number;
  radioSearchingMethod: string;
  searchMultipleChapters: boolean;
  rootDerivations: derivationProps[];
}

type DisplayPanelContent = {
  dispatchAction: (type: DP_ACTIONS, payload: any) => void;
};

const DisplayPanelContext = createContext<DisplayPanelContent>({
  dispatchAction: () => {},
});

const useDisplayPanel = () => useContext(DisplayPanelContext);

const DisplayPanel = memo(
  ({
    searchingChapters,
    scrollKey,
    searchResult,
    searchError,
    selectedRootError,
    searchingString,
    searchingAllQuran,
    selectChapter,
    radioSearchingMethod,
    searchMultipleChapters,
    rootDerivations,
  }: DisplayPanelProps) => {
    const refListVerses = useRef<HTMLDivElement>(null);

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

    const dispatchAction = useCallback(
      (type: DP_ACTIONS, payload: any) => dispatch({ type, payload }),
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

        dispatchAction(DP_ACTIONS.DATA_LOADED, {
          extractNotes,
          markedNotes,
          extractNotesDir,
        });
      }

      return () => {
        clientLeft = true;
      };
    }, [dispatchAction]);

    useEffect(() => {
      if (refListVerses.current) refListVerses.current.scrollTop = 0;
    }, [selectChapter, searchResult]);

    if (state.loadingState)
      return (
        <div className="col h-75">
          <div className="h-100">
            <LoadingSpinner />
          </div>
        </div>
      );

    return (
      <DisplayPanelContext.Provider value={{ dispatchAction }}>
        <div className="browser-display" ref={refListVerses}>
          <div className="card browser-display-card" dir="rtl">
            {searchResult.length || searchError || selectedRootError ? (
              <ListSearchResults
                versesArray={searchResult}
                selectChapter={selectChapter}
                searchToken={searchingString.trim()}
                scopeAllQuran={searchingAllQuran}
                searchError={searchError}
                selectedRootError={selectedRootError}
                radioSearchMethod={radioSearchingMethod}
                searchMultipleChapters={searchMultipleChapters}
                searchingChapters={searchingChapters}
                rootDerivations={rootDerivations}
                editableNotes={state.editableNotes}
                myNotes={state.myNotes}
                areaDirection={state.areaDirection}
              />
            ) : (
              <ListVerses
                selectChapter={selectChapter}
                scrollKey={scrollKey}
                myNotes={state.myNotes}
                editableNotes={state.editableNotes}
                areaDirection={state.areaDirection}
              />
            )}
          </div>
        </div>
      </DisplayPanelContext.Provider>
    );
  }
);

DisplayPanel.displayName = "DisplayPanel";

const SearchTitle = memo(
  ({
    radioSearchMethod,
    searchToken,
    scopeAllQuran,
    searchMultipleChapters,
    searchChapters,
    chapterName,
  }: any) => {
    let searchType = radioSearchMethod === "optionRootSearch" ? "جذر" : "كلمة";
    return (
      <h3 className="mb-2 text-info p-1">
        نتائج البحث عن {searchType} "{searchToken}"
        {scopeAllQuran === true
          ? " في كل السور"
          : searchMultipleChapters
          ? " في سور " + searchChapters.join(" و")
          : " في سورة " + chapterName}
      </h3>
    );
  }
);

SearchTitle.displayName = "SearchTitle";

const ListSearchResults = memo(
  ({
    versesArray,
    selectChapter,
    searchToken,
    scopeAllQuran,
    searchError,
    selectedRootError,
    radioSearchMethod,
    myNotes,
    editableNotes,
    searchMultipleChapters,
    searchingChapters,
    rootDerivations,
    areaDirection,
  }: any) => {
    const { chapterNames } = useQuran();
    const { dispatchAction } = useDisplayPanel();

    const chapterName = chapterNames[selectChapter - 1].name;

    interface refVersesResultType {
      [key: string]: HTMLDivElement;
    }

    const refVersesResult = useRef<refVersesResultType>({});

    const memoHandleRootClick = useCallback(handleRootClick, []);

    function handleRootClick(verse_key: string) {
      refVersesResult.current[verse_key].scrollIntoView();
    }

    const isRootSearch =
      radioSearchMethod === "optionRootSearch" ? true : false;

    return (
      <>
        <SearchTitle
          radioSearchMethod={radioSearchMethod}
          searchToken={searchToken}
          scopeAllQuran={scopeAllQuran}
          searchMultipleChapters={searchMultipleChapters}
          searchChapters={searchingChapters}
          chapterName={chapterName}
        />
        {isRootSearch && (
          <DerivationsComponent
            handleRootClick={memoHandleRootClick}
            rootDerivations={rootDerivations}
          />
        )}
        <div className="card-body">
          {versesArray.map((verse: verseProps) => (
            <div
              key={verse.key}
              ref={(el) => {
                if (el !== null) refVersesResult.current[verse.key] = el;
              }}
              className="border-bottom pt-1 pb-1"
            >
              <SearchVerseComponent
                verse={verse}
                scopeAllQuran={scopeAllQuran}
                searchMultipleChapters={searchMultipleChapters}
                verseChapter={chapterNames[Number(verse.suraid) - 1].name}
                value={myNotes[verse.key] || ""}
                isEditable={editableNotes[verse.key]}
                noteDirection={areaDirection[verse.key] || ""}
                isRootSearch={isRootSearch}
                rootDerivations={rootDerivations}
                dispatchAction={dispatchAction}
              />
            </div>
          ))}
          {(searchError || selectedRootError) && (
            <SearchErrorsComponent
              searchError={searchError}
              selectedRootError={selectedRootError}
            />
          )}
        </div>
      </>
    );
  }
);

ListSearchResults.displayName = "ListSearchResults";

const SearchVerseComponent = memo(
  ({
    verse,
    scopeAllQuran,
    searchMultipleChapters,
    verseChapter,
    value,
    isEditable,
    noteDirection,
    isRootSearch,
    rootDerivations,
    dispatchAction,
  }: any) => {
    rootDerivations = (rootDerivations as []).filter(
      (value: any) => value.key === verse.key
    );

    return (
      <>
        <VerseContentComponent
          verse={verse}
          scopeAllQuran={scopeAllQuran}
          searchMultipleChapters={searchMultipleChapters}
          verseChapter={verseChapter}
          isRootSearch={isRootSearch}
          rootDerivations={rootDerivations}
        />
        <InputTextForm
          verseKey={verse.key}
          verseNote={value}
          noteEditable={isEditable}
          noteDirection={noteDirection}
          dispatchAction={dispatchAction}
        />
      </>
    );
  }
);

SearchVerseComponent.displayName = "SearchVerseComponent";

const DerivationsComponent = memo(
  ({ rootDerivations, handleRootClick }: any) => {
    useEffect(() => {
      //init tooltip
      Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      ).forEach((tooltipNode) => new bootstrap.Tooltip(tooltipNode));
    }, [rootDerivations]);

    return (
      <>
        <hr />
        <span className="p-2">
          {rootDerivations.map((root: derivationProps, index: number) => (
            <span
              role="button"
              key={index}
              onClick={(e) => handleRootClick(root.key)}
              data-bs-toggle="tooltip"
              data-bs-title={root.text}
            >
              {index ? " -" : " "} {root.name}
            </span>
          ))}
        </span>
        <hr />
      </>
    );
  }
);

DerivationsComponent.displayName = "DerivationsComponent";

const SearchErrorsComponent = ({ searchError, selectedRootError }: any) => {
  const { t } = useTranslation();
  return (
    <>
      {searchError && <p className="mt-3 text-danger">{t("search_fail")}</p>}
      {selectedRootError && (
        <p className="mt-3 text-danger">{t("search_root_error")}</p>
      )}
    </>
  );
};

const VerseContentComponent = memo(
  ({
    verse,
    scopeAllQuran,
    searchMultipleChapters,
    verseChapter,
    isRootSearch,
    rootDerivations,
  }: any) => {
    const { dispatchAction } = useQuranBrowser();

    let verse_key = verse.key;
    let isLinkable = scopeAllQuran || searchMultipleChapters;

    function gotoChapter(chapter: string) {
      dispatchAction(QB_ACTIONS.GOTO_CHAPTER, chapter);
    }

    const handleVerseClick = (verse_key: string) => {
      dispatchAction(QB_ACTIONS.SET_SCROLL_KEY, verse_key);
      gotoChapter(verse.suraid);
    };

    return (
      <span className="fs-4">
        <Highlighted
          text={verse.versetext}
          rootDerivations={rootDerivations}
          isRootSearch={isRootSearch}
        />
        (
        {isLinkable ? (
          <button
            className="p-0 border-0 bg-transparent"
            onClick={(e) => handleVerseClick(verse_key)}
          >
            {verseChapter + ":" + verse.verseid}
          </button>
        ) : (
          <button
            className="p-0 border-0 bg-transparent"
            onClick={(e) => handleVerseClick(verse_key)}
          >
            {verse.verseid}
          </button>
        )}
        )
        <button
          className="btn"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={"#collapseExample" + verse_key}
          aria-expanded="false"
          aria-controls={"collapseExample" + verse_key}
        >
          <ArrowDownCircleFill />
        </button>
      </span>
    );
  }
);

VerseContentComponent.displayName = "VerseContentComponent";

const Highlighted = ({ text = "", rootDerivations, isRootSearch }: any) => {
  if (!isRootSearch) {
    return <span>{text}</span>;
  }

  const parts = text.split(" ");

  function matchIndex(index: number) {
    for (const root of rootDerivations) {
      if (Number(root.wordIndex) === index + 1) {
        return true;
      }
    }
    return false;
  }

  return (
    <span>
      {parts.filter(String).map((part: string, i: number) => {
        return matchIndex(i) ? (
          <Fragment key={i}>
            <mark>{part}</mark>{" "}
          </Fragment>
        ) : (
          <span key={i}>{part} </span>
        );
      })}
    </span>
  );
};

const ListTitle = memo(({ chapterName }: any) => {
  return (
    <div className="card-header">
      <h3 className="text-primary text-center">سورة {chapterName}</h3>
    </div>
  );
});

ListTitle.displayName = "ListTitle";

const ListVerses = memo(
  ({
    selectChapter,
    myNotes,
    editableNotes,
    scrollKey,
    areaDirection,
  }: any) => {
    const { chapterNames, allQuranText } = useQuran();
    const { dispatchAction } = useDisplayPanel();

    const versesRef = useRef<versesRefProp>({});

    const chapterName = chapterNames[selectChapter - 1].name;
    const versesArray = allQuranText[selectChapter - 1].verses;

    useEffect(() => {
      if (scrollKey) {
        versesRef.current[scrollKey].scrollIntoView();
      }
    }, [scrollKey]);

    return (
      <>
        <ListTitle chapterName={chapterName} />
        <div className="card-body">
          {versesArray.map((verse: verseProps) => (
            <VerseComponent
              key={verse.key}
              versesRef={versesRef}
              verse={verse}
              value={myNotes[verse.key] || ""}
              isEditable={editableNotes[verse.key]}
              noteDirection={areaDirection[verse.key] || ""}
              dispatchAction={dispatchAction}
            />
          ))}
        </div>
      </>
    );
  }
);

ListVerses.displayName = "ListVerses";

const VerseComponent = memo(
  ({
    versesRef,
    verse,
    value,
    isEditable,
    noteDirection,
    dispatchAction,
  }: any) => {
    return (
      <div
        ref={(el) => (versesRef.current[verse.key] = el)}
        className="border-bottom pt-1 pb-1"
      >
        <VerseTextComponent verse={verse} />
        <InputTextForm
          verseKey={verse.key}
          verseNote={value}
          noteEditable={isEditable}
          noteDirection={noteDirection}
          dispatchAction={dispatchAction}
        />
      </div>
    );
  }
);

VerseComponent.displayName = "VerseComponent";

const VerseTextComponent = memo(({ verse }: any) => {
  return (
    <span className="fs-4">
      {verse.versetext} ({verse.verseid}){" "}
      <button
        className="btn"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target={"#collapseExample" + verse.key}
        aria-expanded="false"
        aria-controls={"collapseExample" + verse.key}
      >
        <ArrowDownCircleFill />
      </button>
    </span>
  );
});

VerseTextComponent.displayName = "VerseTextComponent";

const InputTextForm = memo(
  ({
    verseKey,
    verseNote,
    noteEditable,
    noteDirection,
    dispatchAction,
  }: any) => {
    const { t } = useTranslation();

    const handleNoteChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        dispatchAction(DP_ACTIONS.CHANGE_NOTE, { name, value });
      },
      [dispatchAction]
    );

    const onInputSubmit = useCallback(
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

        dispatchAction(DP_ACTIONS.SUBMIT_NOTE, { name: key });
      },
      [dispatchAction, t]
    );

    const handleSetDirection = useCallback(
      (verse_key: string, dir: string) => {
        dispatchAction(DP_ACTIONS.CHANGE_NOTE_DIRECTION, {
          name: verse_key,
          value: dir,
        });

        saveData("notes_dir", { id: verse_key, dir: dir });
      },
      [dispatchAction]
    );

    const handleEditClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        let inputKey = event.currentTarget.name;

        dispatchAction(DP_ACTIONS.CHANGE_NOTE_EDITABLE, {
          name: inputKey,
          value: true,
        });
      },
      [dispatchAction]
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
        onInputSubmit={onInputSubmit}
      />
    );
  }
);

InputTextForm.displayName = "InputTextForm";

export default DisplayPanel;
