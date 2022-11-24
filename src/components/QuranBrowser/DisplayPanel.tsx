import {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
  Fragment,
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
import { ACTIONS, useQuranBrowser } from "../../pages/QuranBrowser";

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
    const { chapterNames, allQuranText } = useQuran();

    const { t } = useTranslation();
    const refListVerses = useRef<HTMLDivElement>(null);

    interface versesRefProp {
      [key: string]: HTMLDivElement;
    }

    const versesRef = useRef<versesRefProp>({});

    interface notesType {
      [key: string]: string;
    }

    interface markedNotesType {
      [key: string]: boolean;
    }

    const [loadingState, setLoadingState] = useState(true);
    const [myNotes, setMyNotes] = useState<notesType>({});
    const [editableNotes, setEditableNotes] = useState<markedNotesType>({});
    const [areaDirection, setAreaDirection] = useState<notesType>({});

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

        setMyNotes(extractNotes);
        setEditableNotes(markedNotes);
        setAreaDirection(extractNotesDir);

        setLoadingState(false);
      }

      return () => {
        clientLeft = true;
      };
    }, []);

    const memoHandleNoteChange = useCallback(handleNoteChange, []);

    function handleNoteChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
      const { name, value } = event.target;

      setMyNotes((state) => {
        return { ...state, [name]: value };
      });
    }

    function handleSetDirection(verse_key: string, dir: string) {
      setAreaDirection((state) => {
        return { ...state, [verse_key]: dir };
      });

      saveData("notes_dir", { id: verse_key, dir: dir });
    }

    const memoHandleSetDirection = useCallback(handleSetDirection, []);

    function handleNoteSubmit(
      event: React.FormEvent<HTMLFormElement>,
      value: string
    ) {
      event.preventDefault();
      let verse_key = event.currentTarget.name;

      setEditableNotes((state) => {
        return { ...state, [verse_key]: false };
      });

      saveData("notes", {
        id: verse_key,
        text: value,
        date_created: Date.now(),
        date_modified: Date.now(),
      })
        .then(function () {
          toast.success(t("save_success"));
        })
        .catch(function () {
          toast.success(t("save_failed"));
        });
    }

    const memoHandleNoteSubmit = useCallback(handleNoteSubmit, [t]);

    function handleEditClick(event: React.MouseEvent<HTMLButtonElement>) {
      let inputKey = event.currentTarget.name;
      setEditableNotes((state) => {
        return { ...state, [inputKey]: true };
      });
    }

    const memoHandleEditClick = useCallback(handleEditClick, []);

    if (loadingState)
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
              chapterName={chapterNames[selectChapter - 1].name}
              searchToken={searchingString.trim()}
              scopeAllQuran={searchingAllQuran}
              searchError={searchError}
              selectedRootError={selectedRootError}
              radioSearchMethod={radioSearchingMethod}
              myNotes={myNotes}
              editableNotes={editableNotes}
              handleEditClick={memoHandleEditClick}
              searchMultipleChapters={searchMultipleChapters}
              refListVerses={refListVerses}
              searchingChapters={searchingChapters}
              scrollKey={scrollKey}
              rootDerivations={rootDerivations}
              handleNoteChange={memoHandleNoteChange}
              handleSetDirection={memoHandleSetDirection}
              areaDirection={areaDirection}
              handleNoteSubmit={memoHandleNoteSubmit}
            />
          ) : (
            <ListVerses
              chapterName={chapterNames[selectChapter - 1].name}
              versesArray={allQuranText[selectChapter - 1].verses}
              myNotes={myNotes}
              handleEditClick={memoHandleEditClick}
              editableNotes={editableNotes}
              refListVerses={refListVerses}
              versesRef={versesRef}
              scrollKey={scrollKey}
              handleNoteChange={memoHandleNoteChange}
              handleSetDirection={memoHandleSetDirection}
              areaDirection={areaDirection}
              handleNoteSubmit={memoHandleNoteSubmit}
            />
          )}
        </div>
      </div>
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
    chapterName,
    searchToken,
    scopeAllQuran,
    searchError,
    selectedRootError,
    radioSearchMethod,
    myNotes,
    editableNotes,
    handleEditClick,
    searchMultipleChapters,
    refListVerses,
    searchingChapters,
    scrollKey,
    rootDerivations,
    handleNoteChange,
    handleSetDirection,
    areaDirection,
    handleNoteSubmit,
  }: any) => {
    const { chapterNames } = useQuran();

    interface refVersesResultType {
      [key: string]: HTMLDivElement;
    }

    const refVersesResult = useRef<refVersesResultType>({});

    useEffect(() => {
      refListVerses.current.scrollTop = 0;
    }, [refListVerses, versesArray]);

    useEffect(() => {
      //init tooltip
      Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      ).forEach((tooltipNode) => new bootstrap.Tooltip(tooltipNode));
    }, [versesArray]);

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
                chapterNames={chapterNames}
                scrollKey={scrollKey}
                value={myNotes[verse.key] || ""}
                handleNoteChange={handleNoteChange}
                isEditable={editableNotes[verse.key]}
                handleEditClick={handleEditClick}
                handleSetDirection={handleSetDirection}
                noteDirection={areaDirection[verse.key] || ""}
                handleNoteSubmit={handleNoteSubmit}
                isRootSearch={isRootSearch}
                rootDerivations={rootDerivations}
              />
            </div>
          ))}
          <SearchErrorsComponent
            searchError={searchError}
            selectedRootError={selectedRootError}
          />
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
    chapterNames,
    scrollKey,
    value,
    handleNoteChange,
    isEditable,
    handleEditClick,
    handleSetDirection,
    noteDirection,
    handleNoteSubmit,
    isRootSearch,
    rootDerivations,
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
          verseChapter={chapterNames[verse.suraid - 1].name}
          chapterNames={chapterNames}
          scrollKey={scrollKey}
          isRootSearch={isRootSearch}
          rootDerivations={rootDerivations}
        />
        <TextForm
          inputKey={verse.key}
          inputValue={value}
          handleInputChange={handleNoteChange}
          isEditable={isEditable}
          handleEditClick={handleEditClick}
          handleSetDirection={handleSetDirection}
          inputDirection={noteDirection}
          handleInputSubmit={handleNoteSubmit}
        />
      </>
    );
  }
);

SearchVerseComponent.displayName = "SearchVerseComponent";

const DerivationsComponent = memo(
  ({ rootDerivations, handleRootClick }: any) => {
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
    chapterNames,
    scrollKey,
    isRootSearch,
    rootDerivations,
  }: any) => {
    const { dispatchAction } = useQuranBrowser();

    let verse_key = verse.key;
    let isLinkable = scopeAllQuran || searchMultipleChapters;

    function gotoChapter(chapter: string) {
      dispatchAction(ACTIONS.GOTO_CHAPTER, chapter);
    }

    const handleVerseClick = (verse_key: string) => {
      dispatchAction(ACTIONS.SET_SCROLL_KEY, verse_key);
      gotoChapter(chapterNames[verse.suraid - 1].id.toString());
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
    versesArray,
    chapterName,
    myNotes,
    editableNotes,
    handleEditClick,
    refListVerses,
    versesRef,
    scrollKey,
    handleNoteChange,
    handleSetDirection,
    areaDirection,
    handleNoteSubmit,
  }: any) => {
    useEffect(() => {
      if (scrollKey) {
        versesRef.current[scrollKey].scrollIntoView();
      } else {
        refListVerses.current.scrollTop = 0;
      }
    }, [refListVerses, scrollKey, versesRef, versesArray]);

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
              handleNoteChange={handleNoteChange}
              isEditable={editableNotes[verse.key]}
              handleEditClick={handleEditClick}
              handleSetDirection={handleSetDirection}
              noteDirection={areaDirection[verse.key] || ""}
              handleNoteSubmit={handleNoteSubmit}
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
    handleNoteChange,
    isEditable,
    handleEditClick,
    handleSetDirection,
    noteDirection,
    handleNoteSubmit,
  }: any) => {
    return (
      <div
        ref={(el) => (versesRef.current[verse.key] = el)}
        className="border-bottom pt-1 pb-1"
      >
        <VerseTextComponent verse={verse} />
        <TextForm
          inputKey={verse.key}
          inputValue={value}
          handleInputChange={handleNoteChange}
          isEditable={isEditable}
          handleEditClick={handleEditClick}
          handleSetDirection={handleSetDirection}
          inputDirection={noteDirection}
          handleInputSubmit={handleNoteSubmit}
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

export default DisplayPanel;
