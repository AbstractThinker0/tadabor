import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { searcherPageActions } from "@/store/slices/pages/searcher";

import useQuran from "@/context/useQuran";
import { rootProps } from "@/types";
import { hasAllLetters, normalizeAlif } from "@/util/util";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { Box, Flex, Input } from "@chakra-ui/react";

const SearcherSide = () => {
  const [searchToken, setSearchToken] = useState("");
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  const onChangeToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchToken(event.target.value);
  };

  if (isVNotesLoading) return <LoadingSpinner />;

  return (
    <Flex flexDir={"column"} pt={"8px"} paddingInlineStart={"8px"}>
      <div>
        <Input
          type="search"
          placeholder=""
          value={searchToken}
          aria-label="Search"
          onChange={onChangeToken}
          bgColor={"white"}
          required
          dir="rtl"
        />
      </div>
      <RootsList searchString={searchToken} />
      <CountVerses />
    </Flex>
  );
};

const CountVerses = () => {
  const { t } = useTranslation();
  const verses_count = useAppSelector(
    (state) => state.searcherPage.verses_count
  );

  if (!verses_count) return null;

  return (
    <Box fontWeight={"bold"} color={"green"}>
      {`${t("search_count")} ${verses_count}`}
    </Box>
  );
};

interface RootsListProps {
  searchString: string;
}

const RootsList = ({ searchString }: RootsListProps) => {
  const quranService = useQuran();

  const [isPending, startTransition] = useTransition();

  const [itemsCount, setItemsCount] = useState(80);

  const [stateRoots, setStateRoots] = useState<rootProps[]>([]);

  const search_roots = useAppSelector(
    (state) => state.searcherPage.search_roots
  );

  useEffect(() => {
    startTransition(() => {
      setStateRoots(
        quranService.quranRoots.filter(
          (root) =>
            normalizeAlif(root.name).startsWith(searchString) ||
            root.name.startsWith(searchString) ||
            !searchString ||
            hasAllLetters(root.name, searchString)
        )
      );
    });
  }, [searchString]);

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
    <Box
      overflowY={"scroll"}
      bgColor={"var(--color-primary)"}
      padding={"2px"}
      minH={"15%"}
      maxH={"35%"}
      border={"1px solid gainsboro"}
      borderRadius={"0.35rem"}
      onScroll={handleScroll}
      cursor={"pointer"}
    >
      {isPending ? (
        <LoadingSpinner />
      ) : (
        stateRoots
          .slice(0, itemsCount)
          .map((root) => (
            <RootItem
              key={root.id}
              root={root}
              isSelected={search_roots[root.id] ? true : false}
            />
          ))
      )}
    </Box>
  );
};

interface RootItemProps {
  root: rootProps;
  isSelected: boolean;
}

const RootItem = ({ root, isSelected }: RootItemProps) => {
  const dispatch = useAppDispatch();

  const onClickRoot = (root: rootProps) => {
    if (isSelected) {
      dispatch(searcherPageActions.deleteRoot({ root_id: root.id.toString() }));
    } else {
      dispatch(searcherPageActions.addRoot({ root }));
    }
  };

  return (
    <Box
      px={"10px"}
      py={"5px"}
      bgColor={isSelected ? "gray" : undefined}
      onClick={() => onClickRoot(root)}
    >
      {root.name} ({root.count})
    </Box>
  );
};

export default SearcherSide;
