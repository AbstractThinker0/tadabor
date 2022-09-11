import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { db } from "../util/db";

import { toast } from "react-toastify";

import LoadingSpinner from "./LoadingSpinner";
import useQuran from "../context/QuranContext";
import { normalizeAlif } from "../util/util";

import { IconTextDirectionLtr } from "@tabler/icons";
import { IconTextDirectionRtl } from "@tabler/icons";

import InfiniteScroll from "react-infinite-scroll-component";

function RootsBrowser() {
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

      <RootsListComponent searchString={searchString} />
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

const RootsListComponent = memo(({ searchString }) => {
  const { t } = useTranslation();
  const { quranRoots } = useQuran();
  const [loadingState, setLoadingState] = useState(true);

  const [myNotes, setMyNotes] = useState({});
  const [editableNotes, setEditableNotes] = useState({});
  const [areaDirection, setAreaDirection] = useState({});
  const [itemsCount, setItemsCount] = useState(20);

  const formsRefs = useRef({});

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
        toast.success(t("save_success"));
        setEditableNotes((state) => {
          return { ...state, [root_id]: false };
        });
      })
      .catch(function (error) {
        //
        toast.success(t("save_failed"));
      });
  }

  // eslint-disable-next-line
  const memoHandleNoteSubmit = useCallback(handleNoteSubmit, []);

  const memoHandleEditClick = useCallback(handleEditClick, []);

  function handleEditClick(event) {
    let root_id = event.target.name;
    setEditableNotes((state) => {
      return { ...state, [root_id]: true };
    });
  }

  function handleSetDirection(root_id, dir) {
    setAreaDirection((state) => {
      return { ...state, [root_id]: dir };
    });
  }

  const memoHandleSetDirection = useCallback(handleSetDirection, []);

  let filteredArray = useMemo(
    () =>
      quranRoots.filter(
        (root) =>
          normalizeAlif(root.name).startsWith(searchString) ||
          root.name.startsWith(searchString) ||
          !searchString
      ),
    [quranRoots, searchString]
  );

  const fetchMoreData = () => {
    setItemsCount((state) => state + 20);
  };

  if (loadingState) return <LoadingSpinner />;

  return (
    <div>
      <InfiniteScroll
        dataLength={itemsCount}
        next={fetchMoreData}
        hasMore={itemsCount <= filteredArray.length}
        loader={<h4>Loading...</h4>}
      >
        {filteredArray.slice(0, itemsCount).map((root) => (
          <RootComponent
            key={root.id}
            root_name={root.name}
            root_id={root.id}
            value={myNotes[root.id] || ""}
            noteDirection={areaDirection[root.id] || ""}
            isEditable={editableNotes[root.id]}
            handleEditClick={memoHandleEditClick}
            handleNoteSubmit={memoHandleNoteSubmit}
            handleNoteChange={memoHandleNoteChange}
            handleSetDirection={memoHandleSetDirection}
            formsRefs={formsRefs}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
});

const RootComponent = memo(
  ({
    root_name,
    root_id,
    value,
    handleNoteChange,
    handleNoteSubmit,
    handleEditClick,
    isEditable,
    noteDirection,
    handleSetDirection,
    formsRefs,
  }) => {
    return (
      <div className="text-center border">
        <RootButton
          root_name={root_name}
          root_id={root_id}
          formsRefs={formsRefs}
        />
        <RootCollapse
          root_id={root_id}
          value={value}
          isEditable={isEditable}
          noteDirection={noteDirection}
          handleSetDirection={handleSetDirection}
          handleNoteChange={handleNoteChange}
          handleNoteSubmit={handleNoteSubmit}
          handleEditClick={handleEditClick}
          formsRefs={formsRefs}
        />
      </div>
    );
  }
);

const RootButton = memo(({ root_name, root_id, formsRefs }) => {
  const onClickRoot = (event) => {
    if (event.target.getAttribute("aria-expanded") === "true") {
      formsRefs.current[root_id].scrollIntoView({ block: "center" });
    }
  };
  return (
    <button
      type="button"
      data-bs-toggle="collapse"
      data-bs-target={"#collapseExample" + root_id}
      aria-expanded="false"
      aria-controls={"collapseExample" + root_id}
      className="btn"
      value={root_id}
      onClick={onClickRoot}
    >
      {root_name}
    </button>
  );
});

const RootCollapse = ({
  root_id,
  value,
  isEditable,
  handleNoteChange,
  handleNoteSubmit,
  handleEditClick,
  noteDirection,
  handleSetDirection,
  formsRefs,
}) => {
  return (
    <div
      className="collapse card border-primary"
      id={"collapseExample" + root_id}
      ref={(el) => (formsRefs.current[root_id] = el)}
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
            noteDirection={noteDirection}
            handleNoteChange={handleNoteChange}
            handleNoteSubmit={handleNoteSubmit}
            handleSetDirection={handleSetDirection}
          />
        )}
      </div>
    </div>
  );
};

const FromComponent = ({
  root_id,
  value,
  noteDirection,
  handleNoteSubmit,
  handleNoteChange,
  handleSetDirection,
}) => {
  const { t } = useTranslation();
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
        <TextareaToolbar>
          <ToolbarOption handleClick={() => handleSetDirection(root_id, "ltr")}>
            <IconTextDirectionLtr />
          </ToolbarOption>
          <ToolbarOption handleClick={() => handleSetDirection(root_id, "rtl")}>
            <IconTextDirectionRtl />
          </ToolbarOption>
        </TextareaToolbar>
        <textarea
          className="form-control mb-2"
          id="textInput"
          placeholder="أدخل كتاباتك"
          name={root_id}
          value={value}
          onChange={handleNoteChange}
          rows={rows}
          dir={noteDirection}
          required
        />
      </div>
      <input
        type="submit"
        value={t("text_save")}
        className="btn btn-success btn-sm"
      />
    </form>
  );
};

const TextareaToolbar = memo((props) => {
  return <div dir="ltr">{props.children}</div>;
});

function ToolbarOption(props) {
  return (
    <button type="button" className="btn btn-sm" onClick={props.handleClick}>
      {props.children}
    </button>
  );
}

const NoteTextComponent = ({ value, root_id, handleEditClick }) => {
  const { t } = useTranslation();
  return (
    <div>
      <p style={{ whiteSpace: "pre-wrap" }}>{value}</p>
      <button
        name={root_id}
        onClick={handleEditClick}
        className="btn btn-primary btn-sm"
      >
        {t("text_edit")}
      </button>
    </div>
  );
};

export default RootsBrowser;
