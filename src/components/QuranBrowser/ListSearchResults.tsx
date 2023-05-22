import {
  Dispatch,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  SEARCH_METHOD,
  SEARCH_SCOPE,
  qbActions,
  qbActionsProps,
  searchIndexProps,
  searchResult,
} from "./consts";
import useQuran from "../../context/QuranContext";
import { Tooltip } from "bootstrap";
import NoteText from "../NoteText";
import { useTranslation } from "react-i18next";
import { IconCircleArrowDownFilled } from "@tabler/icons-react";

interface ListSearchResultsProps {
  versesArray: searchResult[];
  searchToken: string;
  searchingScope: SEARCH_SCOPE;
  searchError: boolean;
  selectedRootError: boolean;
  searchMethod: string;
  searchingChapters: string[];
  searchIndexes: searchIndexProps[];
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const ListSearchResults = ({
  versesArray,
  searchToken,
  searchError,
  selectedRootError,
  searchMethod,
  searchingChapters,
  searchIndexes,
  searchingScope,
  dispatchQbAction,
}: ListSearchResultsProps) => {
  const { chapterNames } = useQuran();
  const [selectedVerse, setSelectedVerse] = useState("");

  const refListVerses = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedVerse("");
  }, [searchIndexes]);

  function handleRootClick(verse_key: string) {
    const verseToHighlight = refListVerses.current?.querySelector(
      `[data-id="${verse_key}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });

    setSelectedVerse(verse_key);
  }

  const memoHandleRootClick = useCallback(handleRootClick, []);

  const isRootSearch = searchMethod === SEARCH_METHOD.ROOT ? true : false;

  return (
    <>
      <SearchTitle
        searchMethod={searchMethod}
        searchToken={searchToken}
        searchingScope={searchingScope}
        searchChapters={searchingChapters}
      />
      {isRootSearch && (
        <DerivationsComponent
          handleRootClick={memoHandleRootClick}
          searchIndexes={searchIndexes}
        />
      )}
      <div className="card-body" ref={refListVerses}>
        {versesArray.map((verse) => (
          <div
            key={verse.key}
            data-id={verse.key}
            className={`border-bottom pt-1 pb-1 ${
              verse.key === selectedVerse ? "verse-selected" : ""
            }`}
          >
            <SearchVerseComponent
              verse={verse}
              searchingScope={searchingScope}
              verseChapter={chapterNames[Number(verse.suraid) - 1].name}
              dispatchQbAction={dispatchQbAction}
            />
          </div>
        ))}
        {(searchError || selectedRootError) && (
          <SearchErrorsComponent
            searchError={searchError}
            selectedRootError={selectedRootError}
          />
        )}
      </div>
    </>
  );
};

ListSearchResults.displayName = "ListSearchResults";

interface SearchTitleProps {
  searchMethod: string;
  searchToken: string;
  searchingScope: SEARCH_SCOPE;
  searchChapters: string[];
}

const SearchTitle = memo(
  ({
    searchMethod,
    searchToken,
    searchingScope,
    searchChapters,
  }: SearchTitleProps) => {
    const { t } = useTranslation();

    const searchType =
      searchMethod === SEARCH_METHOD.ROOT ? t("root") : t("word");

    const searchScopeText =
      searchingScope === SEARCH_SCOPE.ALL_CHAPTERS
        ? t("search_chapters_all")
        : t("search_chapters");

    const searchText = `${t(
      "search_result"
    )} ${searchType} "${searchToken}" ${searchScopeText}`;

    const ChaptersList = ({ searchChapters }: { searchChapters: string[] }) => {
      return (
        <>
          {searchChapters.map((chapterName, index) => (
            <span className="browser-display-card-search-chapter" key={index}>
              {chapterName}
            </span>
          ))}
        </>
      );
    };

    return (
      <div className="browser-display-card-search" dir="auto">
        <h3>{searchText}</h3>
        {searchingScope !== SEARCH_SCOPE.ALL_CHAPTERS && (
          <ChaptersList searchChapters={searchChapters} />
        )}
      </div>
    );
  }
);

SearchTitle.displayName = "SearchTitle";

interface DerivationsComponentProps {
  handleRootClick: (verse_key: string) => void;
  searchIndexes: searchIndexProps[];
}

const DerivationsComponent = memo(
  ({ searchIndexes, handleRootClick }: DerivationsComponentProps) => {
    const refListRoots = useRef<HTMLSpanElement>(null);
    useEffect(() => {
      if (!refListRoots.current) return;

      //init tooltip
      Array.from(
        refListRoots.current.querySelectorAll('[data-bs-toggle="tooltip"]')
      ).forEach((tooltipNode) => new Tooltip(tooltipNode));
    }, [searchIndexes]);

    return (
      <>
        <hr />
        <span ref={refListRoots} className="p-2">
          {searchIndexes.map((root: searchIndexProps, index: number) => (
            <span
              role="button"
              key={index}
              onClick={(e) => handleRootClick(root.key)}
              data-bs-toggle="tooltip"
              data-bs-title={root.text}
            >
              {index ? " -" : " "} {root.name}
            </span>
          ))}
        </span>
        <hr />
      </>
    );
  }
);

DerivationsComponent.displayName = "DerivationsComponent";

interface SearchVerseComponentProps {
  verse: searchResult;
  searchingScope: SEARCH_SCOPE;
  verseChapter: string;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const SearchVerseComponent = memo(
  ({
    verse,
    searchingScope,
    verseChapter,
    dispatchQbAction,
  }: SearchVerseComponentProps) => {
    return (
      <>
        <VerseContentComponent
          verse={verse}
          searchingScope={searchingScope}
          verseChapter={verseChapter}
          dispatchQbAction={dispatchQbAction}
        />
        <NoteText verseKey={verse.key} />
      </>
    );
  }
);

SearchVerseComponent.displayName = "SearchVerseComponent";

interface SearchErrorsComponentProps {
  searchError: boolean;
  selectedRootError: boolean;
}

const SearchErrorsComponent = ({
  searchError,
  selectedRootError,
}: SearchErrorsComponentProps) => {
  const { t } = useTranslation();
  return (
    <div dir="auto">
      {searchError && <p className="mt-3 text-danger">{t("search_fail")}</p>}
      {selectedRootError && (
        <p className="mt-3 text-danger">{t("search_root_error")}</p>
      )}
    </div>
  );
};

interface VerseContentComponentProps {
  verse: searchResult;
  searchingScope: SEARCH_SCOPE;
  verseChapter: string;
  dispatchQbAction: Dispatch<qbActionsProps>;
}

const VerseContentComponent = memo(
  ({
    verse,
    searchingScope,
    verseChapter,
    dispatchQbAction,
  }: VerseContentComponentProps) => {
    const verse_key = verse.key;
    const isLinkable =
      searchingScope === SEARCH_SCOPE.ALL_CHAPTERS ||
      searchingScope === SEARCH_SCOPE.MULTIPLE_CHAPTERS;

    function gotoChapter(chapter: string) {
      dispatchQbAction(qbActions.gotoChapter(chapter));
    }

    const handleVerseClick = (verse_key: string) => {
      gotoChapter(verse.suraid);
      dispatchQbAction(qbActions.setScrollKey(verse_key));
    };

    return (
      <span className="fs-4">
        <HighlightedText verse={verse} /> (
        {isLinkable ? (
          <button
            className="p-0 border-0 bg-transparent"
            onClick={(e) => handleVerseClick(verse_key)}
          >
            {verseChapter + ":" + verse.verseid}
          </button>
        ) : (
          <button
            className="p-0 border-0 bg-transparent"
            onClick={(e) => handleVerseClick(verse_key)}
          >
            {verse.verseid}
          </button>
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
          <IconCircleArrowDownFilled />
        </button>
      </span>
    );
  }
);

VerseContentComponent.displayName = "VerseContentComponent";

interface HighlightedTextProps {
  verse: searchResult;
}

const HighlightedText = ({ verse }: HighlightedTextProps) => {
  const verseParts = verse.verseParts;

  return (
    <>
      {verseParts.map((part, i) => {
        const isHighlighted = part.highlight;

        return (
          <Fragment key={i}>
            {isHighlighted ? <mark>{part.text}</mark> : part.text}
          </Fragment>
        );
      })}
    </>
  );
};

export default ListSearchResults;
