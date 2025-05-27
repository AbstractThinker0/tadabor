import { useEffect, useState, useTransition } from "react";

import type { verseMatchResult } from "quran-tools";

import useQuran from "@/context/useQuran";
import { useAppDispatch, useAppSelector } from "@/store";
import { searcherPageActions } from "@/store/slices/pages/searcher";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { ButtonSidebar } from "@/components/Pages/Searcher/ButtonSiderbar";

import { ButtonVerse } from "@/components/Generic/Buttons";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { Flex, Tag } from "@chakra-ui/react";

const SearcherDisplay = () => {
  const search_roots = useAppSelector(
    (state) => state.searcherPage.search_roots
  );

  const rootsArray = Object.keys(search_roots);

  return (
    <Flex
      flexDir={"column"}
      flex={1}
      overflowY={"hidden"}
      py={"5px"}
      margin={"5px"}
      borderRadius={"0.75rem"}
      border={"1px solid"}
      borderColor={"border.emphasized"}
      bgColor={"brand.contrast"}
    >
      <Flex gap={"10px"} px={"5px"}>
        <ButtonSidebar />
        <Flex
          flex={1}
          dir="rtl"
          flexWrap={"wrap"}
          gap={"10px"}
          paddingBottom={"10px"}
        >
          {rootsArray.map((root_id) => (
            <RootItem
              key={root_id}
              root_name={search_roots[root_id].name}
              root_id={root_id}
              derCount={search_roots[root_id].count}
            />
          ))}
        </Flex>
      </Flex>
      <Flex
        flexDir={"column"}
        overflowY={"scroll"}
        maxH={"100%"}
        height={"100%"}
        dir="rtl"
      >
        <VersesList />
      </Flex>
    </Flex>
  );
};

interface RootItemProps {
  root_name: string;
  root_id: string;
  derCount: string;
}

const RootItem = ({ root_name, root_id, derCount }: RootItemProps) => {
  const dispatch = useAppDispatch();

  const onClickRemove = (root_id: string) => {
    dispatch(searcherPageActions.deleteRoot({ root_id: root_id }));
  };

  return (
    <Tag.Root colorPalette="green" size="xl" variant={"solid"}>
      <Tag.Label overflow={"visible"}>
        {root_name} ({derCount})
      </Tag.Label>

      <Tag.EndElement>
        <Tag.CloseTrigger onClick={() => onClickRemove(root_id)} />
      </Tag.EndElement>
    </Tag.Root>
  );
};

const VersesList = () => {
  const search_roots = useAppSelector(
    (state) => state.searcherPage.search_roots
  );
  const quranService = useQuran();

  const dispatch = useAppDispatch();
  const [stateVerses, setStateVerses] = useState<verseMatchResult[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    //
    startTransition(() => {
      const sortedVerses = quranService.searchByRootIDs(
        Object.keys(search_roots),
        true
      );

      setStateVerses(sortedVerses);
      dispatch(searcherPageActions.setVersesCount(sortedVerses.length));
    });
  }, [search_roots, dispatch, quranService]);

  if (isPending) return <LoadingSpinner text="Loading verses.." />;

  return (
    <>
      {stateVerses.map((verseMatch, index) => (
        <VerseItem key={index} verseMatch={verseMatch} />
      ))}
    </>
  );
};

interface VerseItemProps {
  verseMatch: verseMatchResult;
}

const VerseItem = ({ verseMatch }: VerseItemProps) => {
  const quranService = useQuran();

  const dispatch = useAppDispatch();

  const onClickVerse = () => {
    dispatch(searcherPageActions.setVerseTab(verseMatch.key));
    dispatch(searcherPageActions.setScrollKey(verseMatch.key));
  };

  return (
    <BaseVerseItem verseKey={verseMatch.key}>
      <VerseHighlightMatches verse={verseMatch} />{" "}
      <ButtonVerse onClick={onClickVerse}>{`(${quranService.getChapterName(
        verseMatch.suraid
      )}:${verseMatch.verseid})`}</ButtonVerse>
    </BaseVerseItem>
  );
};

export default SearcherDisplay;
