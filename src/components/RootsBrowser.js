import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { db } from "../util/db";

import { toast } from "react-toastify";

import LoadingSpinner from "./LoadingSpinner";
import useQuran from "../context/QuranContext";

function RootsBrowser() {
  const { quranRoots } = useQuran();

  const [searchString, setSearchString] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="pb-3 pt-2">
      <FormWordSearch
        handleSearchSubmit={handleSearchSubmit}
        searchString={searchString}
        setSearchString={setSearchString}
      />

      <RootsListComponent quranRoots={quranRoots} searchString={searchString} />
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

const RootsListComponent = ({ quranRoots, searchString }) => {
  const [loadingState, setLoadingState] = useState(true);

  const [myNotes, setMyNotes] = useState({});
  const [editableNotes, setEditableNotes] = useState({});

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userNotes = await db.root_notes.toArray();

      if (clientLeft) return;

      let markedNotes = {};

      let extractNotes = {};
      userNotes.forEach((note) => {
        extractNotes[note.id] = note.text;
        markedNotes[note.id] = false;
      });

      setMyNotes(extractNotes);
      setEditableNotes(markedNotes);

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

  const memoHandleNoteSubmit = useCallback(handleNoteSubmit, []);

  function handleNoteSubmit(event, value) {
    event.preventDefault();

    let root_id = event.target.name;

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
        setEditableNotes((state) => {
          return { ...state, [root_id]: false };
        });
      })
      .catch(function (error) {
        //
        toast.success("فشلت عملية الحفظ.");
      });
  }

  const memoHandleEditClick = useCallback(handleEditClick, []);

  function handleEditClick(event) {
    let root_id = event.target.name;
    setEditableNotes((state) => {
      return { ...state, [root_id]: true };
    });
  }

  if (loadingState) return <LoadingSpinner />;

  return (
    <div>
      {quranRoots
        .filter((root) => root.name.startsWith(searchString) || !searchString)
        .map((root) => (
          <RootComponent
            key={root.id}
            root_name={root.name}
            root_id={root.id}
            value={myNotes[root.id] || ""}
            isEditable={editableNotes[root.id]}
            handleEditClick={memoHandleEditClick}
            handleNoteSubmit={memoHandleNoteSubmit}
            handleNoteChange={memoHandleNoteChange}
          />
        ))}
    </div>
  );
};

const RootComponent = memo(
  ({
    root_name,
    root_id,
    value,
    handleNoteChange,
    handleNoteSubmit,
    handleEditClick,
    isEditable,
  }) => {
    return (
      <div className="text-center border">
        <RootButton root_name={root_name} root_id={root_id} />
        <RootCollapse
          root_id={root_id}
          value={value}
          isEditable={isEditable}
          handleNoteChange={handleNoteChange}
          handleNoteSubmit={handleNoteSubmit}
          handleEditClick={handleEditClick}
        />
      </div>
    );
  }
);

const RootButton = ({ root_name, root_id }) => {
  return (
    <button
      type="button"
      data-bs-toggle="collapse"
      data-bs-target={"#collapseExample" + root_id}
      aria-expanded="false"
      aria-controls={"collapseExample" + root_id}
      className="btn"
      value={root_id}
    >
      {root_name}
    </button>
  );
};

const RootCollapse = ({
  root_id,
  value,
  isEditable,
  handleNoteChange,
  handleNoteSubmit,
  handleEditClick,
}) => {
  return (
    <div
      className="collapse card border-primary"
      id={"collapseExample" + root_id}
    >
      <div className="card-body">
        {isEditable === false ? (
          <NoteTextComponent
            handleEditClick={handleEditClick}
            value={value}
            root_id={root_id}
          />
        ) : (
          <FromComponent
            root_id={root_id}
            value={value}
            handleNoteChange={handleNoteChange}
            handleNoteSubmit={handleNoteSubmit}
          />
        )}
      </div>
    </div>
  );
};

const FromComponent = ({
  root_id,
  value,
  handleNoteSubmit,
  handleNoteChange,
}) => {
  const [rows, setRows] = useState(4);

  useEffect(() => {
    const rowlen = value.split("\n");

    if (rowlen.length >= 4) {
      setRows(rowlen.length + 1);
    } else {
      setRows(4);
    }
  }, [value]);

  return (
    <form
      key={root_id}
      name={root_id}
      onSubmit={(event) => handleNoteSubmit(event, value)}
    >
      <div className="form-group">
        <textarea
          className="form-control mb-2"
          id="textInput"
          placeholder="أدخل كتاباتك"
          name={root_id}
          value={value}
          onChange={handleNoteChange}
          rows={rows}
          required
        />
      </div>
      <input type="submit" value="حفظ" className="btn btn-success btn-sm" />
    </form>
  );
};

const NoteTextComponent = ({ value, root_id, handleEditClick }) => {
  return (
    <div>
      <p style={{ whiteSpace: "pre-wrap" }}>{value}</p>
      <button
        name={root_id}
        onClick={handleEditClick}
        className="btn btn-primary btn-sm"
      >
        تعديل
      </button>
    </div>
  );
};

export default RootsBrowser;
