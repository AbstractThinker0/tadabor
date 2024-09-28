import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import useQuran from "@/context/useQuran";

import { searchIndexProps, verseMatchResult } from "@/types";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import VerseContainer from "@/components/Custom/VerseContainer";

import { SEARCH_METHOD } from "@/components/Pages/QuranBrowser/consts";

import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Tooltip,
  useBoolean,
} from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

interface ListSearchResultsProps {
  versesArray: verseMatchResult[];
  searchError: boolean;
}

const ListSearchResults = ({
  versesArray,
  searchError,
}: ListSearchResultsProps) => {
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
            <VerseItem
              key={verse.key}
              verse={verse}
              isSelected={selectedVerse === verse.key}
            />
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

  return (
    <div dir="auto">
      <Heading pb={3} size="xl" color="blue.600">
        {searchText}
      </Heading>
      {searchChapters.length !== 114 && (
        <ChaptersTags searchChapters={searchChapters} />
      )}
    </div>
  );
};

const ChaptersTags = ({ searchChapters }: { searchChapters: string[] }) => {
  const quranService = useQuran();
  const dispatch = useAppDispatch();

  const searchMethod = useAppSelector((state) => state.qbPage.searchMethod);

  const onClickClose = (chapterID: string) => {
    dispatch(qbPageActions.toggleSelectChapter(Number(chapterID)));

    if (searchMethod === SEARCH_METHOD.ROOT) {
      dispatch(qbPageActions.submitRootSearch({ quranInstance: quranService }));
    } else {
      dispatch(qbPageActions.submitWordSearch({ quranInstance: quranService }));
    }
  };

  return (
    <HStack py={1} wrap={"wrap"}>
      {searchChapters.map((chapterID, index) => (
        <Tag colorScheme="green" size="lg" variant={"solid"} key={index}>
          <TagLabel>{quranService.getChapterName(chapterID)}</TagLabel>
          <TagCloseButton onClick={() => onClickClose(chapterID)} />
        </Tag>
      ))}
    </HStack>
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
      <Divider pb={1} borderColor={"gray"} />
      <HStack wrap="wrap" p={2} divider={<>-</>}>
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
      <Divider mb={2} borderColor={"gray"} />
    </>
  );
};

DerivationsComponent.displayName = "DerivationsComponent";

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

interface VerseItemProps {
  verse: verseMatchResult;
  isSelected: boolean;
}

const VerseItem = ({ verse, isSelected }: VerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const [isOpen, setOpen] = useBoolean();

  const onClickVerseChapter = () => {
    dispatch(qbPageActions.gotoChapter(verse.suraid));
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  return (
    <Box
      data-id={verse.key}
      p={1}
      borderBottom="1px solid gainsboro"
      backgroundColor={isSelected ? "bisque" : undefined}
    >
      <VerseContainer>
        <VerseHighlightMatches verse={verse} /> (
        <ButtonVerse
          onClick={onClickVerseChapter}
        >{`${quranService.getChapterName(verse.suraid)}:${
          verse.verseid
        }`}</ButtonVerse>
        )
        <ButtonExpand onClick={setOpen.toggle} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
    </Box>
  );
};

VerseItem.displayName = "VerseItem";

export default ListSearchResults;
