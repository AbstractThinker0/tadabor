import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { verseProps } from "@/types";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import ListSearchResults from "@/components/Pages/QuranBrowser/ListSearchResults";
import { Box, Flex, Heading, useBoolean } from "@chakra-ui/react";
import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";

import VerseContainer from "@/components/Custom/VerseContainer";
import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

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
    <Box flex={1} overflowY="scroll" minH="100%" p={1} ref={refListVerses}>
      {isVNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <Flex
          flexDir="column"
          minH="100%"
          bgColor="#f7fafc"
          borderRadius={5}
          dir="rtl"
          border="1px solid gainsboro"
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
      backgroundColor={"rgba(33, 37, 41, .03)"}
      color={"rgb(13, 110, 253)"}
      py={3}
      size="lg"
      borderBottom="1px solid gainsboro"
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

  useEffect(() => {
    startTransition(() => {
      setStateVerses(quranService.getVerses(selectChapter));
    });
  }, [selectChapter]);

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
      <Box p={1} ref={listRef}>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          stateVerses.map((verse: verseProps) => (
            <VerseItem
              key={verse.key}
              verse={verse}
              isSelected={scrollKey === verse.key}
            />
          ))
        )}
      </Box>
    </>
  );
};

ListVerses.displayName = "ListVerses";

interface VerseItemProps {
  verse: verseProps;
  isSelected: boolean;
}

const VerseItem = ({ verse, isSelected }: VerseItemProps) => {
  const dispatch = useAppDispatch();

  const [isOpen, setOpen] = useBoolean();

  const onClickVerse = () => {
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  return (
    <Box
      data-id={verse.key}
      p={1}
      borderBottom="1px solid gainsboro"
      backgroundColor={isSelected ? "bisque" : undefined}
    >
      <VerseContainer py={1}>
        {verse.versetext}{" "}
        <ButtonVerse onClick={onClickVerse}>({verse.verseid})</ButtonVerse>
        <ButtonExpand onClick={setOpen.toggle} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
    </Box>
  );
};

VerseItem.displayName = "VerseItem";

export default DisplayPanel;
