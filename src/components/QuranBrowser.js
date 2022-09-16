import { useEffect, useState, useRef, useCallback, memo } from "react";

import { findWord, normalize_text, onlySpaces } from "../util/util";
import { toast } from "react-toastify";
import { db } from "../util/db";

import LoadingSpinner from "./LoadingSpinner";
import { ArrowDownCircleFill } from "react-bootstrap-icons";

import * as bootstrap from "bootstrap";
import { useTranslation } from "react-i18next";
import useQuran from "../context/QuranContext";
import SelectionListChapters from "./SelectionListChapters";
import SelectionListRoots from "./SelectionListRoots";
import { TextForm } from "./TextForm";

function QuranBrowser() {
  const { allQuranText, absoluteQuran, chapterNames, quranRoots } = useQuran();
  const [selectChapter, setSelectChapter] = useState(1);
  const [selectedChapters, setSelectedChapters] = useState(["1"]);

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

  const [rootDerivations, setRootDerivations] = useState([]);

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
    setSelectedChapters([chapter]);
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
    } else {
      setSelectedChapters(
        Array.from(event.target.selectedOptions, (option) => option.value)
      );
    }
  }

  const refListChapters = useRef(null);

  const scrollKey = useRef();

  return (
    <div
      className="row w-100 m-auto justify-content-center"
      style={{ height: "90%" }}
    >
      <SearchPanel
        memoHandleSelectionListChapters={memoHandleSelectionListChapters}
        refListChapters={refListChapters}
        radioSearchMethod={radioSearchMethod}
        setRadioSearchMethod={setRadioSearchMethod}
        searchDiacritics={searchDiacritics}
        setSearchDiacritics={setSearchDiacritics}
        searchIdentical={searchIdentical}
        setSearchIdentical={setSearchIdentical}
        searchAllQuran={searchAllQuran}
        setSearchAllQuran={setSearchAllQuran}
        memoHandleSearchSubmit={memoHandleSearchSubmit}
        searchString={searchString}
        setSearchString={setSearchString}
        searchResult={searchResult}
        selectedChapters={selectedChapters}
      />

      <DisplayPanel
        searchResult={searchResult}
        searchError={searchError}
        selectedRootError={selectedRootError}
        searchingString={searchingString}
        searchingAllQuran={searchingAllQuran}
        selectChapter={selectChapter}
        radioSearchingMethod={radioSearchingMethod}
        searchMultipleChapters={searchMultipleChapters}
        refListChapters={refListChapters}
        memoGotoChapter={memoGotoChapter}
        scrollKey={scrollKey}
        rootDerivations={rootDerivations}
      />
    </div>
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
    memoHandleSelectionListChapters,
    refListChapters,
    radioSearchMethod,
    setRadioSearchMethod,
    searchDiacritics,
    setSearchDiacritics,
    searchIdentical,
    setSearchIdentical,
    searchAllQuran,
    setSearchAllQuran,
    memoHandleSearchSubmit,
    searchString,
    setSearchString,
    searchResult,
    selectedChapters,
  }) => {
    const { t } = useTranslation();

    let isRootSearch = radioSearchMethod === "optionRootSearch" ? true : false;

    return (
      <div className="col-auto">
        <SelectionListChapters
          handleSelectionListChapters={memoHandleSelectionListChapters}
          innerRef={refListChapters}
          selectedChapters={selectedChapters}
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
          isDisabled={!isRootSearch}
          searchString={searchString}
          setSearchString={setSearchString}
        />
        <SearchSuccessComponent searchResult={searchResult} />
      </div>
    );
  }
);

SearchPanel.displayName = "SearchPanel";

const DisplayPanel = memo(
  ({
    searchResult,
    searchError,
    selectedRootError,
    searchingString,
    searchingAllQuran,
    selectChapter,
    radioSearchingMethod,
    searchMultipleChapters,
    refListChapters,
    memoGotoChapter,
    scrollKey,
    rootDerivations,
  }) => {
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
        let userNotes = await db.notes.toArray();

        if (clientLeft) return;

        let markedNotes = {};
        let extractNotes = {};
        userNotes.forEach((note) => {
          extractNotes[note.id] = note.text;
          markedNotes[note.id] = false;
        });

        let userNotesDir = await db.notes_dir.toArray();

        if (clientLeft) return;

        let extractNotesDir = {};

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

    function handleNoteChange(event) {
      const { name, value } = event.target;

      setMyNotes((state) => {
        return { ...state, [name]: value };
      });
    }

    function handleSetDirection(verse_key, dir) {
      setAreaDirection((state) => {
        return { ...state, [verse_key]: dir };
      });

      db.notes_dir.put({ id: verse_key, dir: dir });
    }

    const memoHandleSetDirection = useCallback(handleSetDirection, []);

    function handleNoteSubmit(event, value) {
      event.preventDefault();
      let verse_key = event.target.name;

      db.notes
        .put({
          id: verse_key,
          text: value,
          date_created: Date.now(),
          date_modified: Date.now(),
        })
        .then(function (result) {
          //
          toast.success(t("save_success"));
          setEditableNotes((state) => {
            return { ...state, [verse_key]: false };
          });
        })
        .catch(function (error) {
          //
          toast.success(t("save_failed"));
        });
    }

    // eslint-disable-next-line
    const memoHandleNoteSubmit = useCallback(handleNoteSubmit, []);

    function handleEditClick(event) {
      let inputKey = event.target.name;
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
      <div className="col p-0 h-100">
        <div
          className="h-100"
          style={{ overflowY: "scroll" }}
          ref={refListVerses}
        >
          <div className="card" dir="rtl">
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
      </div>
    );
  }
);

DisplayPanel.displayName = "DisplayPanel";

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

const SearchTitle = memo(
  ({
    radioSearchMethod,
    searchToken,
    scopeAllQuran,
    searchMultipleChapters,
    selectedChapters,
    chapterName,
  }) => {
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
  }
);

const ListSearchResults = memo(
  ({
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
      Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      ).forEach((tooltipNode) => new bootstrap.Tooltip(tooltipNode));
    }, [versesArray]);

    SearchTitle.displayName = "SearchTitle";

    const memoHandleRootClick = useCallback(handleRootClick, []);

    function handleRootClick(e, verse_key) {
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
              isEditable={editableNotes[verse.key]}
              handleEditClick={handleEditClick}
              handleSetDirection={handleSetDirection}
              noteDirection={areaDirection[verse.key] || ""}
              handleNoteSubmit={handleNoteSubmit}
            />
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
    refVersesResult,
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

SearchVerseComponent.displayName = "SearchVerseComponent";

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

DerivationsComponent.displayName = "DerivationsComponent";

const SearchErrorsComponent = ({ searchError, selectedRootError }) => {
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
  }) => {
    let verse_key = verse.key;
    let isLinkable = scopeAllQuran || searchMultipleChapters;

    const handleVerseClick = (verse_key) => {
      scrollKey.current = verse_key;
      gotoChapter(chapterNames[verse.suraid - 1].id);
    };

    return (
      <p className="pt-1 fs-4">
        {verse.versetext} (
        {isLinkable ? (
          <button
            className="p-0 border-0 bg-transparent"
            onClick={(e) => handleVerseClick(verse_key)}
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
  }
);

VerseContentComponent.displayName = "VerseContentComponent";

const ListTitle = memo(({ chapterName }) => {
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
  }) => {
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
          {versesArray.map((verse) => (
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
  }) => {
    return (
      <div ref={(el) => (versesRef.current[verse.key] = el)}>
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

VerseTextComponent.displayName = "VerseTextComponent";

export default QuranBrowser;
