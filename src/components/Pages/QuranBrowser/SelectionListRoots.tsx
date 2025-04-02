import { memo, useEffect, useMemo, useState } from "react";
import useQuran from "@/context/useQuran";

import { useAppDispatch } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { rootProps } from "@/types";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { Box, Flex } from "@chakra-ui/react";

interface SelectionListRootsProps {
  isDisabled: boolean;
  searchString: string;
}

const SelectionListRoots = memo(
  ({ isDisabled, searchString }: SelectionListRootsProps) => {
    const quranService = useQuran();
    const [rootsLoaded, setRootsLoaded] = useState(
      quranService.isRootsDataLoaded
    );

    useEffect(() => {
      const handleRootsLoaded = () => {
        setRootsLoaded(true);
      };

      quranService.onRootsLoaded(handleRootsLoaded);

      return () => {
        quranService.onRootsLoaded(() => {}); // Reset callback
      };
    }, []);

    return (
      <Flex
        flexGrow="1"
        flexDirection="column"
        overflowY="hidden"
        border="1px solid"
        borderColor={"border.emphasized"}
        borderRadius={6}
        mt="8px"
        mb="2px"
        minH="15%"
        maxH="25%"
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
  const dispatch = useAppDispatch();

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setItemsCount((prevState) => prevState + 20);
    }
  };

  const filteredArray = useMemo(
    () =>
      quranService.quranRoots.filter(
        (root) => root.name.startsWith(searchString) || isDisabled
      ),
    [searchString, isDisabled]
  );

  const handleRootSelect = (rootName: string) => {
    if (isDisabled) return;

    dispatch(qbPageActions.setSearchString(rootName));
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
      aria-selected={isSelected}
      _selected={{ bgColor: "gray.emphasized" }}
      onClick={() => onClickRoot(root.name)}
    >
      {root.name}
    </Box>
  );
};

export default SelectionListRoots;
