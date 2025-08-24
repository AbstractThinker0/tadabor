import { useEffect, useState, useTransition } from "react";

import { useAppDispatch, useAppSelector } from "@/store";

import useQuran from "@/context/useQuran";

import { rbPageActions } from "@/store/slices/pages/rootsBrowser";

import SearchForm from "@/components/Pages/RootsBrowser/SearchForm";

import { RootComponent } from "@/components/Pages/RootsBrowser/RootComponent";

import type { rootProps } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { Box, Flex, Spinner } from "@chakra-ui/react";

import { useRootsLoaded } from "@/hooks/useRootsLoaded";

const PanelRoots = () => {
  const dispatch = useAppDispatch();

  const quranService = useQuran();

  const [isPending, startTransition] = useTransition();

  const searchString = useAppSelector((state) => state.rbPage.searchString);

  const searchInclusive = useAppSelector(
    (state) => state.rbPage.searchInclusive
  );

  const [stateRoots, setStateRoots] = useState<rootProps[]>([]);
  const [itemsCount, setItemsCount] = useState(60);

  const rootsLoaded = useRootsLoaded();

  const handleVerseTab = (verseKey: string) => {
    dispatch(rbPageActions.setVerseTab(verseKey));
    dispatch(rbPageActions.setScrollKey(verseKey));
  };

  const fetchMoreData = () => {
    startTransition(() => {
      setItemsCount((state) => Math.min(state + 50, stateRoots.length));
    });
  };

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    if (itemsCount >= stateRoots.length || isPending) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchMoreData();
    }
  }

  useEffect(() => {
    startTransition(() => {
      setStateRoots(
        quranService.searchRoots(searchString, {
          normalizeToken: true,
          normalizeRoot: true,
          searchInclusive: searchInclusive,
        })
      );
    });
  }, [searchString, searchInclusive, quranService]);

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
        <Flex flex={1} flexDirection={"column"}>
          {stateRoots.slice(0, itemsCount).map((root) => (
            <RootComponent
              key={root.id}
              root={root}
              handleVerseTab={handleVerseTab}
            />
          ))}

          {isPending && (
            <Box width={"100%"} textAlign={"center"} py={5}>
              <Spinner
                size="sm"
                borderWidth="2px"
                margin="auto"
                color="blue.500"
              />
            </Box>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default PanelRoots;
