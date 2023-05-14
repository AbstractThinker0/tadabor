import {
  Dispatch,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  memo,
  Fragment,
  useState,
} from "react";

import { toast } from "react-toastify";
import { dbFuncs } from "../../util/db";

import LoadingSpinner from "../LoadingSpinner";
import { IconCircleArrowDownFilled } from "@tabler/icons-react";

import { TextForm } from "../TextForm";

import { Tooltip } from "bootstrap";
import { useTranslation } from "react-i18next";

import useQuran from "../../context/QuranContext";

import {
  markedNotesType,
  notesDirectionType,
  notesType,
  verseProps,
} from "../../types";
import {
  DP_ACTIONS,
  SEARCH_METHOD,
  SEARCH_SCOPE,
  dpActions,
  dpActionsProps,
  qbActions,
  qbActionsProps,
  searchIndexProps,
  searchResult,
} from "./consts";

interface stateProps {
  loadingState: boolean;
  myNotes: notesType;
  editableNotes: markedNotesType;
  areaDirection: notesType;
}

function reducer(state: stateProps, action: dpActionsProps): stateProps {
  // ...
  switch (action.type) {
    case DP_ACTIONS.CHANGE_NOTE: {
      return {
        ...state,
        myNotes: {
          ...state.myNotes,
          [action.payload.name]: action.payload.value,
        },
      };
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
    case DP_ACTIONS.CHANGE_NOTE_DIRECTION: {
      return {
        ...state,
        areaDirection: {
          ...state.areaDirection,
          [action.payload.name]: action.payload.value,
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
  }
}

interface DisplayPanelProps {
  searchingChapters: string[];
  searchResult: searchResult[];
  searchError: boolean;
  selectedRootError: boolean;
  searchingString: string;
  selectChapter: number;
  searchingMethod: string;
  searchIndexes: searchIndexProps[];
  searchingScope: SEARCH_SCOPE;
  scrollKey: string;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const DisplayPanel = memo(
  ({
    searchingChapters,
    searchResult,
    searchError,
    selectedRootError,
    searchingString,
    selectChapter,
    searchingMethod,
    searchIndexes,
    searchingScope,
    scrollKey,
    dispatchQbAction,
  }: DisplayPanelProps) => {
    // memorize the Div element of the results list to use it later on to reset scrolling when a new search is submitted
    const refListVerses = useRef<HTMLDivElement>(null);

    const initialState: stateProps = {
      loadingState: true,
      myNotes: {},
      editableNotes: {},
      areaDirection: {},
    };

    const [state, dispatchDpAction] = useReducer(reducer, initialState);

    useEffect(() => {
      let clientLeft = false;

      fetchData();

      async function fetchData() {
        const userNotes = await dbFuncs.loadNotes();

        if (clientLeft) return;

        const markedNotes: markedNotesType = {};
        const extractNotes: notesType = {};
        userNotes.forEach((note) => {
          extractNotes[note.id] = note.text;
          markedNotes[note.id] = false;
        });

        const userNotesDir = await dbFuncs.loadNotesDir();

        if (clientLeft) return;

        const extractNotesDir: notesDirectionType = {};

        userNotesDir.forEach((note) => {
          extractNotesDir[note.id] = note.dir;
        });

        dispatchDpAction(
          dpActions.dataLoaded({
            extractNotes,
            markedNotes,
            extractNotesDir,
          })
        );
      }

      return () => {
        clientLeft = true;
      };
    }, []);

    // Reset scroll whenever we submit a new search or switch from one chapter to another
    useEffect(() => {
      if (refListVerses.current) {
        refListVerses.current.scrollTop = 0;
      }
    }, [searchResult]);

    if (state.loadingState)
      return (
        <div className="col h-75">
          <div className="h-100">
            <LoadingSpinner />
          </div>
        </div>
      );

    return (
      <div className="browser-display" ref={refListVerses}>
        <div className="card browser-display-card" dir="rtl">
          {searchResult.length || searchError || selectedRootError ? (
            <ListSearchResults
              versesArray={searchResult}
              selectChapter={selectChapter}
              searchToken={searchingString.trim()}
              searchingScope={searchingScope}
              searchError={searchError}
              selectedRootError={selectedRootError}
              searchMethod={searchingMethod}
              searchingChapters={searchingChapters}
              searchIndexes={searchIndexes}
              editableNotes={state.editableNotes}
              myNotes={state.myNotes}
              areaDirection={state.areaDirection}
              dispatchDpAction={dispatchDpAction}
              dispatchQbAction={dispatchQbAction}
            />
          ) : (
            <ListVerses
              selectChapter={selectChapter}
              scrollKey={scrollKey}
              myNotes={state.myNotes}
              editableNotes={state.editableNotes}
              areaDirection={state.areaDirection}
              dispatchDpAction={dispatchDpAction}
              dispatchQbAction={dispatchQbAction}
            />
          )}
        </div>
      </div>
    );
  }
);

DisplayPanel.displayName = "DisplayPanel";

interface ListSearchResultsProps {
  versesArray: searchResult[];
  selectChapter: number;
  searchToken: string;
  searchingScope: SEARCH_SCOPE;
  searchError: boolean;
  selectedRootError: boolean;
  searchMethod: string;
  searchingChapters: string[];
  searchIndexes: searchIndexProps[];
  editableNotes: markedNotesType;
  myNotes: notesType;
  areaDirection: notesType;
  dispatchDpAction: Dispatch<dpActionsProps>;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const ListSearchResults = ({
  versesArray,
  selectChapter,
  searchToken,
  searchError,
  selectedRootError,
  searchMethod,
  myNotes,
  editableNotes,
  searchingChapters,
  searchIndexes,
  areaDirection,
  searchingScope,
  dispatchDpAction,
  dispatchQbAction,
}: ListSearchResultsProps) => {
  const { chapterNames } = useQuran();
  const [selectedVerse, setSelectedVerse] = useState("");

  const refListVerses = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedVerse("");
  }, [searchIndexes]);

  function handleRootClick(verse_key: string) {
    const verseToHighlight = refListVerses.current?.querySelector(
      `[data-id="${verse_key}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });

    setSelectedVerse(verse_key);
  }

  const memoHandleRootClick = useCallback(handleRootClick, []);

  const isRootSearch = searchMethod === SEARCH_METHOD.ROOT ? true : false;

  const chapterName = chapterNames[selectChapter - 1].name;

  return (
    <>
      <SearchTitle
        searchMethod={searchMethod}
        searchToken={searchToken}
        searchingScope={searchingScope}
        searchChapters={searchingChapters}
        chapterName={chapterName}
      />
      {isRootSearch && (
        <DerivationsComponent
          handleRootClick={memoHandleRootClick}
          searchIndexes={searchIndexes}
        />
      )}
      <div className="card-body" ref={refListVerses}>
        {versesArray.map((verse) => (
          <div
            key={verse.key}
            data-id={verse.key}
            className={`border-bottom pt-1 pb-1 ${
              verse.key === selectedVerse ? "verse-selected" : ""
            }`}
          >
            <SearchVerseComponent
              verse={verse}
              searchingScope={searchingScope}
              verseChapter={chapterNames[Number(verse.suraid) - 1].name}
              value={myNotes[verse.key] || ""}
              isEditable={editableNotes[verse.key]}
              noteDirection={areaDirection[verse.key] || ""}
              dispatchDpAction={dispatchDpAction}
              dispatchQbAction={dispatchQbAction}
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
};
ListSearchResults.displayName = "ListSearchResults";

interface SearchTitleProps {
  searchMethod: string;
  searchToken: string;
  searchingScope: SEARCH_SCOPE;
  searchChapters: string[];
  chapterName: string;
}

const SearchTitle = memo(
  ({
    searchMethod,
    searchToken,
    searchingScope,
    searchChapters,
    chapterName,
  }: SearchTitleProps) => {
    const searchType = searchMethod === SEARCH_METHOD.ROOT ? "جذر" : "كلمة";
    return (
      <h3 className="mb-2 text-info p-1">
        نتائج البحث عن {searchType} "{searchToken}"
        {searchingScope === SEARCH_SCOPE.ALL_CHAPTERS
          ? " في كل السور"
          : searchingScope === SEARCH_SCOPE.MULTIPLE_CHAPTERS
          ? " في سور " + searchChapters.join(" و")
          : " في سورة " + chapterName}
      </h3>
    );
  }
);

SearchTitle.displayName = "SearchTitle";

interface DerivationsComponentProps {
  handleRootClick: (verse_key: string) => void;
  searchIndexes: searchIndexProps[];
}

const DerivationsComponent = memo(
  ({ searchIndexes, handleRootClick }: DerivationsComponentProps) => {
    const refListRoots = useRef<HTMLSpanElement>(null);
    useEffect(() => {
      if (!refListRoots.current) return;

      //init tooltip
      Array.from(
        refListRoots.current.querySelectorAll('[data-bs-toggle="tooltip"]')
      ).forEach((tooltipNode) => new Tooltip(tooltipNode));
    }, [searchIndexes]);

    return (
      <>
        <hr />
        <span ref={refListRoots} className="p-2">
          {searchIndexes.map((root: searchIndexProps, index: number) => (
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

interface SearchVerseComponentProps {
  verse: searchResult;
  searchingScope: SEARCH_SCOPE;
  verseChapter: string;
  value: string;
  isEditable: boolean;
  noteDirection: string;
  dispatchDpAction: Dispatch<dpActionsProps>;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const SearchVerseComponent = memo(
  ({
    verse,
    searchingScope,
    verseChapter,
    value,
    isEditable,
    noteDirection,
    dispatchDpAction,
    dispatchQbAction,
  }: SearchVerseComponentProps) => {
    return (
      <>
        <VerseContentComponent
          verse={verse}
          searchingScope={searchingScope}
          verseChapter={verseChapter}
          dispatchQbAction={dispatchQbAction}
        />
        <InputTextForm
          verseKey={verse.key}
          verseNote={value}
          noteEditable={isEditable}
          noteDirection={noteDirection}
          dispatchDpAction={dispatchDpAction}
        />
      </>
    );
  }
);

SearchVerseComponent.displayName = "SearchVerseComponent";

interface SearchErrorsComponentProps {
  searchError: boolean;
  selectedRootError: boolean;
}

const SearchErrorsComponent = ({
  searchError,
  selectedRootError,
}: SearchErrorsComponentProps) => {
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

interface VerseContentComponentProps {
  verse: searchResult;
  searchingScope: SEARCH_SCOPE;
  verseChapter: string;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const VerseContentComponent = memo(
  ({
    verse,
    searchingScope,
    verseChapter,
    dispatchQbAction,
  }: VerseContentComponentProps) => {
    const verse_key = verse.key;
    const isLinkable =
      searchingScope === SEARCH_SCOPE.ALL_CHAPTERS ||
      searchingScope === SEARCH_SCOPE.MULTIPLE_CHAPTERS;

    function gotoChapter(chapter: string) {
      dispatchQbAction(qbActions.gotoChapter(chapter));
    }

    const handleVerseClick = (verse_key: string) => {
      gotoChapter(verse.suraid);
      dispatchQbAction(qbActions.setScrollKey(verse_key));
    };

    return (
      <span className="fs-4">
        <HighlightedText verse={verse} /> (
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
          <IconCircleArrowDownFilled />
        </button>
      </span>
    );
  }
);

VerseContentComponent.displayName = "VerseContentComponent";

interface HighlightedTextProps {
  verse: searchResult;
}

const HighlightedText = ({ verse }: HighlightedTextProps) => {
  const verseParts = verse.verseParts;

  return (
    <>
      {verseParts.map((part, i) => {
        const isHighlighted = part.highlight;

        return (
          <Fragment key={i}>
            {isHighlighted ? <mark>{part.text}</mark> : part.text}
          </Fragment>
        );
      })}
    </>
  );
};

interface ListTitleProps {
  chapterName: string;
}

const ListTitle = memo(({ chapterName }: ListTitleProps) => {
  return (
    <div className="card-header">
      <h3 className="text-primary text-center">سورة {chapterName}</h3>
    </div>
  );
});

ListTitle.displayName = "ListTitle";

interface ListVersesProps {
  selectChapter: number;
  scrollKey: string;
  myNotes: notesType;
  editableNotes: markedNotesType;
  areaDirection: notesType;
  dispatchDpAction: Dispatch<dpActionsProps>;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const ListVerses = ({
  selectChapter,
  myNotes,
  editableNotes,
  scrollKey,
  areaDirection,
  dispatchDpAction,
  dispatchQbAction,
}: ListVersesProps) => {
  const { chapterNames, allQuranText } = useQuran();

  const chapterName = chapterNames[selectChapter - 1].name;
  const versesArray = allQuranText[selectChapter - 1].verses;

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const verseToHighlight = scrollKey
      ? listRef.current?.querySelector(`[data-id="${scrollKey}"]`)
      : "";

    if (verseToHighlight) {
      setTimeout(() => {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, [scrollKey]);

  return (
    <>
      <ListTitle chapterName={chapterName} />
      <div className="card-body" ref={listRef}>
        {versesArray.map((verse: verseProps) => (
          <div
            key={verse.key}
            data-id={verse.key}
            className={`border-bottom pt-1 pb-1 ${
              scrollKey === verse.key ? "verse-selected" : ""
            }`}
          >
            <VerseComponent
              verse={verse}
              value={myNotes[verse.key] || ""}
              isEditable={editableNotes[verse.key]}
              noteDirection={areaDirection[verse.key] || ""}
              dispatchDpAction={dispatchDpAction}
              dispatchQbAction={dispatchQbAction}
            />
          </div>
        ))}
      </div>
    </>
  );
};

ListVerses.displayName = "ListVerses";

interface VerseComponentProps {
  verse: verseProps;
  value: string;
  isEditable: boolean;
  noteDirection: string;
  dispatchDpAction: Dispatch<dpActionsProps>;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const VerseComponent = memo(
  ({
    verse,
    value,
    isEditable,
    noteDirection,
    dispatchQbAction,
    dispatchDpAction,
  }: VerseComponentProps) => {
    return (
      <>
        <VerseTextComponent verse={verse} dispatchQbAction={dispatchQbAction} />
        <InputTextForm
          verseKey={verse.key}
          verseNote={value}
          noteEditable={isEditable}
          noteDirection={noteDirection}
          dispatchDpAction={dispatchDpAction}
        />
      </>
    );
  }
);

VerseComponent.displayName = "VerseComponent";

interface VerseTextComponentProps {
  verse: verseProps;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const VerseTextComponent = memo(
  ({ verse, dispatchQbAction }: VerseTextComponentProps) => {
    function onClickVerse() {
      dispatchQbAction(qbActions.setScrollKey(verse.key));
    }
    return (
      <span className="fs-4">
        {verse.versetext}{" "}
        <span className="btn-verse" onClick={onClickVerse}>
          {"(" + verse.verseid + ")"}
        </span>
        <button
          className="btn"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={"#collapseExample" + verse.key}
          aria-expanded="false"
          aria-controls={"collapseExample" + verse.key}
        >
          <IconCircleArrowDownFilled />
        </button>
      </span>
    );
  }
);

VerseTextComponent.displayName = "VerseTextComponent";

interface InputTextFormProps {
  verseKey: string;
  verseNote: string;
  noteEditable: boolean;
  noteDirection: string;
  dispatchDpAction: Dispatch<dpActionsProps>;
}

const InputTextForm = memo(
  ({
    verseKey,
    verseNote,
    noteEditable,
    noteDirection,
    dispatchDpAction,
  }: InputTextFormProps) => {
    const { t } = useTranslation();

    const handleNoteChange = useCallback(
      (name: string, value: string) => {
        dispatchDpAction(dpActions.setNote({ name, value }));
      },
      [dispatchDpAction]
    );

    const handleInputSubmit = useCallback(
      (key: string, value: string) => {
        dbFuncs
          .saveNote({
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

        dispatchDpAction(
          dpActions.setNoteEditable({ name: key, value: false })
        );
      },
      [dispatchDpAction, t]
    );

    const handleSetDirection = useCallback(
      (verse_key: string, dir: string) => {
        dispatchDpAction(
          dpActions.setNoteDir({
            name: verse_key,
            value: dir,
          })
        );

        dbFuncs.saveNoteDir({ id: verse_key, dir: dir });
      },
      [dispatchDpAction]
    );

    const handleEditClick = useCallback(
      (inputKey: string) => {
        dispatchDpAction(
          dpActions.setNoteEditable({
            name: inputKey,
            value: true,
          })
        );
      },
      [dispatchDpAction]
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
      />
    );
  }
);

InputTextForm.displayName = "InputTextForm";

export default DisplayPanel;
