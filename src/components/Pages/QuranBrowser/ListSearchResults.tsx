import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import useQuran from "@/context/useQuran";

import { searchIndexProps, verseMatchResult } from "@/types";

import { Tooltip } from "bootstrap";

import { ExpandButton } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import NoteText from "@/components/Custom/NoteText";
import VerseContainer from "@/components/Custom/VerseContainer";

import { SEARCH_METHOD } from "@/components/Pages/QuranBrowser/consts";

interface ListSearchResultsProps {
  versesArray: verseMatchResult[];
  searchToken: string;
  searchError: boolean;
  searchMethod: string;
  searchingChapters: string[];
  searchIndexes: searchIndexProps[];
}

const ListSearchResults = ({
  versesArray,
  searchToken,
  searchError,
  searchMethod,
  searchingChapters,
  searchIndexes,
}: ListSearchResultsProps) => {
  const quranService = useQuran();
  const { t } = useTranslation();
  const [selectedVerse, setSelectedVerse] = useState("");

  const [isPending, startTransition] = useTransition();

  const [stateVerses, setStateVerse] = useState<verseMatchResult[]>([]);

  const refListVerses = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startTransition(() => {
      setStateVerse(versesArray);
    });
  }, [versesArray]);

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

  if (searchingChapters.length === 0) {
    return (
      <h3 className="p-1" dir="auto">
        {t("select_notice")}
      </h3>
    );
  }

  return (
    <>
      <SearchTitle
        searchMethod={searchMethod}
        searchToken={searchToken}
        searchChapters={searchingChapters}
      />
      {isRootSearch && (
        <DerivationsComponent
          handleRootClick={memoHandleRootClick}
          searchIndexes={searchIndexes}
        />
      )}
      <div className="card-body browser-display-card-list" ref={refListVerses}>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          stateVerses.map((verse) => (
            <div
              key={verse.key}
              data-id={verse.key}
              className={`border-bottom browser-display-card-list-item ${
                verse.key === selectedVerse ? "verse-selected" : ""
              }`}
            >
              <SearchVerseComponent
                verse={verse}
                verseChapter={quranService.getChapterName(verse.suraid)}
              />
            </div>
          ))
        )}
        {searchError && <SearchErrorsComponent searchMethod={searchMethod} />}
      </div>
    </>
  );
};

ListSearchResults.displayName = "ListSearchResults";

interface SearchTitleProps {
  searchMethod: string;
  searchToken: string;
  searchChapters: string[];
}

const SearchTitle = ({
  searchMethod,
  searchToken,
  searchChapters,
}: SearchTitleProps) => {
  const { t } = useTranslation();

  const searchType =
    searchMethod === SEARCH_METHOD.ROOT ? t("root") : t("word");

  const searchScopeText =
    searchChapters.length === 114
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
      {searchChapters.length !== 114 && (
        <ChaptersList searchChapters={searchChapters} />
      )}
    </div>
  );
};

SearchTitle.displayName = "SearchTitle";

interface DerivationsComponentProps {
  handleRootClick: (verse_key: string) => void;
  searchIndexes: searchIndexProps[];
}

const DerivationsComponent = ({
  searchIndexes,
  handleRootClick,
}: DerivationsComponentProps) => {
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
            onClick={() => handleRootClick(root.key)}
            data-bs-toggle="tooltip"
            data-bs-title={root.text}
          >
            {`${index ? " -" : " "} ${root.name}`}
          </span>
        ))}
      </span>
      <hr />
    </>
  );
};

DerivationsComponent.displayName = "DerivationsComponent";

interface SearchVerseComponentProps {
  verse: verseMatchResult;
  verseChapter: string;
}

const SearchVerseComponent = ({
  verse,
  verseChapter,
}: SearchVerseComponentProps) => {
  return (
    <>
      <VerseContentComponent verse={verse} verseChapter={verseChapter} />
      <NoteText verseKey={verse.key} />
    </>
  );
};

SearchVerseComponent.displayName = "SearchVerseComponent";

interface SearchErrorsComponentProps {
  searchMethod: string;
}

const SearchErrorsComponent = ({
  searchMethod,
}: SearchErrorsComponentProps) => {
  const { t } = useTranslation();
  return (
    <div dir="auto">
      <p className="mt-3 text-danger">
        {searchMethod === SEARCH_METHOD.WORD
          ? t("search_fail")
          : t("search_root_error")}
      </p>
    </div>
  );
};

interface VerseContentComponentProps {
  verse: verseMatchResult;
  verseChapter: string;
}

const VerseContentComponent = ({
  verse,
  verseChapter,
}: VerseContentComponentProps) => {
  const dispatch = useAppDispatch();
  const verse_key = verse.key;

  function gotoChapter(chapter: string) {
    dispatch(qbPageActions.gotoChapter(chapter));
  }

  const handleVerseClick = (verse_key: string) => {
    gotoChapter(verse.suraid);
    dispatch(qbPageActions.setScrollKey(verse_key));
  };

  return (
    <>
      <VerseContainer>
        <VerseHighlightMatches verse={verse} /> (
        <button
          className="p-0 border-0 bg-transparent btn-verse"
          onClick={() => handleVerseClick(verse_key)}
        >
          {`${verseChapter}:${verse.verseid}`}
        </button>
        )
      </VerseContainer>
      <ExpandButton identifier={verse_key} />
    </>
  );
};

VerseContentComponent.displayName = "VerseContentComponent";

export default ListSearchResults;
