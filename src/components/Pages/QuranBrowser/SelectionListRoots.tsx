import { memo, useMemo, useState } from "react";
import useQuran from "@/context/useQuran";

import { useQuranBrowserPageStore } from "@/store/zustand/quranBrowserPage";

import type { rootProps } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { Box, Flex } from "@chakra-ui/react";
import { useRootsLoaded } from "@/hooks/useRootsLoaded";

interface SelectionListRootsProps {
  isDisabled: boolean;
  searchString: string;
}

const SelectionListRoots = memo(
  ({ isDisabled, searchString }: SelectionListRootsProps) => {
    const rootsLoaded = useRootsLoaded();

    return (
      <Flex
        flexGrow="1"
        flexDirection="column"
        overflow="hidden"
        border="1px solid"
        borderColor={"border.emphasized"}
        borderRadius="md"
        bgColor={"brand.bg"}
        boxShadow="sm"
        mt="8px"
        mb="2px"
        minH="15vh"
        height={"25vh"}
        maxH="25vh"
      >
        {!rootsLoaded ? (
          <LoadingSpinner text="Loading roots..." />
        ) : (
          <RootsList isDisabled={isDisabled} searchString={searchString} />
        )}
      </Flex>
    );
  },
  (prevProps, nextProps) => {
    if (
      nextProps.isDisabled === true &&
      prevProps.isDisabled === nextProps.isDisabled
    ) {
      return true;
    }
    return false;
  }
);

SelectionListRoots.displayName = "SelectionListRoots";

interface RootsListProps {
  isDisabled: boolean;
  searchString: string;
}

const RootsList = ({ isDisabled, searchString }: RootsListProps) => {
  const quranService = useQuran();
  const [itemsCount, setItemsCount] = useState(50);
  const setSearchString = useQuranBrowserPageStore(
    (state) => state.setSearchString
  );

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setItemsCount((prevState) => prevState + 20);
    }
  };

  const filteredArray = useMemo(
    () =>
      quranService.searchRoots(searchString, {
        normalizeRoot: true,
        normalizeToken: true,
        searchInclusive: false,
      }),
    [searchString, quranService]
  );

  const handleRootSelect = (rootName: string) => {
    if (isDisabled) return;

    setSearchString(rootName);
  };

  return (
    <Box
      minH="100%"
      overflowY="scroll"
      p="4px"
      bgColor={"brand.bg"}
      cursor="pointer"
      aria-disabled={isDisabled}
      _disabled={{
        bgColor: "gray.muted",
        cursor: "not-allowed",
        color: "gray",
      }}
      onScroll={handleScroll}
    >
      {filteredArray.slice(0, itemsCount).map((root) => (
        <RootItem
          root={root}
          isSelected={searchString === root.name && !isDisabled}
          handleRootSelect={handleRootSelect}
          key={root.id}
        />
      ))}
    </Box>
  );
};

interface RootItemProps {
  root: rootProps;
  isSelected: boolean;
  handleRootSelect: (rootName: string) => void;
}

const RootItem = ({ root, isSelected, handleRootSelect }: RootItemProps) => {
  const onClickRoot = (rootName: string) => {
    handleRootSelect(rootName);
  };

  return (
    <Box
      px="12px"
      py={"8px"}
      transition="all 0.2s"
      _hover={{ bgColor: "bg.muted" }}
      aria-selected={isSelected}
      _selected={{
        bgColor: "blue.subtle",
        color: "blue.fg",
      }}
      onClick={() => onClickRoot(root.name)}
    >
      {root.name}
    </Box>
  );
};

export default SelectionListRoots;
