import { useEffect, useRef } from "react";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import ListSearchResults from "@/components/Pages/QuranBrowser/ListSearchResults";
import ListVerses from "@/components/Pages/QuranBrowser/ListVerses";
import { Flex } from "@chakra-ui/react";

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
    <Flex
      flex={1}
      overflowY="scroll"
      flexDirection={"column"}
      px={"0.5rem"}
      py={"0.5rem"}
      ref={refListVerses}
    >
      {isVNotesLoading ? (
        <LoadingSpinner text="Loading verse notes..." />
      ) : (
        <Flex
          flexDir="column"
          bgColor={"brand.contrast"}
          borderRadius={5}
          border={"1px solid"}
          borderColor={"border.emphasized"}
          flex={1}
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
    </Flex>
  );
};

DisplayPanel.displayName = "DisplayPanel";

export default DisplayPanel;
