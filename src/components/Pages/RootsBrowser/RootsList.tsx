import { memo, useEffect, useTransition } from "react";

import useQuran from "@/context/useQuran";

import type { rootProps } from "quran-tools";

import { RootComponent } from "@/components/Pages/RootsBrowser/RootComponent";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { Flex } from "@chakra-ui/react";

interface RootsListProps {
  searchInclusive: boolean;
  searchString: string;
  handleVerseTab: (verseKey: string) => void;
  stateRoots: rootProps[];
  handleRoots: (roots: rootProps[]) => void;
  itemsCount: number;
}

const RootsList = memo(
  ({
    searchString,
    searchInclusive,
    handleVerseTab,
    stateRoots,
    handleRoots,
    itemsCount,
  }: RootsListProps) => {
    const quranService = useQuran();

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
      startTransition(() => {
        handleRoots(
          quranService.searchRoots(searchString, {
            normalizeToken: true,
            normalizeRoot: true,
            searchInclusive: searchInclusive,
          })
        );
      });
    }, [searchString, searchInclusive, quranService, handleRoots]);

    return (
      <Flex flex={1} flexDirection={"column"}>
        {isPending ? (
          <LoadingSpinner text="Loading roots.." />
        ) : (
          stateRoots
            .slice(0, itemsCount)
            .map((root) => (
              <RootComponent
                key={root.id}
                root={root}
                handleVerseTab={handleVerseTab}
              />
            ))
        )}
      </Flex>
    );
  }
);

RootsList.displayName = "RootsList";

export default RootsList;
