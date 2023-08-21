import {
  Dispatch,
  useEffect,
  useRef,
  memo,
  useState,
  useTransition,
} from "react";

import { IconSelect } from "@tabler/icons-react";

import useQuran from "../../context/QuranContext";

import { searchIndexProps, verseProps } from "../../types";
import { qbActions, qbActionsProps, searchResult } from "./consts";

import ListSearchResults from "./ListSearchResults";
import NoteText from "../NoteText";
import LoadingSpinner from "../LoadingSpinner";

interface DisplayPanelProps {
  searchingChapters: string[];
  searchResult: searchResult[];
  searchError: boolean;
  searchingString: string;
  selectChapter: number;
  searchingMethod: string;
  searchIndexes: searchIndexProps[];
  scrollKey: string;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const DisplayPanel = memo(
  ({
    searchingChapters,
    searchResult,
    searchError,
    searchingString,
    selectChapter,
    searchingMethod,
    searchIndexes,
    scrollKey,
    dispatchQbAction,
  }: DisplayPanelProps) => {
    // memorize the Div element of the results list to use it later on to reset scrolling when a new search is submitted
    const refListVerses = useRef<HTMLDivElement>(null);

    // Reset scroll whenever we submit a new search or switch from one chapter to another
    useEffect(() => {
      if (refListVerses.current) {
        refListVerses.current.scrollTop = 0;
      }
    }, [searchResult]);

    return (
      <div className="browser-display" ref={refListVerses}>
        <div className="card browser-display-card" dir="rtl">
          {searchResult.length || searchError ? (
            <ListSearchResults
              versesArray={searchResult}
              searchToken={searchingString.trim()}
              searchError={searchError}
              searchMethod={searchingMethod}
              searchingChapters={searchingChapters}
              searchIndexes={searchIndexes}
              dispatchQbAction={dispatchQbAction}
            />
          ) : (
            <ListVerses
              selectChapter={selectChapter}
              scrollKey={scrollKey}
              dispatchQbAction={dispatchQbAction}
            />
          )}
        </div>
      </div>
    );
  }
);

DisplayPanel.displayName = "DisplayPanel";

interface ListTitleProps {
  chapterName: string;
}

const ListTitle = memo(({ chapterName }: ListTitleProps) => {
  return (
    <div className="card-header">
      <h3 className="text-primary text-center">سورة {chapterName}</h3>
    </div>
  );
});

ListTitle.displayName = "ListTitle";

interface ListVersesProps {
  selectChapter: number;
  scrollKey: string;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const ListVerses = ({
  selectChapter,

  scrollKey,

  dispatchQbAction,
}: ListVersesProps) => {
  const { chapterNames, allQuranText } = useQuran();

  const [stateVerses, setStateVerses] = useState(
    allQuranText[selectChapter - 1].verses
  );

  const [isPending, startTransition] = useTransition();

  const chapterName = chapterNames[selectChapter - 1].name;

  useEffect(() => {
    startTransition(() => {
      setStateVerses(allQuranText[selectChapter - 1].verses);
    });
  }, [selectChapter, allQuranText]);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollKey || !listRef.current) return;

    const verseToHighlight = listRef.current.querySelector(
      `[data-id="${scrollKey}"]`
    );

    if (verseToHighlight) {
      setTimeout(() => {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, [scrollKey, isPending]);

  return (
    <>
      <ListTitle chapterName={chapterName} />
      <div className="card-body browser-display-card-list" ref={listRef}>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          stateVerses.map((verse: verseProps) => (
            <div
              key={verse.key}
              data-id={verse.key}
              className={`border-bottom browser-display-card-list-item ${
                scrollKey === verse.key ? "verse-selected" : ""
              }`}
            >
              <VerseComponent
                verse={verse}
                dispatchQbAction={dispatchQbAction}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
};

ListVerses.displayName = "ListVerses";

interface VerseComponentProps {
  verse: verseProps;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const VerseComponent = memo(
  ({ verse, dispatchQbAction }: VerseComponentProps) => {
    return (
      <>
        <VerseTextComponent verse={verse} dispatchQbAction={dispatchQbAction} />
        <NoteText verseKey={verse.key} />
      </>
    );
  }
);

VerseComponent.displayName = "VerseComponent";

interface VerseTextComponentProps {
  verse: verseProps;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const VerseTextComponent = memo(
  ({ verse, dispatchQbAction }: VerseTextComponentProps) => {
    function onClickVerse() {
      dispatchQbAction(qbActions.setScrollKey(verse.key));
    }
    return (
      <div className="fs-3">
        <span>{verse.versetext} </span>
        <span className="btn-verse" onClick={onClickVerse}>
          {`(${verse.verseid})`}
        </span>
        <button
          className="btn"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={"#collapseExample" + verse.key}
          aria-expanded="false"
          aria-controls={"collapseExample" + verse.key}
        >
          <IconSelect />
        </button>
      </div>
    );
  }
);

VerseTextComponent.displayName = "VerseTextComponent";

export default DisplayPanel;
