import { useEffect, useState, useRef, useCallback, memo } from "react";

import { findWord, normalize_text, onlySpaces } from "../util/util";
import { db } from "../util/db";

import LoadingSpinner from "./LoadingSpinner";
import { ArrowDownCircleFill } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as bootstrap from "bootstrap";
import { useTranslation } from "react-i18next";

function QuranBrowser({
  allQuranText,
  absoluteQuran,
  chapterNames,
  quranRoots,
}) {
  const [loadingState, setLoadingState] = useState(true);

  const [selectChapter, setSelectChapter] = useState(1);

  const [searchString, setSearchString] = useState("");
  const [searchingString, setSearchingString] = useState("");

  const [searchResult, setSearchResult] = useState([]);

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

  const [myNotes, setMyNotes] = useState({});
  const [editableNotes, setEditableNotes] = useState({});

  const [rootDerivations, setRootDerivations] = useState([]);

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userNotes = await db.notes.toArray();

      if (clientLeft) return;

      let extractNotes = {};
      userNotes.forEach((note) => {
        extractNotes[note.id] = note.text;
      });

      setMyNotes(extractNotes);

      setLoadingState(false);
    }

    return () => {
      clientLeft = true;
    };
  }, []);

  const clearPreviousSearch = () => {
    setSearchError(false);
    setSelectedRootError(false);
    setSearchMultipleChapters(false);
    setSearchResult([]);
    setRootDerivations([]);
  };

  function handleSearchSubmit(e) {
    e.preventDefault();

    clearPreviousSearch();
    setSearchingString(searchString);
    setRadioSearchingMethod(radioSearchMethod);

    if (radioSearchMethod === "optionWordSearch") {
      memoHandleSearchByWord();
    } else if (radioSearchMethod === "optionRootSearch") {
      memoHandleSearchByRoot();
    }
  }

  function handleSearchByWord() {
    if (onlySpaces(searchString)) {
      setSearchError(true);
      return;
    }

    let matchVerses = [];
    let normal_search = "";

    if (!searchDiacritics) {
      normal_search = normalize_text(searchString).trim();
    } else {
      normal_search = searchString.trim();
    }

    const checkVerseMatch = (verse) => {
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

    let selectedChapters = [];

    const fillSelectedChaptersArray = () => {
      if (refListChapters.current.selectedOptions.length > 1) {
        setSearchMultipleChapters(true);
        selectedChapters = Array.from(
          refListChapters.current.selectedOptions,
          (option) => option.value
        );
      }
    };

    if (searchAllQuran) {
      setSearchingAllQuran(true);
      allChaptersMatches();
    } else {
      setSearchingAllQuran(false);

      fillSelectedChaptersArray();

      if (selectedChapters.length > 1) {
        multipleChaptersMatches();
      } else {
        oneChapterMatches();
      }
    }

    function allChaptersMatches() {
      allQuranText.forEach((sura) => {
        sura.verses.forEach((verse) => {
          checkVerseMatch(verse);
        });
      });
    }

    function oneChapterMatches() {
      let currentChapter = allQuranText[selectChapter - 1].verses;
      currentChapter.forEach((verse) => {
        checkVerseMatch(verse);
      });
    }

    function multipleChaptersMatches() {
      selectedChapters.forEach((chapter) => {
        allQuranText[chapter - 1].verses.forEach((verse) => {
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

  const memoHandleSearchByWord = useCallback(handleSearchByWord, [
    allQuranText,
    searchAllQuran,
    searchDiacritics,
    searchIdentical,
    searchString,
    selectChapter,
  ]);

  function handleSearchByRoot() {
    if (onlySpaces(searchString)) {
      setSelectedRootError(true);
      return;
    }

    let rootTarget = quranRoots.find((root) => root.name === searchString);

    if (rootTarget === undefined) {
      setSelectedRootError(true);
      return;
    }

    let occurencesArray = rootTarget.occurences;

    let matchVerses = [];
    let derivations = [];

    const fillSelectedChaptersArray = () => {
      let selectedChapters = [];
      if (refListChapters.current.selectedOptions.length > 1) {
        setSearchMultipleChapters(true);
        selectedChapters = Array.from(
          refListChapters.current.selectedOptions,
          (option) => option.value
        );
      }
      return selectedChapters;
    };

    const fillDerivationsArray = (wordIndexes, verseWords, currentVerse) => {
      wordIndexes.forEach((word) => {
        derivations.push({
          name: verseWords[word - 1],
          key: currentVerse.key,
          text:
            chapterNames[currentVerse.suraid - 1].name +
            ":" +
            currentVerse.verseid,
        });
      });
    };

    if (searchAllQuran) {
      setSearchingAllQuran(true);

      occurencesArray.forEach((item) => {
        let info = item.split(":");

        let currentVerse = absoluteQuran[info[0]];

        let verseWords = currentVerse.versetext.split(" ");

        let wordIndexes = info[1].split(",");

        fillDerivationsArray(wordIndexes, verseWords, currentVerse);
        matchVerses.push(currentVerse);
      });
    } else {
      setSearchingAllQuran(false);

      let selectedChapters = fillSelectedChaptersArray();

      if (selectedChapters.length > 1) {
        selectedChapters.forEach((chapter) => {
          occurencesArray.forEach((item) => {
            let info = item.split(":");

            let currentVerse = absoluteQuran[info[0]];

            let verseWords = currentVerse.versetext.split(" ");

            let wordIndexes = info[1].split(",");

            if (+chapter === +currentVerse.suraid) {
              fillDerivationsArray(wordIndexes, verseWords, currentVerse);
              matchVerses.push(currentVerse);
            }
          });
        });
      } else {
        occurencesArray.forEach((item) => {
          let info = item.split(":");

          let currentVerse = absoluteQuran[info[0]];

          let verseWords = currentVerse.versetext.split(" ");

          let wordIndexes = info[1].split(",");

          if (+selectChapter === +currentVerse.suraid) {
            fillDerivationsArray(wordIndexes, verseWords, currentVerse);
            matchVerses.push(currentVerse);
          }
        });
      }
    }

    if (matchVerses.length === 0) {
      setSelectedRootError(true);
    } else {
      setSearchResult(matchVerses);
      setRootDerivations(derivations);
    }
  }

  const memoHandleSearchByRoot = useCallback(handleSearchByRoot, [
    absoluteQuran,
    chapterNames,
    quranRoots,
    searchAllQuran,
    searchString,
    selectChapter,
  ]);

  const memoHandleSearchSubmit = useCallback(handleSearchSubmit, [
    memoHandleSearchByRoot,
    memoHandleSearchByWord,
    radioSearchMethod,
    searchString,
  ]);

  const memoGotoChapter = useCallback(gotoChapter, []);

  function gotoChapter(chapter) {
    clearPreviousSearch();
    setSelectChapter(chapter);
  }

  const memoHandleSelectionListChapters = useCallback(
    handleSelectionListChapters,
    [memoGotoChapter]
  );

  function handleSelectionListChapters(event) {
    if (!event.target.value) return;

    scrollKey.current = null;

    let chapter = event.target.value;

    if (event.target.selectedOptions.length === 1) {
      memoGotoChapter(chapter);
    }
  }

  const memoHandleNoteChange = useCallback(handleNoteChange, []);

  function handleNoteChange(event) {
    const { name, value } = event.target;
    let verse = JSON.parse(name);

    setMyNotes((state) => {
      return { ...state, [verse.key]: value };
    });
  }

  const refListChapters = useRef(null);

  const scrollKey = useRef();

  if (loadingState) return <LoadingSpinner />;

  let isRootSearch = radioSearchMethod === "optionRootSearch" ? true : false;

  return (
    <>
      <div className="row" style={{ height: "85%" }}>
        <SearchPanel
          chapterNames={chapterNames}
          memoHandleSelectionListChapters={memoHandleSelectionListChapters}
          refListChapters={refListChapters}
          radioSearchMethod={radioSearchMethod}
          setRadioSearchMethod={setRadioSearchMethod}
          searchDiacritics={searchDiacritics}
          setSearchDiacritics={setSearchDiacritics}
          isRootSearch={isRootSearch}
          searchIdentical={searchIdentical}
          setSearchIdentical={setSearchIdentical}
          searchAllQuran={searchAllQuran}
          setSearchAllQuran={setSearchAllQuran}
          memoHandleSearchSubmit={memoHandleSearchSubmit}
          searchString={searchString}
          setSearchString={setSearchString}
          searchResult={searchResult}
          quranRoots={quranRoots}
        />

        <DisplayPanel
          searchResult={searchResult}
          searchError={searchError}
          selectedRootError={selectedRootError}
          chapterNames={chapterNames}
          searchingString={searchingString}
          searchingAllQuran={searchingAllQuran}
          selectChapter={selectChapter}
          radioSearchingMethod={radioSearchingMethod}
          myNotes={myNotes}
          editableNotes={editableNotes}
          setEditableNotes={setEditableNotes}
          searchMultipleChapters={searchMultipleChapters}
          refListChapters={refListChapters}
          memoGotoChapter={memoGotoChapter}
          scrollKey={scrollKey}
          rootDerivations={rootDerivations}
          memoHandleNoteChange={memoHandleNoteChange}
          allQuranText={allQuranText}
        />
      </div>
      <ToastContainer rtl />
    </>
  );
}

const SearchSuccessComponent = ({ searchResult }) => {
  const { t } = useTranslation();
  return (
    <>
      {searchResult.length > 0 && (
        <p className="mt-3 text-success">
          {t("search_count") + " " + searchResult.length}{" "}
        </p>
      )}
    </>
  );
};

const SearchPanel = memo(
  ({
    chapterNames,
    memoHandleSelectionListChapters,
    refListChapters,
    radioSearchMethod,
    setRadioSearchMethod,
    searchDiacritics,
    setSearchDiacritics,
    isRootSearch,
    searchIdentical,
    setSearchIdentical,
    searchAllQuran,
    setSearchAllQuran,
    memoHandleSearchSubmit,
    searchString,
    setSearchString,
    searchResult,
    quranRoots,
  }) => {
    const { t } = useTranslation();
    return (
      <div className="col-auto pt-3 pb-1">
        <SelectionListChapters
          chaptersArray={chapterNames}
          handleSelectionListChapters={memoHandleSelectionListChapters}
          innerRef={refListChapters}
        />
        <RadioSearchMethod
          radioSearchMethod={radioSearchMethod}
          setRadioSearchMethod={setRadioSearchMethod}
        />
        <CheckboxComponent
          checkboxState={searchDiacritics}
          setCheckBoxState={setSearchDiacritics}
          labelText={t("search_diacritics")}
          isDisabled={isRootSearch}
        />
        <CheckboxComponent
          checkboxState={searchIdentical}
          setCheckBoxState={setSearchIdentical}
          labelText={t("search_identical")}
          isDisabled={isRootSearch}
        />
        <CheckboxComponent
          checkboxState={searchAllQuran}
          setCheckBoxState={setSearchAllQuran}
          labelText={t("search_all_quran")}
        />
        <FormWordSearch
          handleSearchSubmit={memoHandleSearchSubmit}
          searchString={searchString}
          setSearchString={setSearchString}
        />
        <SelectionListRoots
          quranRoots={quranRoots}
          isDisabled={!isRootSearch}
          searchString={searchString}
          setSearchString={setSearchString}
        />
        <SearchSuccessComponent searchResult={searchResult} />
      </div>
    );
  }
);

const DisplayPanel = memo(
  ({
    searchResult,
    searchError,
    selectedRootError,
    chapterNames,
    searchingString,
    searchingAllQuran,
    selectChapter,
    radioSearchingMethod,
    myNotes,
    editableNotes,
    setEditableNotes,
    searchMultipleChapters,
    refListChapters,
    memoGotoChapter,
    scrollKey,
    rootDerivations,
    memoHandleNoteChange,
    allQuranText,
  }) => {
    const refListVerses = useRef(null);
    const versesRef = useRef({});

    return (
      <div
        dir="rtl"
        className="col mt-3 pb-1 border rounded h-100 overflow-auto"
        ref={refListVerses}
      >
        {searchResult.length || searchError || selectedRootError ? (
          <ListSearchResults
            versesArray={searchResult}
            chapterName={chapterNames[selectChapter - 1].name}
            searchToken={searchingString.trim()}
            scopeAllQuran={searchingAllQuran}
            searchError={searchError}
            selectedRootError={selectedRootError}
            chapterNames={chapterNames}
            radioSearchMethod={radioSearchingMethod}
            myNotes={myNotes}
            editableNotes={editableNotes}
            setEditableNotes={setEditableNotes}
            searchMultipleChapters={searchMultipleChapters}
            refListVerses={refListVerses}
            refListChapters={refListChapters}
            gotoChapter={memoGotoChapter}
            scrollKey={scrollKey}
            rootDerivations={rootDerivations}
            handleNoteChange={memoHandleNoteChange}
          />
        ) : (
          <ListVerses
            chapterName={chapterNames[selectChapter - 1].name}
            versesArray={allQuranText[selectChapter - 1].verses}
            myNotes={myNotes}
            setEditableNotes={setEditableNotes}
            editableNotes={editableNotes}
            refListVerses={refListVerses}
            versesRef={versesRef}
            scrollKey={scrollKey}
            handleNoteChange={memoHandleNoteChange}
          />
        )}
      </div>
    );
  }
);

const SelectionListChapters = memo(
  ({ chaptersArray, handleSelectionListChapters, innerRef }) => {
    return (
      <div className="container mt-2 mb-2 p-0">
        <select
          className="form-select"
          size="7"
          onFocus={handleSelectionListChapters}
          onChange={handleSelectionListChapters}
          aria-label="size 7 select example"
          ref={innerRef}
          defaultValue={["1"]}
          multiple
        >
          {chaptersArray.map((chapter, index) => (
            <option key={chapter.id} value={chapter.id}>
              {index + 1}. {chapter.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

const RadioSearchMethod = ({ radioSearchMethod, setRadioSearchMethod }) => {
  const { t, i18n } = useTranslation();
  const handleSearchMethod = (event) => {
    setRadioSearchMethod(event.target.value);
  };
  return (
    <div>
      {t("search_method")}
      <div
        className={`form-check form-check-inline ${
          i18n.resolvedLanguage === "ar" && "form-check-reverse"
        }`}
      >
        <input
          className="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio1"
          value="optionRootSearch"
          checked={radioSearchMethod === "optionRootSearch"}
          onChange={handleSearchMethod}
        />
        <label className="form-check-label" htmlFor="inlineRadio1">
          {t("search_root")}
        </label>
      </div>
      <div
        className={`form-check form-check-inline ${
          i18n.resolvedLanguage === "ar" && "form-check-reverse"
        }`}
      >
        <input
          className="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio2"
          value="optionWordSearch"
          checked={radioSearchMethod === "optionWordSearch"}
          onChange={handleSearchMethod}
        />
        <label className="form-check-label" htmlFor="inlineRadio2">
          {t("search_word")}
        </label>
      </div>
    </div>
  );
};

const FormWordSearch = ({
  handleSearchSubmit,
  searchString,
  setSearchString,
}) => {
  const { t } = useTranslation();

  const searchStringHandle = (event) => {
    setSearchString(event.target.value);
  };

  return (
    <form
      className="container p-0 mt-2"
      role="search"
      onSubmit={handleSearchSubmit}
    >
      <div className="row">
        <div className="col">
          <input
            className="form-control"
            type="search"
            placeholder=""
            value={searchString}
            aria-label="Search"
            onChange={searchStringHandle}
            required
            dir="rtl"
          />
        </div>
        <div className="col">
          <button className="btn btn-outline-success" type="submit">
            {t("search_button")}
          </button>
        </div>
      </div>
    </form>
  );
};

const CheckboxComponent = ({
  checkboxState,
  setCheckBoxState,
  labelText,
  isDisabled = false,
}) => {
  const { i18n } = useTranslation();

  const handleChangeCheckboxState = () => {
    setCheckBoxState(!checkboxState);
  };
  return (
    <div
      className={`form-check mt-2  ${
        i18n.resolvedLanguage === "ar" && "form-check-reverse"
      }`}
    >
      <input
        className="form-check-input"
        type="checkbox"
        checked={checkboxState}
        onChange={handleChangeCheckboxState}
        value=""
        id="flexCheckDefault"
        disabled={isDisabled}
      />
      <label className="form-check-label" htmlFor="flexCheckDefault">
        {labelText}
      </label>
    </div>
  );
};

const SelectionListRoots = memo(
  ({ quranRoots, isDisabled, searchString, setSearchString }) => {
    const handleSelectRoot = (event) => {
      let rootId = event.target.value;
      let selectedRoot = quranRoots[rootId];

      setSearchString(selectedRoot.name);
    };

    return (
      <div className="container mt-2 p-0">
        <select
          className="form-select"
          size="6"
          onChange={handleSelectRoot}
          aria-label="size 6 select example"
          disabled={isDisabled}
        >
          {quranRoots
            .filter((root) => root.name.startsWith(searchString) || isDisabled)
            .map((root, index) => (
              <option key={index} value={root.id}>
                {root.name}
              </option>
            ))}
        </select>
      </div>
    );
  },
  areEqual
);

function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  if (nextProps.isDisabled === true) {
    return true;
  }
}

const ListSearchResults = ({
  versesArray,
  chapterName,
  searchToken,
  scopeAllQuran,
  searchError,
  selectedRootError,
  chapterNames,
  radioSearchMethod,
  myNotes,
  editableNotes,
  setEditableNotes,
  searchMultipleChapters,
  refListVerses,
  refListChapters,
  gotoChapter,
  scrollKey,
  rootDerivations,
  handleNoteChange,
}) => {
  const refVersesResult = useRef({});

  let selectedChapters = [];
  if (searchMultipleChapters) {
    if (refListChapters.current.selectedOptions.length > 1) {
      selectedChapters = Array.from(
        refListChapters.current.selectedOptions,
        (option) => chapterNames[option.value - 1].name
      );
    }
  }

  useEffect(() => {
    refListVerses.current.scrollTop = 0;
  }, [refListVerses, versesArray]);

  useEffect(() => {
    //init tooltip
    Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(
      (tooltipNode) => new bootstrap.Tooltip(tooltipNode)
    );
  }, [versesArray]);

  const SearchTitle = () => {
    let searchType = radioSearchMethod === "optionRootSearch" ? "جذر" : "كلمة";
    return (
      <h3 className="mb-2 text-info">
        نتائج البحث عن {searchType} "{searchToken}"
        {scopeAllQuran === true
          ? " في كل السور"
          : searchMultipleChapters
          ? " في سور " + selectedChapters.join(" و")
          : " في سورة " + chapterName}
      </h3>
    );
  };

  const memoHandleRootClick = useCallback(handleRootClick, []);

  function handleRootClick(e, verse_key) {
    refVersesResult.current[verse_key].scrollIntoView();
  }

  const isRootSearch = radioSearchMethod === "optionRootSearch" ? true : false;

  return (
    <>
      <SearchTitle />
      {isRootSearch && (
        <DerivationsComponent
          handleRootClick={memoHandleRootClick}
          rootDerivations={rootDerivations}
        />
      )}
      {versesArray.map((verse) => (
        <SearchVerseComponent
          key={verse.key}
          refVersesResult={refVersesResult}
          verse={verse}
          scopeAllQuran={scopeAllQuran}
          searchMultipleChapters={searchMultipleChapters}
          chapterNames={chapterNames}
          gotoChapter={gotoChapter}
          scrollKey={scrollKey}
          value={myNotes[verse.key] || ""}
          handleNoteChange={handleNoteChange}
          editableNotes={editableNotes}
          setEditableNotes={setEditableNotes}
        />
      ))}
      <SearchErrorsComponent
        searchError={searchError}
        selectedRootError={selectedRootError}
      />
    </>
  );
};

const SearchVerseComponent = memo(
  ({
    refVersesResult,
    verse,
    scopeAllQuran,
    searchMultipleChapters,
    chapterNames,
    gotoChapter,
    scrollKey,
    value,
    handleNoteChange,
    editableNotes,
    setEditableNotes,
  }) => {
    return (
      <div ref={(el) => (refVersesResult.current[verse.key] = el)}>
        <VerseContentComponent
          verse={verse}
          scopeAllQuran={scopeAllQuran}
          searchMultipleChapters={searchMultipleChapters}
          verseChapter={chapterNames[verse.suraid - 1].name}
          gotoChapter={gotoChapter}
          chapterNames={chapterNames}
          scrollKey={scrollKey}
        />
        <div
          className="collapse card border-primary"
          id={"collapseExample" + verse.key}
        >
          <div className="card-body">
            <NoteForm
              verse={verse}
              value={value}
              handleNoteChange={handleNoteChange}
              editableNotes={editableNotes}
              setEditableNotes={setEditableNotes}
            />
          </div>
        </div>
      </div>
    );
  }
);

const DerivationsComponent = memo(({ rootDerivations, handleRootClick }) => {
  return (
    <>
      <hr />
      <p>
        {rootDerivations.map((root, index) => (
          <span
            role="button"
            key={index}
            onClick={(e) => handleRootClick(e, root.key)}
            data-bs-toggle="tooltip"
            data-bs-title={root.text}
          >
            {index ? " -" : " "} {root.name}
          </span>
        ))}
      </p>
      <hr />
    </>
  );
});

const SearchErrorsComponent = ({ searchError, selectedRootError }) => {
  return (
    <>
      {searchError && <p className="mt-3 text-danger">لا وجود لهذه الكلمة.</p>}
      {selectedRootError && (
        <p className="mt-3 text-danger">هذا الجذر غير موجود أو غير مدرج.</p>
      )}
    </>
  );
};

const VerseContentComponent = ({
  verse,
  scopeAllQuran,
  searchMultipleChapters,
  verseChapter,
  gotoChapter,
  chapterNames,
  scrollKey,
}) => {
  let verse_key = verse.key;
  let isLinkable = scopeAllQuran || searchMultipleChapters;

  const handleVerseClick = (e, verse_key) => {
    scrollKey.current = verse_key;
    gotoChapter(chapterNames[verse.suraid - 1].id);
  };

  return (
    <p className="pt-1 fs-4">
      {verse.versetext} (
      {isLinkable ? (
        <button
          className="p-0 border-0 bg-transparent"
          onClick={(e) => handleVerseClick(e, verse_key)}
        >
          {verseChapter + ":" + verse.verseid}
        </button>
      ) : (
        verse.verseid
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
    </p>
  );
};

const ListVerses = ({
  versesArray,
  chapterName,
  myNotes,
  editableNotes,
  setEditableNotes,
  refListVerses,
  versesRef,
  scrollKey,
  handleNoteChange,
}) => {
  useEffect(() => {
    if (scrollKey.current) {
      versesRef.current[scrollKey.current].scrollIntoView();
    } else {
      refListVerses.current.scrollTop = 0;
    }
  }, [refListVerses, scrollKey, versesRef, versesArray]);

  const ListTitle = (props) => {
    return <h3 className="mb-2 text-primary text-center">{props.children}</h3>;
  };

  return (
    <>
      <ListTitle>سورة {chapterName}</ListTitle>
      {versesArray.map((verse) => (
        <VerseComponent
          key={verse.key}
          versesRef={versesRef}
          verse={verse}
          value={myNotes[verse.key] || ""}
          handleNoteChange={handleNoteChange}
          editableNotes={editableNotes}
          setEditableNotes={setEditableNotes}
        />
      ))}
    </>
  );
};

const VerseComponent = memo(
  ({
    versesRef,
    verse,
    value,
    handleNoteChange,
    editableNotes,
    setEditableNotes,
  }) => {
    return (
      <div ref={(el) => (versesRef.current[verse.key] = el)}>
        <VerseTextComponent verse={verse} />
        <div
          className="collapse card border-primary"
          id={"collapseExample" + verse.key}
        >
          <div className="card-body">
            <NoteForm
              verse={verse}
              value={value}
              handleNoteChange={handleNoteChange}
              editableNotes={editableNotes}
              setEditableNotes={setEditableNotes}
            />
          </div>
        </div>
      </div>
    );
  }
);

const VerseTextComponent = memo(({ verse }) => {
  return (
    <p className="pt-1 fs-4">
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
    </p>
  );
});

const NoteTextComponent = (props) => {
  return <p style={{ whiteSpace: "pre-wrap" }}>{props.children}</p>;
};

const NoteForm = ({
  verse,
  value,
  handleNoteChange,
  editableNotes,
  setEditableNotes,
}) => {
  const [rows, setRows] = useState(4);

  let verse_key = verse.key;

  if (!value) {
    editableNotes[verse_key] = true;
  }

  let isNoteEditable = editableNotes[verse_key];

  useEffect(() => {
    const rowlen = value.split("\n");

    if (rowlen.length >= 4) {
      setRows(rowlen.length + 1);
    } else {
      setRows(4);
    }
  }, [value]);

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    db.notes
      .put({
        id: verse_key,
        text: value,
        date_created: Date.now(),
        date_modified: Date.now(),
      })
      .then(function (result) {
        //
        toast.success("تم الحفظ بنجاح.");
        editableNotes[verse_key] = false;
        setEditableNotes({ ...editableNotes });
      })
      .catch(function (error) {
        //
        toast.success("فشلت عملية الحفظ.");
      });
  };

  const handleEditClick = () => {
    editableNotes[verse_key] = true;
    setEditableNotes({ ...editableNotes });
  };

  return isNoteEditable ? (
    <form onSubmit={handleNoteSubmit}>
      <div className="form-group">
        <textarea
          className="form-control  mb-2"
          id="textInput"
          placeholder="أدخل كتاباتك"
          name={JSON.stringify(verse)}
          value={value}
          onChange={handleNoteChange}
          rows={rows}
          required
        />
      </div>
      <input type="submit" value="حفظ" className="btn btn-success btn-sm" />
    </form>
  ) : (
    <>
      <NoteTextComponent>{value}</NoteTextComponent>
      <button onClick={handleEditClick} className="btn btn-primary btn-sm">
        تعديل
      </button>
    </>
  );
};

export default QuranBrowser;
