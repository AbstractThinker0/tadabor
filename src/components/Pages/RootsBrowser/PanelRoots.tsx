import { useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store";

import { rbPageActions } from "@/store/slices/pages/rootsBrowser";

import SearchForm from "@/components/Pages/RootsBrowser/SearchForm";
import RootsList from "@/components/Pages/RootsBrowser/RootsList";

import type { rootProps } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { Flex } from "@chakra-ui/react";

import { useRootsLoaded } from "@/hooks/useRootsLoaded";

const PanelRoots = () => {
  const dispatch = useAppDispatch();

  const searchString = useAppSelector((state) => state.rbPage.searchString);

  const searchInclusive = useAppSelector(
    (state) => state.rbPage.searchInclusive
  );

  const [stateRoots, setStateRoots] = useState<rootProps[]>([]);
  const [itemsCount, setItemsCount] = useState(60);

  const rootsLoaded = useRootsLoaded();

  const handleRoots = (roots: rootProps[]) => {
    setStateRoots(roots);
  };

  const handleVerseTab = (verseKey: string) => {
    dispatch(rbPageActions.setVerseTab(verseKey));
    dispatch(rbPageActions.setScrollKey(verseKey));
  };

  const fetchMoreData = () => {
    setItemsCount((state) => state + 15);
  };

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      fetchMoreData();
    }
  }

  return (
    <Flex
      flexDirection={"column"}
      overflowY={"scroll"}
      maxH={"100%"}
      height={"100%"}
      onScroll={handleScroll}
    >
      <SearchForm
        searchString={searchString}
        searchInclusive={searchInclusive}
        stateRoots={stateRoots}
      />

      {!rootsLoaded ? (
        <LoadingSpinner text="Loading roots data.." />
      ) : (
        <RootsList
          searchString={searchString}
          searchInclusive={searchInclusive}
          handleVerseTab={handleVerseTab}
          stateRoots={stateRoots}
          handleRoots={handleRoots}
          itemsCount={itemsCount}
        />
      )}
    </Flex>
  );
};

export default PanelRoots;
