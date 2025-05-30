import { useEffect, useRef, useState, useTransition } from "react";

import type { verseMatchResult } from "quran-tools";

import useQuran from "@/context/useQuran";
import { useAppDispatch, useAppSelector } from "@/store";
import { searcherPageActions } from "@/store/slices/pages/searcher";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { ButtonSidebar } from "@/components/Pages/Searcher/ButtonSiderbar";

import { ButtonVerse } from "@/components/Generic/Buttons";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { Flex, Span, Tag } from "@chakra-ui/react";

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
      <VersesList />
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
  const refVerses = useRef<HTMLDivElement>(null);

  const search_roots = useAppSelector(
    (state) => state.searcherPage.search_roots
  );

  const scrollKey = useAppSelector((state) => state.searcherPage.scrollKey);

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

  useEffect(() => {
    if (refVerses.current && scrollKey) {
      const verseToHighlight = refVerses.current.querySelector(
        `[data-id="${scrollKey}"]`
      ) as HTMLDivElement;

      if (verseToHighlight) {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [scrollKey]);

  if (isPending) return <LoadingSpinner text="Loading verses.." />;

  return (
    <Flex
      flexDir={"column"}
      overflowY={"scroll"}
      maxH={"100%"}
      height={"100%"}
      dir="rtl"
      ref={refVerses}
    >
      {stateVerses.map((verseMatch, index) => (
        <VerseItem
          index={index}
          key={verseMatch.key}
          verseMatch={verseMatch}
          isSelected={scrollKey === verseMatch.key}
        />
      ))}
    </Flex>
  );
};

interface VerseItemProps {
  index: number;
  verseMatch: verseMatchResult;
  isSelected: boolean;
}

const VerseItem = ({ verseMatch, isSelected, index }: VerseItemProps) => {
  const quranService = useQuran();

  const dispatch = useAppDispatch();

  const onClickVerseChapter = () => {
    dispatch(searcherPageActions.setVerseTab(verseMatch.key));
    dispatch(searcherPageActions.setScrollKey(verseMatch.key));
  };

  const onClickVerse = () => {
    if (isSelected) {
      dispatch(searcherPageActions.setScrollKey(""));
    } else {
      dispatch(searcherPageActions.setScrollKey(verseMatch.key));
    }
  };

  return (
    <BaseVerseItem verseKey={verseMatch.key} isSelected={isSelected}>
      <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
        {index + 1}.
      </Span>{" "}
      <VerseHighlightMatches verse={verseMatch} /> (
      <ButtonVerse onClick={onClickVerseChapter}>
        {quranService.getChapterName(verseMatch.suraid)}
      </ButtonVerse>
      :<ButtonVerse onClick={onClickVerse}>{verseMatch.verseid}</ButtonVerse>)
    </BaseVerseItem>
  );
};

export default SearcherDisplay;
