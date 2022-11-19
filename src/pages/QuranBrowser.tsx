import {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
  Fragment,
} from "react";

import { findWord, normalize_text, onlySpaces } from "../util/util";
import { toast } from "react-toastify";
import { loadData, saveData } from "../util/db";

import LoadingSpinner from "../components/LoadingSpinner";
import { ArrowDownCircleFill } from "react-bootstrap-icons";

import * as bootstrap from "bootstrap";
import { useTranslation } from "react-i18next";
import useQuran from "../context/QuranContext";

import { TextForm } from "../components/TextForm";
import SearchPanel from "../components/SearchPanel";

function QuranBrowser() {
  const { allQuranText, absoluteQuran, chapterNames, quranRoots } = useQuran();

  const refListChapters = useRef(null);
  const scrollKey = useRef(null);

  const [selectChapter, setSelectChapter] = useState(1);
  const [selectedChapters, setSelectedChapters] = useState(["1"]);

  const [searchString, setSearchString] = useState("");
  const [searchingString, setSearchingString] = useState("");

  const [searchResult, setSearchResult] = useState<any[]>([]);

  const [searchAllQuran, setSearchAllQuran] = useState(true);
  const [searchingAllQuran, setSearchingAllQuran] = useState(true);

  const [searchMultipleChapters, setSearchMultipleChapters] = useState(false);

  const [searchDiacritics, setSearchDiacritics] = useState(false);

  const [searchIdentical, setSearchIdentical] = useState(false);

  const [searchError, setSearchError] = useState(false);
  const [selectedRootError, setSelectedRootError] = useState(false);

  const [radioSearchMethod, setRadioSearchMethod] =
    useState("optionWordSearch");
  const [radioSearchingMethod, setRadioSearchingMethod] =
    useState("optionWordSearch");

  const [rootDerivations, setRootDerivations] = useState<any[]>([]);

  const clearPreviousSearch = () => {
    setSearchError(false);
    setSelectedRootError(false);
    setSearchMultipleChapters(false);
    setSearchResult([]);
    setRootDerivations([]);
  };

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    clearPreviousSearch();
    setSearchingString(searchString);
    setRadioSearchingMethod(radioSearchMethod);

    function handleSearchByWord() {
      if (onlySpaces(searchString)) {
        setSearchError(true);
        return;
      }

      let matchVerses: any[] = [];
      let normal_search = "";

      if (!searchDiacritics) {
        normal_search = normalize_text(searchString).trim();
      } else {
        normal_search = searchString.trim();
      }

      const checkVerseMatch = (verse: any) => {
        let normal_text = "";
        if (!searchDiacritics) {
          normal_text = normalize_text(verse.versetext);
        } else {
          normal_text = verse.versetext;
        }

        if (searchIdentical) {
          if (findWord(normal_search, normal_text)) {
            matchVerses.push(verse);
          }
        } else {
          if (normal_text.search(normal_search) !== -1) {
            matchVerses.push(verse);
          }
        }
      };

      if (searchAllQuran) {
        setSearchingAllQuran(true);
        allChaptersMatches();
      } else {
        setSearchingAllQuran(false);

        if (selectedChapters.length > 1) {
          multipleChaptersMatches();
        } else {
          oneChapterMatches();
        }
      }

      function allChaptersMatches() {
        allQuranText.forEach((sura: any) => {
          sura.verses.forEach((verse: any) => {
            checkVerseMatch(verse);
          });
        });
      }

      function oneChapterMatches() {
        let currentChapter = allQuranText[selectChapter - 1].verses;
        currentChapter.forEach((verse: any) => {
          checkVerseMatch(verse);
        });
      }

      function multipleChaptersMatches() {
        setSearchMultipleChapters(true);
        selectedChapters.forEach((chapter) => {
          allQuranText[Number(chapter) - 1].verses.forEach((verse: any) => {
            checkVerseMatch(verse);
          });
        });
      }

      if (matchVerses.length === 0) {
        setSearchError(true);
      } else {
        setSearchResult(matchVerses);
      }
    }

    function handleSearchByRoot() {
      if (onlySpaces(searchString)) {
        setSelectedRootError(true);
        return;
      }

      let rootTarget = quranRoots.find(
        (root: any) => root.name === searchString
      );

      if (rootTarget === undefined) {
        setSelectedRootError(true);
        return;
      }

      let occurencesArray = rootTarget.occurences;

      let matchVerses: any[] = [];
      let derivations: any[] = [];

      const fillDerivationsArray = (
        wordIndexes: any,
        verseWords: any,
        currentVerse: any
      ) => {
        wordIndexes.forEach((word: any) => {
          derivations.push({
            name: verseWords[word - 1],
            key: currentVerse.key,
            text:
              chapterNames[currentVerse.suraid - 1].name +
              ":" +
              currentVerse.verseid,
            wordIndex: word,
          });
        });
      };

      if (searchAllQuran) {
        setSearchingAllQuran(true);
      } else {
        setSearchingAllQuran(false);

        if (selectedChapters.length > 1) {
          setSearchMultipleChapters(true);
        }
      }

      // ابى	13	40:9;288:17,74;1242:13;1266:7;1832:3;2117:10;2127:20;2216:9;2403:6;2463:9;2904:5;3604:8

      // occurences array have the verserank:index1,index2...etc format
      occurencesArray.forEach((item: string) => {
        let info = item.split(":");
        let currentVerse = absoluteQuran[info[0]];

        if (selectedChapters.includes(currentVerse.suraid) || searchAllQuran) {
          let verseWords = currentVerse.versetext.split(" ");

          let wordIndexes = info[1].split(",");

          fillDerivationsArray(wordIndexes, verseWords, currentVerse);
          matchVerses.push(currentVerse);
        }
      });

      if (matchVerses.length === 0) {
        setSelectedRootError(true);
      } else {
        setSearchResult(matchVerses);
        setRootDerivations(derivations);
      }
    }

    if (radioSearchMethod === "optionWordSearch") {
      handleSearchByWord();
    } else if (radioSearchMethod === "optionRootSearch") {
      handleSearchByRoot();
    }
  }

  const memoHandleSearchSubmit = useCallback(handleSearchSubmit, [
    absoluteQuran,
    allQuranText,
    chapterNames,
    quranRoots,
    searchAllQuran,
    searchDiacritics,
    searchIdentical,
    selectChapter,
    selectedChapters,
    radioSearchMethod,
    searchString,
  ]);

  function gotoChapter(chapter: string) {
    clearPreviousSearch();
    setSelectChapter(Number(chapter));
    setSelectedChapters([chapter]);
  }

  const memoGotoChapter = useCallback(gotoChapter, []);

  function handleSelectionListChapters(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!event.target.value) return;

    scrollKey.current = null;

    let chapter = event.target.value;

    if (event.target.selectedOptions.length === 1) {
      memoGotoChapter(chapter);
    } else {
      setSelectedChapters(
        Array.from(event.target.selectedOptions, (option) => option.value)
      );
    }
  }

  const memoHandleSelectionListChapters = useCallback(
    handleSelectionListChapters,
    [memoGotoChapter]
  );

  return (
    <div className="browser">
      <SearchPanel
        refListChapters={refListChapters}
        selectedChapters={selectedChapters}
        searchResult={searchResult}
        searchString={searchString}
        searchDiacritics={searchDiacritics}
        searchIdentical={searchIdentical}
        radioSearchMethod={radioSearchMethod}
        searchAllQuran={searchAllQuran}
        setSearchAllQuran={setSearchAllQuran}
        setSearchIdentical={setSearchIdentical}
        setSearchString={setSearchString}
        setRadioSearchMethod={setRadioSearchMethod}
        setSearchDiacritics={setSearchDiacritics}
        memoHandleSearchSubmit={memoHandleSearchSubmit}
        memoHandleSelectionListChapters={memoHandleSelectionListChapters}
      />

      <DisplayPanel
        refListChapters={refListChapters}
        scrollKey={scrollKey}
        searchResult={searchResult}
        searchError={searchError}
        selectedRootError={selectedRootError}
        searchingString={searchingString}
        searchingAllQuran={searchingAllQuran}
        selectChapter={selectChapter}
        radioSearchingMethod={radioSearchingMethod}
        searchMultipleChapters={searchMultipleChapters}
        rootDerivations={rootDerivations}
        memoGotoChapter={memoGotoChapter}
      />
    </div>
  );
}

const DisplayPanel = memo(
  ({
    refListChapters,
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
    memoGotoChapter,
  }: any) => {
    const { chapterNames, allQuranText } = useQuran();
    const { t } = useTranslation();
    const refListVerses = useRef(null);
    const versesRef = useRef({});

    const [loadingState, setLoadingState] = useState(true);
    const [myNotes, setMyNotes] = useState({});
    const [editableNotes, setEditableNotes] = useState({});
    const [areaDirection, setAreaDirection] = useState({});

    useEffect(() => {
      let clientLeft = false;

      fetchData();

      async function fetchData() {
        let userNotes = await loadData("notes");

        if (clientLeft) return;

        let markedNotes = {} as any;
        let extractNotes = {} as any;
        userNotes.forEach((note: any) => {
          extractNotes[note.id] = note.text;
          markedNotes[note.id] = false;
        });

        let userNotesDir = await loadData("notes_dir");

        if (clientLeft) return;

        let extractNotesDir = {} as any;

        userNotesDir.forEach((note: any) => {
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

    // eslint-disable-next-line
    const memoHandleNoteSubmit = useCallback(handleNoteSubmit, []);

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
              refListChapters={refListChapters}
              gotoChapter={memoGotoChapter}
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
    selectedChapters,
    chapterName,
  }: any) => {
    let searchType = radioSearchMethod === "optionRootSearch" ? "جذر" : "كلمة";
    return (
      <h3 className="mb-2 text-info p-1">
        نتائج البحث عن {searchType} "{searchToken}"
        {scopeAllQuran === true
          ? " في كل السور"
          : searchMultipleChapters
          ? " في سور " + selectedChapters.join(" و")
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
    refListChapters,
    gotoChapter,
    scrollKey,
    rootDerivations,
    handleNoteChange,
    handleSetDirection,
    areaDirection,
    handleNoteSubmit,
  }: any) => {
    const { chapterNames } = useQuran();
    const refVersesResult = useRef<any>({});

    let selectedChapters = [];
    if (searchMultipleChapters) {
      if (refListChapters.current.selectedOptions.length > 1) {
        selectedChapters = Array.from(
          refListChapters.current.selectedOptions,
          (option: any) => chapterNames[option.value - 1].name
        );
      }
    }

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
          selectedChapters={selectedChapters}
          chapterName={chapterName}
        />
        {isRootSearch && (
          <DerivationsComponent
            handleRootClick={memoHandleRootClick}
            rootDerivations={rootDerivations}
          />
        )}
        <div className="card-body">
          {versesArray.map((verse: any) => (
            <div
              key={verse.key}
              ref={(el) => (refVersesResult.current[verse.key] = el)}
              className="border-bottom pt-1 pb-1"
            >
              <SearchVerseComponent
                verse={verse}
                scopeAllQuran={scopeAllQuran}
                searchMultipleChapters={searchMultipleChapters}
                chapterNames={chapterNames}
                gotoChapter={gotoChapter}
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
    gotoChapter,
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
          gotoChapter={gotoChapter}
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
          {rootDerivations.map((root: any, index: number) => (
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
    gotoChapter,
    chapterNames,
    scrollKey,
    isRootSearch,
    rootDerivations,
  }: any) => {
    let verse_key = verse.key;
    let isLinkable = scopeAllQuran || searchMultipleChapters;

    const handleVerseClick = (verse_key: string) => {
      scrollKey.current = verse_key;

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
      if (scrollKey.current) {
        versesRef.current[scrollKey.current].scrollIntoView();
      } else {
        refListVerses.current.scrollTop = 0;
      }
    }, [refListVerses, scrollKey, versesRef, versesArray]);

    return (
      <>
        <ListTitle chapterName={chapterName} />
        <div className="card-body">
          {versesArray.map((verse: any) => (
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

export default QuranBrowser;
