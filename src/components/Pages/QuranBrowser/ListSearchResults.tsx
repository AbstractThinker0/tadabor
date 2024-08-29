import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import useQuran from "@/context/useQuran";

import { searchIndexProps, verseMatchResult } from "@/types";

import { ExpandButton } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import NoteText from "@/components/Custom/NoteText";
import VerseContainer from "@/components/Custom/VerseContainer";

import { SEARCH_METHOD } from "@/components/Pages/QuranBrowser/consts";
import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Tag,
  Text,
  Tooltip,
} from "@chakra-ui/react";

interface ListSearchResultsProps {
  versesArray: verseMatchResult[];
  searchError: boolean;
}

const ListSearchResults = ({
  versesArray,
  searchError,
}: ListSearchResultsProps) => {
  const quranService = useQuran();
  const { t } = useTranslation();
  const [selectedVerse, setSelectedVerse] = useState("");

  const [isPending, startTransition] = useTransition();

  const [stateVerses, setStateVerse] = useState<verseMatchResult[]>([]);

  const refListVerses = useRef<HTMLDivElement>(null);

  const searchingChapters = useAppSelector(
    (state) => state.qbPage.searchingChapters
  );

  const searchingMethod = useAppSelector(
    (state) => state.qbPage.searchingMethod
  );

  const searchIndexes = useAppSelector((state) => state.qbPage.searchIndexes);

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

  const isRootSearch = searchingMethod === SEARCH_METHOD.ROOT ? true : false;

  if (searchingChapters.length === 0) {
    return (
      <Heading p={3} size="md" dir="auto">
        {t("select_notice")}
      </Heading>
    );
  }

  return (
    <Box p={1}>
      <SearchTitle
        searchMethod={searchingMethod}
        searchChapters={searchingChapters}
      />
      {isRootSearch && (
        <DerivationsComponent
          handleRootClick={memoHandleRootClick}
          searchIndexes={searchIndexes}
        />
      )}
      <Box ref={refListVerses}>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          stateVerses.map((verse) => (
            <Box
              key={verse.key}
              data-id={verse.key}
              p={1}
              borderBottom="1px solid gainsboro"
              backgroundColor={
                verse.key === selectedVerse ? "bisque" : undefined
              }
            >
              <SearchVerseComponent
                verse={verse}
                verseChapter={quranService.getChapterName(verse.suraid)}
              />
            </Box>
          ))
        )}
        {searchError && (
          <SearchErrorsComponent searchMethod={searchingMethod} />
        )}
      </Box>
    </Box>
  );
};

ListSearchResults.displayName = "ListSearchResults";

interface SearchTitleProps {
  searchMethod: string;
  searchChapters: string[];
}

const SearchTitle = ({ searchMethod, searchChapters }: SearchTitleProps) => {
  const searchingString = useAppSelector(
    (state) => state.qbPage.searchingString
  );

  const { t } = useTranslation();

  const searchType =
    searchMethod === SEARCH_METHOD.ROOT ? t("root") : t("word");

  const searchScopeText =
    searchChapters.length === 114
      ? t("search_chapters_all")
      : t("search_chapters");

  const searchText = `${t(
    "search_result"
  )} ${searchType} "${searchingString}" ${searchScopeText}`;

  const ChaptersList = ({ searchChapters }: { searchChapters: string[] }) => {
    return (
      <HStack pt={1} wrap={"wrap"}>
        {searchChapters.map((chapterName, index) => (
          <Tag colorScheme="green" size="lg" variant={"solid"} key={index}>
            {chapterName}
          </Tag>
        ))}
      </HStack>
    );
  };

  return (
    <div dir="auto">
      <Heading size="md">{searchText}</Heading>
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
  return (
    <>
      <Divider />
      <HStack wrap="wrap" px={2} divider={<>-</>}>
        {searchIndexes.map((root: searchIndexProps, index: number) => (
          <Tooltip hasArrow key={index} label={root.text}>
            <Button
              px={2}
              fontSize="xl"
              variant="ghost"
              onClick={() => handleRootClick(root.key)}
            >{`${root.name}`}</Button>
          </Tooltip>
        ))}
      </HStack>
      <Divider />
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
    <Text p={3} dir="auto" color="rgb(220, 53, 69)">
      {searchMethod === SEARCH_METHOD.WORD
        ? t("search_fail")
        : t("search_root_error")}
    </Text>
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
        <Button
          userSelect="text"
          variant="ghost"
          size="lg"
          onClick={() => handleVerseClick(verse_key)}
          _hover={{ color: "cornflowerblue" }}
        >
          {`${verseChapter}:${verse.verseid}`}
        </Button>
        )
      </VerseContainer>
      <ExpandButton identifier={verse_key} />
    </>
  );
};

VerseContentComponent.displayName = "VerseContentComponent";

export default ListSearchResults;
