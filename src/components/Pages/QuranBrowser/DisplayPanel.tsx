import { useEffect, useRef } from "react";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import ListSearchResults from "@/components/Pages/QuranBrowser/ListSearchResults";
import ListVerses from "@/components/Pages/QuranBrowser/ListVerses";
import { Box, Flex } from "@chakra-ui/react";

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

export default DisplayPanel;
