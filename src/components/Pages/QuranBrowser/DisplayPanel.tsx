import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";

import { verseProps } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import ListSearchResults from "@/components/Pages/QuranBrowser/ListSearchResults";
import VerseItem from "@/components/Pages/QuranBrowser/VerseItem";
import { Box, Flex, Heading } from "@chakra-ui/react";

const DisplayPanel = () => {
  const dispatch = useAppDispatch();
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  const searchResult = useAppSelector((state) => state.qbPage.searchResult);
  const searchError = useAppSelector((state) => state.qbPage.searchError);

  // memorize the Div element of the results list to use it later on to reset scrolling when a new search is submitted
  const refListVerses = useRef<HTMLDivElement>(null);

  // Reset scroll whenever we submit a new search or switch from one chapter to another
  useEffect(() => {
    if (refListVerses.current) {
      refListVerses.current.scrollTop = 0;
    }
  }, [searchResult]);

  useEffect(() => {
    dispatch(fetchVerseNotes());
  }, []);

  return (
    <Box
      flex={1}
      overflowY="scroll"
      minH="100%"
      p={1}
      pt={2}
      ref={refListVerses}
    >
      {isVNotesLoading ? (
        <LoadingSpinner text="Loading verse notes..." />
      ) : (
        <Flex
          flexDir="column"
          minH="100%"
          bgColor={"brand.contrast"}
          borderRadius={5}
          dir="rtl"
          border={"1px solid"}
          borderColor={"border.emphasized"}
        >
          {searchResult.length || searchError ? (
            <ListSearchResults
              versesArray={searchResult}
              searchError={searchError}
            />
          ) : (
            <ListVerses />
          )}
        </Flex>
      )}
    </Box>
  );
};

DisplayPanel.displayName = "DisplayPanel";

interface ListTitleProps {
  chapterName: string;
}

const ListTitle = ({ chapterName }: ListTitleProps) => {
  return (
    <Heading
      textAlign="center"
      bgColor={"bg.muted"}
      color={"blue.focusRing"}
      py={3}
      size="3xl"
      border={"1px solid"}
      borderColor={"border.emphasized"}
      fontWeight="500"
    >
      سورة {chapterName}
    </Heading>
  );
};

ListTitle.displayName = "ListTitle";

const ListVerses = () => {
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  const scrollKey = useAppSelector((state) => state.qbPage.scrollKey);

  const selectChapter = useAppSelector((state) => state.qbPage.selectChapter);

  const chapterName = quranService.getChapterName(selectChapter);

  const refVerses = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startTransition(() => {
      setStateVerses(quranService.getVerses(selectChapter));
    });
  }, [selectChapter]);

  useEffect(() => {
    if (scrollKey && refVerses.current) {
      const verseToHighlight = refVerses.current.querySelector(
        `[data-id="${scrollKey}"]`
      ) as HTMLDivElement;

      if (verseToHighlight) {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [scrollKey, isPending]);

  return (
    <>
      <ListTitle chapterName={chapterName} />
      {isPending ? (
        <LoadingSpinner text="Loading verses..." />
      ) : (
        <Box p={1} ref={refVerses}>
          {stateVerses.map((verse: verseProps) => (
            <VerseItem
              key={verse.key}
              verse={verse}
              isSelected={scrollKey === verse.key}
            />
          ))}
        </Box>
      )}
    </>
  );
};

ListVerses.displayName = "ListVerses";

export default DisplayPanel;
