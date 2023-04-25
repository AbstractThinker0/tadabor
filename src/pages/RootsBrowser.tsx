import {
  Dispatch,
  Fragment,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { dbFuncs } from "../util/db";

import { toast } from "react-toastify";

import LoadingSpinner from "../components/LoadingSpinner";
import useQuran from "../context/QuranContext";
import { normalizeAlif } from "../util/util";

import { TextForm } from "../components/TextForm";

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
    <div className="roots">
      <FormWordSearch
        searchString={searchString}
        setSearchString={setSearchString}
      />

      <RootsListComponent searchString={searchString} />
    </div>
  );
}

interface FormWordSearchProps {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
}

const FormWordSearch = ({
  searchString,
  setSearchString,
}: FormWordSearchProps) => {
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

interface RootsListComponentProps {
  searchString: string;
}

const RootsListComponent = memo(({ searchString }: RootsListComponentProps) => {
  interface notesType {
    [key: string]: string;
  }

  interface notesDirType {
    [key: string]: string; // "rtl" | "ltr";
  }

  interface markedNotesType {
    [key: string]: boolean;
  }

  const { t } = useTranslation();
  const { quranRoots } = useQuran();
  const [loadingState, setLoadingState] = useState(true);

  const [myNotes, setMyNotes] = useState<notesType>({});
  const [editableNotes, setEditableNotes] = useState<markedNotesType>({});
  const [areaDirection, setAreaDirection] = useState<notesDirType>({});
  const [itemsCount, setItemsCount] = useState(100);

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      const userNotes = await dbFuncs.loadRootNotes();

      if (clientLeft) return;

      const markedNotes: markedNotesType = {};

      const extractNotes: notesType = {};
      userNotes.forEach((note) => {
        extractNotes[note.id] = note.text;
        markedNotes[note.id] = false;
      });

      const userNotesDir = await dbFuncs.loadRootNotesDir();

      if (clientLeft) return;

      const extractNotesDir: notesDirType = {};

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

  function handleNoteChange(name: string, value: string) {
    setMyNotes((state) => {
      return { ...state, [name]: value };
    });
  }

  function handleNoteSubmit(key: string, value: string) {
    setEditableNotes((state) => {
      return { ...state, [key]: false };
    });

    dbFuncs
      .saveRootNote({
        id: key,
        text: value,
        date_created: Date.now(),
        date_modified: Date.now(),
      })
      .then(function () {
        toast.success(t("save_success") as string);
      })
      .catch(function () {
        toast.success(t("save_failed") as string);
      });
  }

  const memoHandleNoteSubmit = useCallback(handleNoteSubmit, [t]);

  const memoHandleEditClick = useCallback(handleEditClick, []);

  function handleEditClick(rootID: string) {
    setEditableNotes((state) => {
      return { ...state, [rootID]: true };
    });
  }

  function handleSetDirection(root_id: string, dir: string) {
    setAreaDirection((state) => {
      return { ...state, [root_id]: dir };
    });
    dbFuncs.saveRootNoteDir({ id: root_id, dir: dir });
  }

  const memoHandleSetDirection = useCallback(handleSetDirection, []);

  const filteredArray = useMemo(
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

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      fetchMoreData();
    }
  }

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="roots-list" onScroll={handleScroll}>
      {filteredArray.slice(0, itemsCount).map((root) => (
        <RootComponent
          key={root.id}
          root_name={root.name}
          root_id={root.id.toString()}
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

interface RootComponentProps {
  root_name: string;
  root_id: string;
  noteDirection: string;
  value: string;
  handleSetDirection: (verse_key: string, dir: string) => void;
  handleNoteChange: (key: string, value: string) => void;
  isEditable: boolean;
  handleEditClick: (key: string) => void;
  handleNoteSubmit: (key: string, value: string) => void;
}

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
  }: RootComponentProps) => {
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

interface RootButtonProps {
  root_name: string;
  root_id: string;
}

const RootButton = memo(({ root_name, root_id }: RootButtonProps) => {
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
