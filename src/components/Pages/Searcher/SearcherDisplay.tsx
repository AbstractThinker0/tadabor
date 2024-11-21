import { useEffect, useState, useTransition } from "react";

import { verseMatchResult, verseProps } from "@/types";
import { getDerivationsInVerse } from "@/util/util";

import useQuran from "@/context/useQuran";
import { useAppDispatch, useAppSelector } from "@/store";
import { searcherPageActions } from "@/store/slices/pages/searcher";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import {
  Box,
  Flex,
  Tag,
  TagCloseButton,
  TagLabel,
  useBoolean,
} from "@chakra-ui/react";
import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";

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
      padding={"5px"}
      margin={"5px"}
      borderRadius={"0.75rem"}
      border={"1px solid gray"}
      bgColor={"#f7fafc"}
      dir="rtl"
    >
      <Flex flexWrap={"wrap"} gap={"10px"} paddingBottom={"10px"}>
        {rootsArray.map((root_id) => (
          <RootItem
            key={root_id}
            root_name={search_roots[root_id].name}
            root_id={root_id}
            derCount={search_roots[root_id].count}
          />
        ))}
      </Flex>
      <Flex
        flexDir={"column"}
        overflowY={"scroll"}
        maxH={"100%"}
        height={"100%"}
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
    <Tag colorScheme="green" size="lg" variant={"solid"}>
      <TagLabel overflow={"visible"}>
        {root_name} ({derCount})
      </TagLabel>
      <TagCloseButton onClick={() => onClickRemove(root_id)} />
    </Tag>
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

  interface verseProtoType {
    verse: verseProps;
    wordIndexes: string[];
  }

  interface versesObjectType {
    [key: string]: verseProtoType;
  }

  useEffect(() => {
    //
    const matchVerses: verseMatchResult[] = [];
    const rootsArray = Object.keys(search_roots);
    const versesObject: versesObjectType = {};

    rootsArray.forEach((root_id) => {
      const rootTarget = quranService.getRootByID(root_id);

      if (!rootTarget) return;

      rootTarget.occurences.forEach((item) => {
        const info = item.split(":");

        // between 0 .. 6235
        const verseRank = info[0];

        const currentVerse = quranService.getVerseByRank(verseRank);

        const wordIndexes = info[1].split(",");

        if (versesObject[currentVerse.key]) {
          versesObject[currentVerse.key].wordIndexes = Array.from(
            new Set([
              ...versesObject[currentVerse.key].wordIndexes,
              ...wordIndexes,
            ])
          );
        } else {
          versesObject[currentVerse.key] = {
            verse: currentVerse,
            wordIndexes: wordIndexes,
          };
        }
      });
    });

    Object.keys(versesObject).forEach((verseKey) => {
      const currentVerse = versesObject[verseKey].verse;
      const chapterName = quranService.getChapterName(currentVerse.suraid);

      const { verseResult } = getDerivationsInVerse(
        versesObject[verseKey].wordIndexes,
        currentVerse,
        chapterName
      );

      matchVerses.push(verseResult);
    });

    startTransition(() => {
      const sortedVerses = matchVerses.sort((verseA, verseB) => {
        const infoA = verseA.key.split("-");
        const infoB = verseB.key.split("-");
        if (Number(infoA[0]) !== Number(infoB[0]))
          return Number(infoA[0]) - Number(infoB[0]);
        else return Number(infoA[1]) - Number(infoB[1]);
      });

      setStateVerses(sortedVerses);
      dispatch(searcherPageActions.setVersesCount(sortedVerses.length));
    });
  }, [search_roots]);

  if (isPending) return <LoadingSpinner />;

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
  const [isOpen, setOpen] = useBoolean();
  const dispatch = useAppDispatch();

  const onClickVerse = () => {
    dispatch(searcherPageActions.setVerseTab(verseMatch.key));
    dispatch(searcherPageActions.setScrollKey(verseMatch.key));
  };

  return (
    <Box py={"5px"} borderBottom={"1px solid #dee2e6"}>
      <VerseContainer>
        <VerseHighlightMatches verse={verseMatch} />{" "}
        <ButtonVerse onClick={onClickVerse}>{`(${quranService.getChapterName(
          verseMatch.suraid
        )}:${verseMatch.verseid})`}</ButtonVerse>
        <ButtonExpand onClick={setOpen.toggle} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verseMatch.key} />
    </Box>
  );
};

export default SearcherDisplay;
