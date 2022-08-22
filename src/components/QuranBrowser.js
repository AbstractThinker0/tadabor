import { useEffect, useState, useRef } from "react";
import { findWord, normalize_text, onlySpaces } from "../util/util";
import { db } from "../util/db";
import { ArrowDownCircleFill } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./LoadingSpinner";

function QuranBrowser({
  allQuranText,
  absoluteQuran,
  chapterNames,
  quranRoots,
}) {
  const [loadingState, setLoadingState] = useState(true);

  const [selectChapter, setSelectChapter] = useState(chapterNames[0]);
  const [chapterVerses, setChapterVerses] = useState(allQuranText[0].verses);

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

  const [radioSearchMethod, setRadioSearchMethod] = useState("option2");
  const [radioSearchingMethod, setRadioSearchingMethod] = useState("option2");

  const [myNotes, setMyNotes] = useState({});
  const [editableNotes, setEditableNotes] = useState({});

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
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    clearPreviousSearch();
    setSearchingString(searchString);
    setRadioSearchingMethod(radioSearchMethod);

    if (radioSearchMethod === "option2") {
      handleSearchByWord();
    } else if (radioSearchMethod === "option1") {
      handleSearchByRoot();
    }
  };

  const handleSearchByWord = () => {
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

    if (searchAllQuran) {
      setSearchingAllQuran(true);
      allChaptersMatches();
    } else {
      setSearchingAllQuran(false);

      if (refListChapters.current.selectedOptions.length > 1) {
        setSearchMultipleChapters(true);
        selectedChapters = Array.from(
          refListChapters.current.selectedOptions,
          (option) => JSON.parse(option.value)
        );
      }

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
      chapterVerses.forEach((verse) => {
        checkVerseMatch(verse);
      });
    }

    function multipleChaptersMatches() {
      selectedChapters.forEach((chapter) => {
        allQuranText[chapter.id - 1].verses.forEach((verse) => {
          checkVerseMatch(verse);
        });
      });
    }

    if (matchVerses.length === 0) {
      setSearchError(true);
    } else {
      setSearchResult(matchVerses);
    }
  };

  const handleSearchByRoot = () => {
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

    if (searchAllQuran) {
      setSearchingAllQuran(true);

      occurencesArray.forEach((item) => {
        let info = item.split(":");

        let currentVerse = absoluteQuran[info[0]];

        matchVerses.push(currentVerse);
      });
    } else {
      setSearchingAllQuran(false);

      let selectedChapters = [];

      if (refListChapters.current.selectedOptions.length > 1) {
        setSearchMultipleChapters(true);
        selectedChapters = Array.from(
          refListChapters.current.selectedOptions,
          (option) => JSON.parse(option.value)
        );
      }

      if (selectedChapters.length > 1) {
        selectedChapters.forEach((chapter) => {
          occurencesArray.forEach((item) => {
            let info = item.split(":");

            let currentVerse = absoluteQuran[info[0]];

            if (chapter.id === parseInt(currentVerse.suraid)) {
              matchVerses.push(currentVerse);
            }
          });
        });
      } else {
        occurencesArray.forEach((item) => {
          let info = item.split(":");

          let currentVerse = absoluteQuran[info[0]];

          if (selectChapter.id === parseInt(currentVerse.suraid)) {
            matchVerses.push(currentVerse);
          }
        });
      }
    }

    if (matchVerses.length === 0) {
      setSelectedRootError(true);
    } else {
      setSearchResult(matchVerses);
    }
  };

  const handleSelectionListChapters = (event) => {
    if (!event.target.value) return;

    let chapter = JSON.parse(event.target.value); //object

    if (event.target.selectedOptions.length === 1) {
      gotoChapter(chapter);
    }
  };

  const gotoChapter = (chapter) => {
    clearPreviousSearch();
    setChapterVerses(allQuranText[chapter.id - 1].verses);
    setSelectChapter(chapter);
  };

  const refListVerses = useRef(null);
  const refListChapters = useRef(null);

  if (loadingState) return <LoadingSpinner />;

  let isRootSearch = radioSearchMethod === "option1" ? true : false;

  return (
    <>
      <div className="row h-75">
        <div className="col-auto pt-3 pb-1">
          <div className="me-5">
            <SelectionListChapters
              chaptersArray={chapterNames}
              handleSelectionListChapters={handleSelectionListChapters}
              innerRef={refListChapters}
            />

            <RadioSearchMethod
              radioSearchMethod={radioSearchMethod}
              setRadioSearchMethod={setRadioSearchMethod}
            />

            <CheckboxComponent
              checkboxState={searchDiacritics}
              setCheckBoxState={setSearchDiacritics}
              labelText="بالتشكيل"
              isDisabled={isRootSearch}
            />

            <CheckboxComponent
              checkboxState={searchIdentical}
              setCheckBoxState={setSearchIdentical}
              labelText="مطابق"
              isDisabled={isRootSearch}
            />

            <CheckboxComponent
              checkboxState={searchAllQuran}
              setCheckBoxState={setSearchAllQuran}
              labelText="بحث في كل السور"
            />

            <FormWordSearch
              handleSearchSubmit={handleSearchSubmit}
              searchString={searchString}
              setSearchString={setSearchString}
            />

            <SelectionListRoots
              quranRoots={quranRoots}
              radioSearchMethod={radioSearchMethod}
              searchString={searchString}
              setSearchString={setSearchString}
            />

            {searchResult.length > 0 && (
              <p className="mt-3 text-success">
                عدد الآيات: {searchResult.length}{" "}
              </p>
            )}
          </div>
        </div>

        <div
          className="col mt-3 pb-1 border rounded h-100 overflow-auto"
          ref={refListVerses}
        >
          {searchResult.length || searchError || selectedRootError ? (
            <ListSearchResults
              versesArray={searchResult}
              chapterName={selectChapter.name}
              searchToken={searchingString.trim()}
              scopeAllQuran={searchingAllQuran}
              searchError={searchError}
              selectedRootError={selectedRootError}
              chapterNames={chapterNames}
              radioSearchMethod={radioSearchingMethod}
              myNotes={myNotes}
              setMyNotes={setMyNotes}
              editableNotes={editableNotes}
              setEditableNotes={setEditableNotes}
              searchMultipleChapters={searchMultipleChapters}
              refListVerses={refListVerses}
              refListChapters={refListChapters}
              gotoChapter={gotoChapter}
            />
          ) : (
            <ListVerses
              versesArray={chapterVerses}
              chapterName={selectChapter.name}
              myNotes={myNotes}
              setMyNotes={setMyNotes}
              editableNotes={editableNotes}
              setEditableNotes={setEditableNotes}
              refListVerses={refListVerses}
            />
          )}
        </div>
      </div>
      <ToastContainer rtl />
    </>
  );
}

const SelectionListChapters = ({
  chaptersArray,
  handleSelectionListChapters,
  innerRef,
}) => {
  const handleSelectFocus = (e) => {
    // If we have only one selected chapter make sure the verses list gets refreshed after doing a search
    if (e.target.selectedOptions.length === 1) {
      e.target.selectedIndex = -1;
    }
  };

  return (
    <div className="container mt-2 mb-2 pe-0 ps-5">
      <select
        className="form-select"
        size="7"
        onFocus={handleSelectFocus}
        onChange={handleSelectionListChapters}
        aria-label="size 7 select example"
        ref={innerRef}
        multiple
      >
        {chaptersArray.map((chapter, index) => (
          <option key={chapter.id} value={JSON.stringify(chapter)}>
            {index + 1}. {chapter.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const RadioSearchMethod = ({ radioSearchMethod, setRadioSearchMethod }) => {
  const handleSearchMethod = (event) => {
    setRadioSearchMethod(event.target.value);
  };
  return (
    <div>
      طريقة البحث:
      <div className="form-check form-check-inline form-check-reverse">
        <input
          className="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio1"
          value="option1"
          checked={radioSearchMethod === "option1"}
          onChange={handleSearchMethod}
        />
        <label className="form-check-label" htmlFor="inlineRadio1">
          جذر
        </label>
      </div>
      <div className="form-check form-check-inline form-check-reverse">
        <input
          className="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio2"
          value="option2"
          checked={radioSearchMethod === "option2"}
          onChange={handleSearchMethod}
        />
        <label className="form-check-label" htmlFor="inlineRadio2">
          كلمة
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
          />
        </div>
        <div className="col">
          <button className="btn btn-outline-success" type="submit">
            إبحث
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
  const handleChangeCheckboxState = () => {
    setCheckBoxState(!checkboxState);
  };
  return (
    <div className="form-check form-check-reverse mt-2">
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

const SelectionListRoots = ({
  quranRoots,
  radioSearchMethod,
  searchString,
  setSearchString,
}) => {
  let isDisabled = radioSearchMethod === "option1" ? false : true;

  const handleSelectRoot = (event) => {
    let obj = JSON.parse(event.target.value); //object
    setSearchString(obj.name);
  };

  return (
    <div className="container mt-2 p-0 ps-5">
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
            <option key={index} value={JSON.stringify(root)}>
              {root.name}
            </option>
          ))}
      </select>
    </div>
  );
};

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
  setMyNotes,
  editableNotes,
  setEditableNotes,
  searchMultipleChapters,
  refListVerses,
  refListChapters,
  gotoChapter,
}) => {
  let selectedChapters = [];
  if (searchMultipleChapters) {
    if (refListChapters.current.selectedOptions.length > 1) {
      selectedChapters = Array.from(
        refListChapters.current.selectedOptions,
        (option) => JSON.parse(option.value).name
      );
    }
  }

  useEffect(() => {
    refListVerses.current.scrollTop = 0;
  }, [refListVerses, versesArray]);

  const handleNoteChange = (event) => {
    const { name, value } = event.target;
    let verse = JSON.parse(name);
    myNotes[verse.suraid + "-" + verse.verseid] = value;
    setMyNotes({ ...myNotes });
  };

  const SearchTitle = () => {
    let searchType = radioSearchMethod === "option1" ? "جذر" : "كلمة";
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

  return (
    <>
      <SearchTitle />
      {versesArray.map((verse) => (
        <div key={verse.suraid + ":" + verse.verseid}>
          <VerseTextComponent>
            <VerseContentComponent
              verse={verse}
              scopeAllQuran={scopeAllQuran}
              searchMultipleChapters={searchMultipleChapters}
              verseChapter={chapterNames[verse.suraid - 1].name}
              gotoChapter={gotoChapter}
              chapterNames={chapterNames}
            />
          </VerseTextComponent>
          <div
            className="collapse card border-primary"
            id={"collapseExample" + verse.suraid + "-" + verse.verseid}
          >
            <div className="card-body">
              <NoteForm
                verse={verse}
                value={myNotes[verse.suraid + "-" + verse.verseid] || ""}
                handleNoteChange={handleNoteChange}
                editableNotes={editableNotes}
                setEditableNotes={setEditableNotes}
              />
            </div>
          </div>
        </div>
      ))}
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
}) => {
  let verse_key = verse.suraid + "-" + verse.verseid;
  let isLinkable = scopeAllQuran || searchMultipleChapters;

  const handleVerseClick = (e, verse_key) => {
    gotoChapter(chapterNames[verse.suraid - 1]);
  };

  return (
    <>
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
      </button>{" "}
    </>
  );
};

const ListVerses = ({
  versesArray,
  chapterName,
  myNotes,
  setMyNotes,
  editableNotes,
  setEditableNotes,
  refListVerses,
}) => {
  useEffect(() => {
    refListVerses.current.scrollTop = 0;
  }, [refListVerses, versesArray]);

  //
  const handleNoteChange = (event) => {
    const { name, value } = event.target;
    let verse = JSON.parse(name);
    myNotes[verse.suraid + "-" + verse.verseid] = value;
    setMyNotes({ ...myNotes });
  };

  const ListTitle = (props) => {
    return <>{props.children}</>;
  };

  return (
    <>
      <ListTitle>
        <h3 className="mb-2 text-primary">سورة {chapterName}</h3>
      </ListTitle>
      {versesArray.map((verse) => (
        <div key={verse.suraid + "-" + verse.verseid}>
          <VerseTextComponent>
            {verse.versetext} ({verse.verseid}){" "}
            <button
              className="btn"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={
                "#collapseExample" + verse.suraid + "-" + verse.verseid
              }
              aria-expanded="false"
              aria-controls={
                "collapseExample" + verse.suraid + "-" + verse.verseid
              }
            >
              <ArrowDownCircleFill />
            </button>
          </VerseTextComponent>
          <div
            className="collapse card border-primary"
            id={"collapseExample" + verse.suraid + "-" + verse.verseid}
          >
            <div className="card-body">
              <NoteForm
                verse={verse}
                value={myNotes[verse.suraid + "-" + verse.verseid] || ""}
                handleNoteChange={handleNoteChange}
                editableNotes={editableNotes}
                setEditableNotes={setEditableNotes}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const VerseTextComponent = (props) => {
  return <p className="pt-1 fs-4">{props.children}</p>;
};

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

  let verse_key = verse.suraid + "-" + verse.verseid;

  if (!value) {
    editableNotes[verse_key] = true;
  }

  let isNoteEditable = editableNotes[verse_key];

  useEffect(() => {
    const rowlen = value.split("\n");

    if (rowlen.length > 4 && !isNoteEditable) {
      setRows(rowlen.length);
    }
  }, [value, isNoteEditable]);

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
