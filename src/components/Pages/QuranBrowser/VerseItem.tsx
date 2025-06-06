import type { verseMatchResult, verseProps } from "quran-tools";
import useQuran from "@/context/useQuran";

import { useAppDispatch } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { ButtonVerse } from "@/components/Generic/Buttons";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";
import { Span } from "@chakra-ui/react";

interface VerseItemProps {
  verse: verseProps;
  isSelected: boolean;
}

const VerseItem = ({ verse, isSelected }: VerseItemProps) => {
  const dispatch = useAppDispatch();

  const onClickVerse = () => {
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  return (
    <BaseVerseItem verseKey={verse.key} isSelected={isSelected}>
      {verse.versetext}{" "}
      <ButtonVerse onClick={onClickVerse}>({verse.verseid})</ButtonVerse>
    </BaseVerseItem>
  );
};

interface SearchVerseItemProps {
  verse: verseMatchResult;
  isSelected: boolean;
  index: number;
}

const SearchVerseItem = ({
  verse,
  isSelected,
  index,
}: SearchVerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const onClickVerseChapter = () => {
    dispatch(qbPageActions.gotoChapter(verse.suraid));
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  const onClickVerse = () => {
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  return (
    <BaseVerseItem
      verseKey={verse.key}
      isSelected={isSelected}
      rootProps={{ paddingStart: "5px" }}
    >
      <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
        {index + 1}.
      </Span>{" "}
      <VerseHighlightMatches verse={verse} /> (
      <ButtonVerse onClick={onClickVerseChapter}>
        {quranService.getChapterName(verse.suraid)}
      </ButtonVerse>
      :<ButtonVerse onClick={onClickVerse}>{verse.verseid}</ButtonVerse>)
    </BaseVerseItem>
  );
};

export { VerseItem, SearchVerseItem };
