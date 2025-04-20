import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import useQuran from "@/context/useQuran";

import { searchIndexProps, verseMatchResult } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import VerseContainer from "@/components/Custom/VerseContainer";

import { ButtonSidebar } from "@/components/Pages/QuranBrowser/ButtonSidebar";
import { SEARCH_METHOD } from "@/components/Pages/QuranBrowser/consts";

import {
  Box,
  Button,
  Separator,
  HStack,
  Heading,
  Text,
  StackSeparator,
  Span,
  Flex,
} from "@chakra-ui/react";

import { Tag } from "@/components/ui/tag";
import { Tooltip } from "@/components/ui/tooltip";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";
import { useBoolean } from "usehooks-ts";

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

  const memoHandleRootClick = useCallback((verse_key: string) => {
    const verseToHighlight = refListVerses.current?.querySelector(
      `[data-id="${verse_key}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });

    setSelectedVerse(verse_key);
  }, []);

  const isRootSearch = searchingMethod === SEARCH_METHOD.ROOT ? true : false;

  if (searchingChapters.length === 0) {
    return (
      <Heading p={3} size="lg" dir="auto">
        {t("select_notice")}
      </Heading>
    );
  }

  return (
    <Flex flex={1} flexDirection={"column"} p={1}>
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
      {isPending ? (
        <LoadingSpinner text="Loading verses..." />
      ) : (
        <Box dir="rtl" ref={refListVerses}>
          {stateVerses.map((verse) => (
            <VerseItem
              key={verse.key}
              verse={verse}
              isSelected={selectedVerse === verse.key}
            />
          ))}

          {searchError && (
            <SearchErrorsComponent searchMethod={searchingMethod} />
          )}
        </Box>
      )}
    </Flex>
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
    <Box>
      <Flex alignItems={"center"}>
        <ButtonSidebar />
        <Span paddingInlineStart={"0.25rem"} fontSize={"2xl"} color="blue.fg">
          {searchText}
        </Span>
      </Flex>
      {searchChapters.length !== 114 && (
        <ChaptersTags searchChapters={searchChapters} />
      )}
    </Box>
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
        <Tag
          colorPalette="teal"
          size="xl"
          variant={"solid"}
          overflow={"visible"}
          onClose={() => onClickClose(chapterID)}
          key={index}
        >
          {quranService.getChapterName(chapterID)}
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
      <Separator pb={1} borderColor={"border.emphasized"} />
      <HStack
        dir="rtl"
        wrap="wrap"
        p={2}
        separator={<StackSeparator border={"none"}>-</StackSeparator>}
      >
        {searchIndexes.map((root: searchIndexProps, index: number) => (
          <Tooltip showArrow key={index} content={root.text}>
            <Button
              px={1}
              fontSize="2xl"
              fontWeight={"bold"}
              variant="ghost"
              onClick={() => handleRootClick(root.key)}
            >{`${root.name}`}</Button>
          </Tooltip>
        ))}
      </HStack>
      <Separator mb={2} borderColor={"border.emphasized"} />
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
    <Text p={3} dir="auto" color="red.solid">
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

  const { value: isOpen, toggle } = useBoolean();

  const onClickVerseChapter = () => {
    dispatch(qbPageActions.gotoChapter(verse.suraid));
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  return (
    <Box
      data-id={verse.key}
      p={1}
      borderBottom="1px solid"
      borderColor={"border.emphasized"}
      aria-selected={isSelected}
      _selected={{ bgColor: "orange.muted" }}
    >
      <VerseContainer>
        <VerseHighlightMatches verse={verse} /> (
        <ButtonVerse
          onClick={onClickVerseChapter}
        >{`${quranService.getChapterName(verse.suraid)}:${
          verse.verseid
        }`}</ButtonVerse>
        )
        <ButtonExpand onClick={toggle} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
    </Box>
  );
};

VerseItem.displayName = "VerseItem";

export default ListSearchResults;
