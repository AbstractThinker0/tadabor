import {
  Dispatch,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  memo,
  Fragment,
  createContext,
  useContext,
  MutableRefObject,
  useState,
} from "react";

import { toast } from "react-toastify";
import { INote, INoteDir, dbFuncs } from "../../util/db";

import LoadingSpinner from "../LoadingSpinner";
import { IconCircleArrowDownFilled } from "@tabler/icons-react";

import { TextForm } from "../TextForm";

import * as bootstrap from "bootstrap";
import { useTranslation } from "react-i18next";

import useQuran from "../../context/QuranContext";

import { useQuranBrowser } from "../../pages/QuranBrowser";
import { verseProps } from "../../types";
import {
  DP_ACTIONS,
  SEARCH_METHOD,
  SEARCH_SCOPE,
  dpActions,
  dpActionsProps,
  markedNotesType,
  notesType,
  qbActions,
  searchIndexProps,
} from "./consts";

interface refVersesResultType {
  [key: string]: HTMLDivElement;
}

interface stateProps {
  loadingState: boolean;
  myNotes: notesType;
  editableNotes: markedNotesType;
  areaDirection: notesType;
  scrollKey: null | string;
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
    case DP_ACTIONS.SET_SCROLL_KEY: {
      return { ...state, scrollKey: action.payload };
    }
  }
}

interface DisplayPanelProps {
  searchingChapters: string[];
  searchResult: verseProps[];
  searchError: boolean;
  selectedRootError: boolean;
  searchingString: string;
  selectChapter: number;
  radioSearchingMethod: string;
  searchIndexes: searchIndexProps[];
  searchingScope: SEARCH_SCOPE;
}

const DisplayPanelContext = createContext({} as Dispatch<dpActionsProps>);

const useDisplayPanel = () => useContext(DisplayPanelContext);

const DisplayPanel = memo(
  ({
    searchingChapters,
    searchResult,
    searchError,
    selectedRootError,
    searchingString,
    selectChapter,
    radioSearchingMethod,
    searchIndexes,
    searchingScope,
  }: DisplayPanelProps) => {
    // memorize the Div element of the results list to use it later on to reset scrolling when a new search is submitted
    const refListVerses = useRef<HTMLDivElement>(null);

    const initialState: stateProps = {
      loadingState: true,
      myNotes: {},
      editableNotes: {},
      areaDirection: {},
      scrollKey: null,
    };

    const [state, dispatchDpAction] = useReducer(reducer, initialState);

    useEffect(() => {
      let clientLeft = false;

      fetchData();

      async function fetchData() {
        const userNotes: INote[] = await dbFuncs.loadNotes();

        if (clientLeft) return;

        const markedNotes: markedNotesType = {};
        const extractNotes: notesType = {};
        userNotes.forEach((note) => {
          extractNotes[note.id] = note.text;
          markedNotes[note.id] = false;
        });

        const userNotesDir: INoteDir[] = await dbFuncs.loadNotesDir();

        if (clientLeft) return;

        const extractNotesDir: notesType = {};

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

    const scrollRef = useRef(state.scrollKey);

    useEffect(() => {
      scrollRef.current = state.scrollKey;
    }, [state.scrollKey]);

    useEffect(() => {
      if (refListVerses.current && scrollRef.current === null)
        refListVerses.current.scrollTop = 0;
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
      <DisplayPanelContext.Provider value={dispatchDpAction}>
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
                radioSearchMethod={radioSearchingMethod}
                searchingChapters={searchingChapters}
                searchIndexes={searchIndexes}
                editableNotes={state.editableNotes}
                myNotes={state.myNotes}
                areaDirection={state.areaDirection}
              />
            ) : (
              <ListVerses
                selectChapter={selectChapter}
                scrollKey={state.scrollKey}
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

interface ListSearchResultsProps {
  versesArray: verseProps[];
  selectChapter: number;
  searchToken: string;
  searchingScope: SEARCH_SCOPE;
  searchError: boolean;
  selectedRootError: boolean;
  radioSearchMethod: string;
  searchingChapters: string[];
  searchIndexes: searchIndexProps[];
  editableNotes: markedNotesType;
  myNotes: notesType;
  areaDirection: notesType;
}

const ListSearchResults = ({
  versesArray,
  selectChapter,
  searchToken,
  searchError,
  selectedRootError,
  radioSearchMethod,
  myNotes,
  editableNotes,
  searchingChapters,
  searchIndexes,
  areaDirection,
  searchingScope,
}: ListSearchResultsProps) => {
  const { chapterNames } = useQuran();

  const refVersesResult = useRef<refVersesResultType>({});

  const refSelectedVerse = useRef<HTMLDivElement | null>(null);

  function handleRootClick(verse_key: string) {
    refVersesResult.current[verse_key].scrollIntoView({ behavior: "smooth" });

    if (refSelectedVerse.current) {
      refSelectedVerse.current.classList.remove("verse-selected");
    }

    refVersesResult.current[verse_key].classList.add("verse-selected");

    refSelectedVerse.current = refVersesResult.current[verse_key];
  }

  const memoHandleRootClick = useCallback(handleRootClick, []);

  const isRootSearch = radioSearchMethod === SEARCH_METHOD.ROOT ? true : false;

  const chapterName = chapterNames[selectChapter - 1].name;

  return (
    <>
      <SearchTitle
        radioSearchMethod={radioSearchMethod}
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
              searchingScope={searchingScope}
              verseChapter={chapterNames[Number(verse.suraid) - 1].name}
              value={myNotes[verse.key] || ""}
              isEditable={editableNotes[verse.key]}
              noteDirection={areaDirection[verse.key] || ""}
              isRootSearch={isRootSearch}
              searchIndexes={searchIndexes}
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
  radioSearchMethod: string;
  searchToken: string;
  searchingScope: SEARCH_SCOPE;
  searchChapters: string[];
  chapterName: string;
}

const SearchTitle = memo(
  ({
    radioSearchMethod,
    searchToken,
    searchingScope,
    searchChapters,
    chapterName,
  }: SearchTitleProps) => {
    const searchType =
      radioSearchMethod === SEARCH_METHOD.ROOT ? "جذر" : "كلمة";
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
    useEffect(() => {
      //init tooltip
      Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      ).forEach((tooltipNode) => new bootstrap.Tooltip(tooltipNode));
    }, [searchIndexes]);

    return (
      <>
        <hr />
        <span className="p-2">
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
  verse: verseProps;
  searchingScope: SEARCH_SCOPE;
  verseChapter: string;
  value: string;
  isEditable: boolean;
  noteDirection: string;
  isRootSearch: boolean;
  searchIndexes: searchIndexProps[];
}

const SearchVerseComponent = memo(
  ({
    verse,
    searchingScope,
    verseChapter,
    value,
    isEditable,
    noteDirection,
    isRootSearch,
    searchIndexes,
  }: SearchVerseComponentProps) => {
    const [verseSearchIndexes, setVerseSearchIndexes] = useState(
      searchIndexes.filter((value) => value.key === verse.key)
    );

    useEffect(() => {
      setVerseSearchIndexes(
        searchIndexes.filter((value) => value.key === verse.key)
      );
    }, [searchIndexes, verse.key]);

    return (
      <>
        <VerseContentComponent
          verse={verse}
          searchingScope={searchingScope}
          verseChapter={verseChapter}
          isRootSearch={isRootSearch}
          searchIndexes={verseSearchIndexes}
        />
        <InputTextForm
          verseKey={verse.key}
          verseNote={value}
          noteEditable={isEditable}
          noteDirection={noteDirection}
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
  verse: verseProps;
  searchingScope: SEARCH_SCOPE;
  verseChapter: string;
  isRootSearch: boolean;
  searchIndexes: searchIndexProps[];
}

const VerseContentComponent = memo(
  ({
    verse,
    searchingScope,
    verseChapter,
    isRootSearch,
    searchIndexes,
  }: VerseContentComponentProps) => {
    const dispatchDpAction = useDisplayPanel();
    const dispatchAction = useQuranBrowser();

    const verse_key = verse.key;
    const isLinkable =
      searchingScope === SEARCH_SCOPE.ALL_CHAPTERS ||
      searchingScope === SEARCH_SCOPE.MULTIPLE_CHAPTERS;

    function gotoChapter(chapter: string) {
      dispatchAction(qbActions.gotoChapter(chapter));
    }

    const handleVerseClick = (verse_key: string) => {
      dispatchDpAction(dpActions.setScrollKey(verse_key));
      gotoChapter(verse.suraid);
    };

    return (
      <span className="fs-4">
        <Highlighted
          text={verse.versetext}
          searchIndexes={searchIndexes}
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
          <IconCircleArrowDownFilled />
        </button>
      </span>
    );
  }
);

VerseContentComponent.displayName = "VerseContentComponent";

interface HighlightedProps {
  text: string;
  searchIndexes: searchIndexProps[];
  isRootSearch: boolean;
}

const Highlighted = ({
  text = "",
  searchIndexes,
  isRootSearch,
}: HighlightedProps) => {
  const parts = text.split(" ");

  function matchIndex(index: number) {
    for (const searchIndex of searchIndexes) {
      if (Number(searchIndex.wordIndex) === index) {
        return true;
      }
    }
    return false;
  }

  return (
    <span>
      {parts.filter(String).map((part: string, i: number) => {
        return matchIndex(isRootSearch ? i + 1 : i) ? (
          <Fragment key={i}>
            <mark>{part}</mark>{" "}
          </Fragment>
        ) : (
          // TODO: Concat all adjacent text and output it at once to avoid multiple text nodes.
          <Fragment key={i}>{part} </Fragment>
        );
      })}
    </span>
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
  scrollKey: string | null;
  myNotes: notesType;
  editableNotes: markedNotesType;
  areaDirection: notesType;
}

interface versesRefType {
  [key: string]: HTMLDivElement;
}

const ListVerses = ({
  selectChapter,
  myNotes,
  editableNotes,
  scrollKey,
  areaDirection,
}: ListVersesProps) => {
  const { chapterNames, allQuranText } = useQuran();
  const dispatchDpAction = useDisplayPanel();

  const chapterName = chapterNames[selectChapter - 1].name;
  const versesArray = allQuranText[selectChapter - 1].verses;

  const selectedVerse = useRef<Element | null>(null);

  const versesRef = useRef<versesRefType>({});

  useEffect(() => {
    const verseToHighlight = scrollKey ? versesRef.current[scrollKey] : null;
    if (verseToHighlight) {
      verseToHighlight.scrollIntoView({ block: "center" });
      verseToHighlight.classList.add("verse-selected");
      selectedVerse.current = verseToHighlight;
      dispatchDpAction(dpActions.setScrollKey(null));
    }
  }, [dispatchDpAction, scrollKey]);

  return (
    <>
      <ListTitle chapterName={chapterName} />
      <div className="card-body">
        {versesArray.map((verse: verseProps) => (
          <VerseComponent
            key={verse.key}
            verse={verse}
            value={myNotes[verse.key] || ""}
            isEditable={editableNotes[verse.key]}
            noteDirection={areaDirection[verse.key] || ""}
            selectedVerse={selectedVerse}
            versesRef={versesRef}
          />
        ))}
      </div>
    </>
  );
};

ListVerses.displayName = "ListVerses";

function hightlighVerse(verseElement: HTMLElement) {
  verseElement.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  verseElement.classList.add("verse-selected");
}

interface VerseComponentProps {
  key: string;
  verse: verseProps;
  value: string;
  isEditable: boolean;
  noteDirection: string;
  selectedVerse: MutableRefObject<Element | null>;
  versesRef: MutableRefObject<versesRefType>;
}

const VerseComponent = memo(
  ({
    verse,
    value,
    isEditable,
    noteDirection,
    selectedVerse,
    versesRef,
  }: VerseComponentProps) => {
    return (
      <div
        ref={(el) => {
          if (el !== null) versesRef.current[verse.key] = el;
        }}
        className="border-bottom pt-1 pb-1"
      >
        <VerseTextComponent verse={verse} selectedVerse={selectedVerse} />
        <InputTextForm
          verseKey={verse.key}
          verseNote={value}
          noteEditable={isEditable}
          noteDirection={noteDirection}
        />
      </div>
    );
  }
);

VerseComponent.displayName = "VerseComponent";

interface VerseTextComponentProps {
  verse: verseProps;
  selectedVerse: MutableRefObject<Element | null>;
}

const VerseTextComponent = memo(
  ({ verse, selectedVerse }: VerseTextComponentProps) => {
    function onClickVerse(
      event: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) {
      const verseElement = event.currentTarget.parentElement?.parentElement;

      if (!verseElement) return;

      if (selectedVerse.current) {
        selectedVerse.current.classList.remove("verse-selected");

        if (selectedVerse.current === verseElement) {
          selectedVerse.current = null;
          return;
        }
      }

      hightlighVerse(verseElement);
      selectedVerse.current = verseElement;
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
}

const InputTextForm = memo(
  ({
    verseKey,
    verseNote,
    noteEditable,
    noteDirection,
  }: InputTextFormProps) => {
    const dispatchDpAction = useDisplayPanel();
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
