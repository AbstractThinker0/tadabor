import { useAppDispatch } from "@/store";

import { searcher2PageActions } from "@/store/slices/pages/searcher2";

import useQuran from "@/context/useQuran";
import type { verseMatchResult } from "quran-tools";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { Span } from "@chakra-ui/react";

import { ButtonVerse } from "@/components/Generic/Buttons";

import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

interface VerseItemProps {
  index: number;
  verseMatch: verseMatchResult;
  isSelected: boolean;
}

const VerseItem = ({ verseMatch, isSelected, index }: VerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const onClickVerseChapter = () => {
    dispatch(searcher2PageActions.setVerseTab(verseMatch.key));
    dispatch(searcher2PageActions.setScrollKey(verseMatch.key));
  };

  const onClickVerse = () => {
    if (isSelected) {
      dispatch(searcher2PageActions.setScrollKey(""));
    } else {
      dispatch(searcher2PageActions.setScrollKey(verseMatch.key));
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

export { VerseItem };
