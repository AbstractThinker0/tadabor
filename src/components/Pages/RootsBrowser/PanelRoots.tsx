import { useState, useEffect } from "react";

import {
  isRootNotesLoading,
  isVerseNotesLoading,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import { fetchRootNotes } from "@/store/slices/global/rootNotes";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { rbPageActions } from "@/store/slices/pages/rootsBrowser";

import SearchForm from "@/components/Pages/RootsBrowser/SearchForm";
import RootsList from "@/components/Pages/RootsBrowser/RootsList";

import { rootProps } from "@/types";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { Flex } from "@chakra-ui/react";

const PanelRoots = () => {
  const dispatch = useAppDispatch();
  const isRNotesLoading = useAppSelector(isRootNotesLoading());
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  const searchString = useAppSelector((state) => state.rbPage.searchString);

  const searchInclusive = useAppSelector(
    (state) => state.rbPage.searchInclusive
  );

  const [stateRoots, setStateRoots] = useState<rootProps[]>([]);

  useEffect(() => {
    dispatch(fetchRootNotes());
    dispatch(fetchVerseNotes());
  }, []);

  const handleRoots = (roots: rootProps[]) => {
    setStateRoots(roots);
  };

  const handleVerseTab = (verseKey: string) => {
    dispatch(rbPageActions.setVerseTab(verseKey));
    dispatch(rbPageActions.setScrollKey(verseKey));
  };

  return (
    <Flex
      flexDirection={"column"}
      overflow={"hidden"}
      maxH={"100%"}
      height={"100%"}
    >
      <SearchForm
        searchString={searchString}
        searchInclusive={searchInclusive}
        stateRoots={stateRoots}
      />

      {isRNotesLoading || isVNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <RootsList
          searchString={searchString}
          searchInclusive={searchInclusive}
          handleVerseTab={handleVerseTab}
          stateRoots={stateRoots}
          handleRoots={handleRoots}
        />
      )}
    </Flex>
  );
};

export default PanelRoots;
