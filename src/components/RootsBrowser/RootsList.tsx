import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { useTranslation } from "react-i18next";

import { dbFuncs } from "@/util/db";

import { toast } from "react-toastify";

import LoadingSpinner from "@/components/LoadingSpinner";
import useQuran from "@/context/QuranContext";
import { hasAllLetters, normalizeAlif, getRootMatches } from "@/util/util";

import { TextForm } from "@/components/TextForm";
import {
  markedNotesType,
  notesDirectionType,
  notesType,
  rootProps,
  verseMatchResult,
  searchIndexProps,
} from "@/types";
import { IconSelect } from "@tabler/icons-react";
import { Tooltip } from "bootstrap";
import NoteText from "@/components/NoteText";

interface RootsListProps {
  searchInclusive: boolean;
  searchString: string;
}

const RootsList = memo(({ searchString, searchInclusive }: RootsListProps) => {
  const { t } = useTranslation();
  const { quranRoots } = useQuran();
  const [loadingState, setLoadingState] = useState(true);

  const [myNotes, setMyNotes] = useState<notesType>({});
  const [editableNotes, setEditableNotes] = useState<markedNotesType>({});
  const [areaDirection, setAreaDirection] = useState<notesDirectionType>({});
  const [itemsCount, setItemsCount] = useState(80);

  const [stateRoots, setStateRoots] = useState<rootProps[]>([]);

  const [isPending, startTransition] = useTransition();

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

      const extractNotesDir: notesDirectionType = {};

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

  useEffect(() => {
    startTransition(() => {
      setStateRoots(
        quranRoots.filter(
          (root) =>
            normalizeAlif(root.name).startsWith(searchString) ||
            root.name.startsWith(searchString) ||
            !searchString ||
            (searchInclusive && hasAllLetters(root.name, searchString))
        )
      );
    });
  }, [searchString, searchInclusive]);

  const fetchMoreData = () => {
    setItemsCount((state) => state + 15);
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
      {isPending ? (
        <LoadingSpinner />
      ) : (
        stateRoots
          .slice(0, itemsCount)
          .map((root) => (
            <RootComponent
              key={root.id}
              root_occurences={root.occurences}
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
          ))
      )}
    </div>
  );
});

interface RootComponentProps {
  root_occurences: string[];
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
    root_occurences,
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
    const { t } = useTranslation();

    return (
      <div className="roots-list-item border">
        <div className="roots-list-item-title fs-4">
          <div className="roots-list-item-title-pc">placeholder</div>
          <div className="roots-list-item-title-text">{root_name}</div>
          <div className="roots-list-item-title-btns">
            <RootButton root_id={root_id} />
            <button
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={"#collapseOccs" + root_id}
              aria-expanded="false"
              aria-controls={"collapseOccs" + root_id}
              className="btn roots-list-item-title-btns-derivations"
              value={root_id}
            >
              {t("derivations")}
            </button>
          </div>
        </div>
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
        <RootOccurences root_id={root_id} root_occurences={root_occurences} />
      </div>
    );
  }
);

interface RootButtonProps {
  root_id: string;
}

const RootButton = memo(({ root_id }: RootButtonProps) => {
  return (
    <button
      type="button"
      data-bs-toggle="collapse"
      data-bs-target={"#collapseExample" + root_id}
      aria-expanded="false"
      aria-controls={"collapseExample" + root_id}
      className="btn "
      value={root_id}
    >
      <IconSelect />
    </button>
  );
});

interface RootOccurencesProps {
  root_occurences: string[];
  root_id: string;
}

const RootOccurences = ({ root_occurences, root_id }: RootOccurencesProps) => {
  const { chapterNames, absoluteQuran } = useQuran();
  const [isShown, setIsShown] = useState(false);
  const [itemsCount, setItemsCount] = useState(20);
  const refCollapse = useRef<HTMLDivElement>(null);
  const [scrollKey, setScrollKey] = useState("");

  useEffect(() => {
    const collapseElement = refCollapse.current;
    function onShowRoots() {
      setIsShown(true);
    }

    function onHiddenRoots() {
      setIsShown(false);
    }

    if (collapseElement !== null) {
      collapseElement.addEventListener("show.bs.collapse", onShowRoots);
      collapseElement.addEventListener("hidden.bs.collapse", onHiddenRoots);
    }

    return () => {
      if (collapseElement !== null) {
        collapseElement.removeEventListener("show.bs.collapse", onShowRoots);
        collapseElement.removeEventListener(
          "hidden.bs.collapse",
          onHiddenRoots
        );
      }
    };
  }, []);

  function onScrollOccs(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setItemsCount((state) => state + 10);
    }
  }

  const derivations: searchIndexProps[] = [];

  const rootVerses: verseMatchResult[] = [];

  root_occurences.forEach((occ) => {
    const occData = occ.split(":");
    const verse = absoluteQuran[Number(occData[0])];
    const wordIndexes = occData[1].split(",");
    const verseWords = verse.versetext.split(" ");

    const chapterName = chapterNames[Number(verse.suraid) - 1].name;
    const verseDerivations = wordIndexes.map((wordIndex) => ({
      name: verseWords[Number(wordIndex) - 1],
      key: verse.key,
      text: `${chapterName}:${verse.verseid}`,
      wordIndex,
    }));

    derivations.push(...verseDerivations);

    const verseParts = getRootMatches(verseWords, wordIndexes);

    rootVerses.push({
      verseParts,
      key: verse.key,
      suraid: verse.suraid,
      verseid: verse.verseid,
    });
  });

  const slicedItems = rootVerses.slice(0, itemsCount);

  function handleDerivationClick(verseKey: string, verseIndex: number) {
    if (itemsCount < verseIndex + 20) {
      setItemsCount(verseIndex + 20);
    }
    setScrollKey(verseKey);
  }

  useEffect(() => {
    if (!scrollKey) return;

    if (!refCollapse.current) return;

    const verseToHighlight = refCollapse.current.querySelector(
      `[data-child-id="${scrollKey}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [scrollKey]);

  return (
    <div ref={refCollapse} className="collapse" id={`collapseOccs${root_id}`}>
      {isShown && (
        <div
          className="roots-list-item-verses p-3"
          onScroll={onScrollOccs}
          dir="rtl"
        >
          <DerivationsComponent
            searchIndexes={derivations}
            handleDerivationClick={handleDerivationClick}
          />
          {slicedItems.map((verse) => (
            <div
              key={verse.key}
              className={`roots-list-item-verses-item ${
                scrollKey === verse.key
                  ? "roots-list-item-verses-item-selected"
                  : ""
              }`}
              data-child-id={verse.key}
            >
              <RootVerse rootVerse={verse} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface DerivationsComponentProps {
  handleDerivationClick: (verseKey: string, verseIndex: number) => void;
  searchIndexes: searchIndexProps[];
}

const DerivationsComponent = memo(
  ({ searchIndexes, handleDerivationClick }: DerivationsComponentProps) => {
    const refListRoots = useRef<HTMLSpanElement>(null);
    useEffect(() => {
      if (!refListRoots.current) return;

      //init tooltip
      const tooltipArray = Array.from(
        refListRoots.current.querySelectorAll('[data-bs-toggle="tooltip"]')
      ).map((tooltipNode) => new Tooltip(tooltipNode));

      return () => {
        tooltipArray.forEach((tooltip) => tooltip.dispose());
      };
    }, [searchIndexes]);

    return (
      <div className="p-2">
        <span ref={refListRoots} className="">
          {searchIndexes.map((root: searchIndexProps, index: number) => (
            <span
              role="button"
              key={index}
              onClick={() => handleDerivationClick(root.key, index)}
              data-bs-toggle="tooltip"
              data-bs-title={root.text}
            >
              {`${index ? " -" : " "} ${root.name}`}
            </span>
          ))}
        </span>
        <hr />
      </div>
    );
  }
);

DerivationsComponent.displayName = "DerivationsComponent";

interface RootVerseProps {
  rootVerse: verseMatchResult;
}

const RootVerse = ({ rootVerse }: RootVerseProps) => {
  const { chapterNames } = useQuran();

  const verseChapter = chapterNames[Number(rootVerse.suraid) - 1].name;

  return (
    <>
      <span>
        {rootVerse.verseParts.map((part, i) => (
          <Fragment key={i}>
            {part.isMatch ? <mark>{part.text}</mark> : part.text}{" "}
          </Fragment>
        ))}
        <span className="roots-list-item-verses-item-text-chapter">{`(${verseChapter}:${rootVerse.verseid})`}</span>
        <button
          className="btn"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapseExample${rootVerse.key}child`}
          aria-expanded="false"
          aria-controls={`collapseExample${rootVerse.key}child`}
        >
          <IconSelect />
        </button>
      </span>
      <NoteText verseKey={rootVerse.key} targetID={`${rootVerse.key}child`} />
    </>
  );
};

export default RootsList;
