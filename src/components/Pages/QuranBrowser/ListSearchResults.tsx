import { useEffect, useRef, useState, useTransition } from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import useQuran from "@/context/useQuran";

import type { verseMatchResult } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { SearchVerseItem } from "@/components/Pages/QuranBrowser/VerseItem";
import { ButtonSidebar } from "@/components/Pages/QuranBrowser/ButtonSidebar";
import { SEARCH_METHOD } from "@/components/Pages/QuranBrowser/consts";

import { DerivationsComponent } from "@/components/Custom/DerivationsComponent";

import {
  Box,
  HStack,
  Heading,
  Text,
  Span,
  Flex,
  Separator,
} from "@chakra-ui/react";

import { Tag } from "@/components/ui/tag";

interface ListSearchResultsProps {
  versesArray: verseMatchResult[];
  searchError: boolean;
}

const ListSearchResults = ({
  versesArray,
  searchError,
}: ListSearchResultsProps) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [isPending, startTransition] = useTransition();

  const [stateVerses, setStateVerse] = useState<verseMatchResult[]>([]);

  const refListVerses = useRef<HTMLDivElement>(null);

  const scrollKey = useAppSelector((state) => state.qbPage.scrollKey);

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

  const handleDerivationClick = (verse_key: string) => {
    dispatch(qbPageActions.setScrollKey(verse_key));
  };

  useEffect(() => {
    if (scrollKey && refListVerses.current) {
      const verseToHighlight = refListVerses.current.querySelector(
        `[data-id="${scrollKey}"]`
      ) as HTMLDivElement;

      if (!verseToHighlight) return;

      verseToHighlight.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [scrollKey]);

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
        <>
          <Separator pb={1} borderColor={"border.emphasized"} />
          <DerivationsComponent
            handleDerivationClick={handleDerivationClick}
            searchIndexes={searchIndexes}
          />
          <Separator mb={2} borderColor={"border.emphasized"} />
        </>
      )}
      {isPending ? (
        <LoadingSpinner text="Loading verses..." />
      ) : (
        <Box dir="rtl" ref={refListVerses}>
          {stateVerses.map((verse, index) => (
            <SearchVerseItem
              key={verse.key}
              verse={verse}
              isSelected={scrollKey === verse.key}
              index={index}
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

export default ListSearchResults;
