import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { db } from "../util/db";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./LoadingSpinner";

function RootsBrowser({
  allQuranText,
  absoluteQuran,
  chapterNames,
  quranRoots,
}) {
  const [loadingState, setLoadingState] = useState(true);

  const [searchString, setSearchString] = useState("");

  const [myNotes, setMyNotes] = useState({});
  const [editableNotes, setEditableNotes] = useState({});

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userNotes = await db.root_notes.toArray();

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="pb-3 pt-2">
      <FormWordSearch
        handleSearchSubmit={handleSearchSubmit}
        searchString={searchString}
        setSearchString={setSearchString}
      />

      <div>
        {quranRoots
          .filter((root) => root.name.startsWith(searchString) || !searchString)
          .map((root, index) => (
            <div key={index} className="text-center border">
              <button
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={"#collapseExample" + root.id}
                aria-expanded="false"
                aria-controls={"collapseExample" + root.id}
                className="btn"
                value={root.id}
              >
                {root.name}
              </button>
              <div
                className="collapse card border-primary"
                id={"collapseExample" + root.id}
              >
                <div className="card-body">
                  <NoteForm
                    root={root}
                    value={myNotes[root.id] || ""}
                    myNotes={myNotes}
                    setMyNotes={setMyNotes}
                    editableNotes={editableNotes}
                    setEditableNotes={setEditableNotes}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
      <ToastContainer rtl />
    </div>
  );
}

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
      className="container p-0 m-0 pb-3"
      role="search"
      onSubmit={handleSearchSubmit}
    >
      <div className="row">
        <div className="col-sm-2">
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

const NoteForm = ({
  root,
  value,
  myNotes,
  setMyNotes,
  editableNotes,
  setEditableNotes,
}) => {
  const [rows, setRows] = useState(4);

  let root_id = root.id;

  if (!value) {
    editableNotes[root_id] = true;
  }

  let isNoteEditable = editableNotes[root_id];

  useEffect(() => {
    const rowlen = value.split("\n");

    if (rowlen.length >= 4) {
      setRows(rowlen.length + 1);
    } else {
      setRows(4);
    }
  }, [value]);

  const handleNoteChange = (event) => {
    const { name, value } = event.target;
    myNotes[name] = value;
    setMyNotes({ ...myNotes });
  };

  const handleNoteSubmit = (event) => {
    event.preventDefault();

    db.root_notes
      .put({
        id: root_id,
        text: value,
        date_created: Date.now(),
        date_modified: Date.now(),
      })
      .then(function (result) {
        //
        toast.success("تم الحفظ بنجاح.");
        editableNotes[root_id] = false;
        setEditableNotes({ ...editableNotes });
      })
      .catch(function (error) {
        //
        toast.success("فشلت عملية الحفظ.");
      });
  };

  const handleEditClick = () => {
    editableNotes[root_id] = true;
    setEditableNotes({ ...editableNotes });
  };

  return isNoteEditable ? (
    <form onSubmit={handleNoteSubmit}>
      <div className="form-group">
        <textarea
          className="form-control mb-2"
          id="textInput"
          placeholder="أدخل كتاباتك"
          name={root.id}
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

const NoteTextComponent = (props) => {
  return <p style={{ whiteSpace: "pre-wrap" }}>{props.children}</p>;
};

export default RootsBrowser;
