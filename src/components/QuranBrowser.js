import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { normalize_text, onlySpaces } from "../util/util";
import { db } from "../util/db";
import { ArrowDownCircleFill } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./LoadingSpinner";

function QuranBrowser() {
  const [loadingState, setLoadingState] = useState(true);

  const [selectChapter, setSelectChapter] = useState();
  const [chapterVerses, setChapterVerses] = useState();

  const [searchString, setSearchString] = useState("");
  const [searchingString, setSearchingString] = useState("");

  const [searchResult, setSearchResult] = useState([]);

  const [searchAllQuran, setSearchAllQuran] = useState(true);
  const [searchingAllQuran, setSearchingAllQuran] = useState(true);

  const [searchDiacritics, setSearchDiacritics] = useState(false);

  const [searchError, setSearchError] = useState(false);
  const [selectedRootError, setSelectedRootError] = useState(false);

  const [radioSearchMethod, setRadioSearchMethod] = useState("option2");
  const [radioSearchingMethod, setRadioSearchingMethod] = useState("option2");

  const [myNotes, setMyNotes] = useState({});
  const [editableNotes, setEditableNotes] = useState({});

  let allQuranText = useRef(null);
  let absoluteQuran = useRef([]);
  let chapterNames = useRef(null);
  let quranRoots = useRef([]);

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let res;

      if (chapterNames.current === null) {
        res = await axios.get("/res/chapters.json");

        if (res.error || clientLeft) return;

        chapterNames.current = res.data;
      }

      setSelectChapter(chapterNames.current[0]);

      if (allQuranText.current === null) {
        res = await axios.get("/res/quran.json");

        if (res.error || clientLeft) return;

        allQuranText.current = res.data;
      }

      setChapterVerses(allQuranText.current[0].verses);

      if (absoluteQuran.current.length === 0) {
        allQuranText.current.forEach((sura) => {
          sura.verses.forEach((verse) => {
            absoluteQuran.current.push(verse);
          });
        });
      }

      if (quranRoots.current.length === 0) {
        res = await axios.get("/res/quran-root.txt");

        if (res.error || clientLeft) return;

        let arrayOfLines = res.data.split("\n");

        arrayOfLines.forEach((line) => {
          if (line[0] === "#" || line[0] === "\r") {
            return;
          }

          let lineArgs = line.split(/[\r\n\t]+/g);

          let occurences = lineArgs[2].split(";");

          quranRoots.current.push({
            name: lineArgs[0],
            count: lineArgs[1],
            occurences: occurences,
          });
        });
      }

      let userNotes = await db.notes.toArray();
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    setLoadingState(true);

    setSearchError(false);
    setSelectedRootError(false);
    setSearchingString(searchString);
    setRadioSearchingMethod(radioSearchMethod);
    setSearchResult([]);

    if (radioSearchMethod === "option2") {
      handleSearchByWord();
    } else if (radioSearchMethod === "option1") {
      handleSearchByRoot();
    }
    setLoadingState(false);
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

    if (searchAllQuran) {
      setSearchingAllQuran(true);
      multipleChapterMatches();
    } else {
      setSearchingAllQuran(false);
      oneChapterMatches();
    }

    function multipleChapterMatches() {
      allQuranText.current.forEach((sura) => {
        sura.verses.forEach((verse) => {
          let normal_text = "";
          if (!searchDiacritics) {
            normal_text = normalize_text(verse.versetext);
          } else {
            normal_text = verse.versetext;
          }
          if (normal_text.search(normal_search) !== -1) {
            matchVerses.push(verse);
          }
        });
      });
    }

    function oneChapterMatches() {
      chapterVerses.forEach((verse) => {
        let normal_text = "";
        if (!searchDiacritics) {
          normal_text = normalize_text(verse.versetext);
        } else {
          normal_text = verse.versetext;
        }
        if (normal_text.search(normal_search) !== -1) {
          matchVerses.push(verse);
        }
      });
    }

    if (matchVerses.length === 0) {
      setSearchError(true);
    } else {
      setSearchResult(matchVerses);
    }
  };

  const searchStringHandle = (event) => {
    setSearchString(event.target.value);
  };

  const handleChangeSearchAllQuran = () => {
    setSearchAllQuran(!searchAllQuran);
  };

  const handleChangeSearchDiacritics = () => {
    setSearchDiacritics(!searchDiacritics);
  };

  const handleSearchByRoot = () => {
    if (onlySpaces(searchString)) {
      setSelectedRootError(true);
      return;
    }

    let rootTarget = quranRoots.current.find(
      (root) => root.name === searchString
    );

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

        let currentVerse = absoluteQuran.current[info[0]];

        matchVerses.push(currentVerse);
      });
    } else {
      setSearchingAllQuran(false);

      occurencesArray.forEach((item) => {
        let info = item.split(":");

        let currentVerse = absoluteQuran.current[info[0]];

        if (selectChapter.id === parseInt(currentVerse.suraid)) {
          matchVerses.push(currentVerse);
        }
      });
    }

    if (matchVerses.length === 0) {
      setSelectedRootError(true);
    } else {
      setSearchResult(matchVerses);
    }
  };

  const handleSelectRoot = (event) => {
    let obj = JSON.parse(event.target.value); //object
    setSearchString(obj.name);
  };

  const handleSelectionListChapters = (event) => {
    let chapter = JSON.parse(event.target.value); //object

    setSelectChapter(chapter);
    setChapterVerses(allQuranText.current[chapter.id - 1].verses);
    setSearchError(false);
    setSelectedRootError(false);
    setSearchResult([]);
  };

  const handleSearchMethod = (event) => {
    setRadioSearchMethod(event.target.value);
  };

  const refListVerses = useRef(null);

  if (loadingState) return <LoadingSpinner />;

  return (
    <>
      <div className="row h-75">
        <div className="col-auto pt-3 pb-1">
          <div className="me-5">
            <SelectionListChapters
              chaptersArray={chapterNames.current}
              handleSelectionListChapters={handleSelectionListChapters}
            />

            <RadioSearchMethod
              radioSearchMethod={radioSearchMethod}
              handleSearchMethod={handleSearchMethod}
            />

            <CheckboxComponent
              checkboxState={searchDiacritics}
              handleChangeCheckboxState={handleChangeSearchDiacritics}
              labelText="بالتشكيل"
            />

            <CheckboxComponent
              checkboxState={searchAllQuran}
              handleChangeCheckboxState={handleChangeSearchAllQuran}
              labelText="بحث في كل السور"
            />

            <FormWordSearch
              handleSearchSubmit={handleSearchSubmit}
              searchString={searchString}
              searchStringHandle={searchStringHandle}
            />

            <SelectionListRoots
              handleSelectRoot={handleSelectRoot}
              quranRoots={quranRoots}
              radioSearchMethod={radioSearchMethod}
              searchString={searchString}
            />

            {searchResult.length > 0 && (
              <p className="mt-3 text-success">
                عدد الآيات: {searchResult.length}{" "}
              </p>
            )}
          </div>
        </div>

        <div
          className="col mt-3 pb-1 border h-100 overflow-auto"
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
              chapterNames={chapterNames.current}
              radioSearchMethod={radioSearchingMethod}
              myNotes={myNotes}
              setMyNotes={setMyNotes}
              editableNotes={editableNotes}
              setEditableNotes={setEditableNotes}
              refListVerses={refListVerses}
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
}) => {
  const handleSelectFocus = (e) => {
    e.target.selectedIndex = -1;
    e.target.blur();
  };
  return (
    <div className="container mt-2 mb-2 p-0">
      <div className="row">
        <div className="col">
          <select
            className="form-select"
            size="7"
            onFocus={handleSelectFocus}
            onChange={handleSelectionListChapters}
            aria-label="size 7 select example"
          >
            {chaptersArray.map((chapter, index) => (
              <option key={chapter.id} value={JSON.stringify(chapter)}>
                {index + 1}. {chapter.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col"></div>
      </div>
    </div>
  );
};

const RadioSearchMethod = ({ radioSearchMethod, handleSearchMethod }) => {
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
  searchStringHandle,
}) => {
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
  handleChangeCheckboxState,
  labelText,
}) => {
  return (
    <div className="form-check form-check-reverse mt-2">
      <input
        className="form-check-input"
        type="checkbox"
        checked={checkboxState}
        onChange={handleChangeCheckboxState}
        value=""
        id="flexCheckDefault"
      />
      <label className="form-check-label" htmlFor="flexCheckDefault">
        {labelText}
      </label>
    </div>
  );
};

const SelectionListRoots = ({
  handleSelectRoot,
  quranRoots,
  radioSearchMethod,
  searchString,
}) => {
  let isDisabled = radioSearchMethod === "option1" ? false : true;
  return (
    <div className="container mt-2 p-0">
      <div className="row">
        <div className="col">
          <select
            className="form-select"
            size="6"
            onChange={handleSelectRoot}
            aria-label="size 6 select example"
            disabled={isDisabled}
          >
            {quranRoots.current
              .filter(
                (root) => root.name.startsWith(searchString) || isDisabled
              )
              .map((root, index) => (
                <option key={index} value={JSON.stringify(root)}>
                  {root.name}
                </option>
              ))}
          </select>
        </div>
        <div className="col"></div>
      </div>
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
  refListVerses,
}) => {
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
        {scopeAllQuran === true ? " في كل السور" : " في سورة " + chapterName}
      </h3>
    );
  };

  return (
    <>
      <SearchTitle />
      {versesArray.map((verse) => (
        <div key={verse.suraid + ":" + verse.verseid}>
          <VerseTextComponent>
            {verse.versetext} (
            {scopeAllQuran && chapterNames[verse.suraid - 1].name + ":"}
            {verse.verseid})
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
      {searchError && <p className="mt-3 text-danger">لا وجود لهذه الكلمة.</p>}
      {selectedRootError && (
        <p className="mt-3 text-danger">هذا الجذر غير موجود أو غير مدرج.</p>
      )}
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
  let verse_key = verse.suraid + "-" + verse.verseid;

  if (!value) {
    editableNotes[verse_key] = true;
  }

  let isNoteEditable = editableNotes[verse_key];

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
