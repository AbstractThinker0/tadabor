import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { loadData, saveData } from "../util/db";

import { toast } from "react-toastify";

import LoadingSpinner from "./LoadingSpinner";
import useQuran from "../context/QuranContext";
import { normalizeAlif } from "../util/util";

import { TextForm } from "./TextForm";

const arabicAlpha = [
  "ا",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "ه",
  "و",
  "ى",
  "ي",
];

function RootsBrowser() {
  const [searchString, setSearchString] = useState("");

  return (
    <div className="p-3" style={{ height: "90%" }}>
      <FormWordSearch
        searchString={searchString}
        setSearchString={setSearchString}
      />

      <RootsListComponent searchString={searchString} />
    </div>
  );
}

const FormWordSearch = ({ searchString, setSearchString }: any) => {
  const searchStringHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const onLetterClick = (letter: string) => {
    setSearchString(letter);
  };

  return (
    <div className="container p-3">
      <div className="row justify-content-center">
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
      </div>
      <div className="row pt-1" dir="rtl">
        <div className="container text-center">
          {arabicAlpha.map((letter, index) => (
            <Fragment key={index}>
              <span
                role="button"
                className="text-primary"
                onClick={() => onLetterClick(letter)}
              >
                {" "}
                {letter}{" "}
              </span>
              {index < arabicAlpha.length - 1 && (
                <span
                  style={{ borderLeft: "1px solid grey", margin: "0 7.5px" }}
                ></span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const RootsListComponent = memo(({ searchString }: any) => {
  const { t } = useTranslation();
  const { quranRoots } = useQuran();
  const [loadingState, setLoadingState] = useState(true);

  const [myNotes, setMyNotes] = useState<any>({});
  const [editableNotes, setEditableNotes] = useState<any>({});
  const [areaDirection, setAreaDirection] = useState<any>({});
  const [itemsCount, setItemsCount] = useState(100);

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userNotes = await loadData("root_notes");

      if (clientLeft) return;

      let markedNotes = {} as any;

      let extractNotes = {} as any;
      userNotes.forEach((note: any) => {
        extractNotes[note.id] = note.text;
        markedNotes[note.id] = false;
      });

      let userNotesDir = await loadData("root_notes_dir");

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

    setMyNotes((state: any) => {
      return { ...state, [name]: value };
    });
  }

  function handleNoteSubmit(
    event: React.FormEvent<HTMLFormElement>,
    value: string
  ) {
    event.preventDefault();
    let root_id = event.currentTarget.name;

    setEditableNotes((state: any) => {
      return { ...state, [root_id]: false };
    });

    saveData("root_notes", {
      id: root_id,
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

  const memoHandleEditClick = useCallback(handleEditClick, []);

  function handleEditClick(event: React.MouseEvent<HTMLButtonElement>) {
    let root_id = event.currentTarget.name;
    setEditableNotes((state: any) => {
      return { ...state, [root_id]: true };
    });
  }

  function handleSetDirection(root_id: string, dir: string) {
    setAreaDirection((state: any) => {
      return { ...state, [root_id]: dir };
    });
    saveData("root_notes_dir", { id: root_id, dir: dir });
  }

  const memoHandleSetDirection = useCallback(handleSetDirection, []);

  let filteredArray = useMemo(
    () =>
      quranRoots.filter(
        (root: any) =>
          normalizeAlif(root.name).startsWith(searchString) ||
          root.name.startsWith(searchString) ||
          !searchString
      ),
    [quranRoots, searchString]
  );

  const fetchMoreData = () => {
    setItemsCount((state) => state + 20);
  };

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +1 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      fetchMoreData();
    }
  }

  if (loadingState) return <LoadingSpinner />;

  return (
    <div onScroll={handleScroll} style={{ overflowY: "scroll", height: "85%" }}>
      {filteredArray.slice(0, itemsCount).map((root: any) => (
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
        />
      ))}
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
  }: any) => {
    return (
      <div className="border">
        <RootButton root_name={root_name} root_id={root_id} />
        <TextForm
          inputKey={root_id}
          inputValue={value}
          isEditable={isEditable}
          inputDirection={noteDirection}
          handleSetDirection={handleSetDirection}
          handleInputChange={handleNoteChange}
          handleInputSubmit={handleNoteSubmit}
          handleEditClick={handleEditClick}
        />
      </div>
    );
  }
);

const RootButton = memo(({ root_name, root_id }: any) => {
  return (
    <div className="text-center">
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
    </div>
  );
});

export default RootsBrowser;
