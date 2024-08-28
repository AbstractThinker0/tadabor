import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { verseProps } from "@/types";

import { ExpandButton } from "@/components/Generic/Buttons";
import NoteText from "@/components/Custom/NoteText";
import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import ListSearchResults from "@/components/Pages/QuranBrowser/ListSearchResults";
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
    <Box flex={1} overflowY="scroll" minH="100%" p={1} ref={refListVerses}>
      {isVNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <Flex
          flexDir="column"
          minH="100%"
          bg="#f7fafc"
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
            <Box
              key={verse.key}
              data-id={verse.key}
              p={1}
              borderBottom="1px solid gainsboro"
              backgroundColor={scrollKey === verse.key ? "bisque" : undefined}
            >
              <VerseComponent verse={verse} />
            </Box>
          ))
        )}
      </Box>
    </>
  );
};

ListVerses.displayName = "ListVerses";

interface VerseComponentProps {
  verse: verseProps;
}

const VerseComponent = ({ verse }: VerseComponentProps) => {
  return (
    <>
      <VerseTextComponent verse={verse} />
      <NoteText verseKey={verse.key} />
    </>
  );
};

VerseComponent.displayName = "VerseComponent";

interface VerseTextComponentProps {
  verse: verseProps;
}

const VerseTextComponent = ({ verse }: VerseTextComponentProps) => {
  const dispatch = useAppDispatch();

  function onClickVerse() {
    dispatch(qbPageActions.setScrollKey(verse.key));
  }
  return (
    <VerseContainer>
      {verse.versetext}{" "}
      <Box
        display="inline"
        cursor="pointer"
        _hover={{ color: "cornflowerblue" }}
        onClick={onClickVerse}
      >
        {`(${verse.verseid})`}
      </Box>
      <ExpandButton identifier={verse.key} />
    </VerseContainer>
  );
};

VerseTextComponent.displayName = "VerseTextComponent";

export default DisplayPanel;
