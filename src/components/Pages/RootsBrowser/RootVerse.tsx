import useQuran from "@/context/useQuran";

import type { verseMatchResult } from "quran-tools";

import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import { Span } from "@chakra-ui/react";

import { ButtonVerse } from "@/components/Generic/Buttons";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

interface RootVerseProps {
  index: number;
  isSelected: boolean;
  rootVerse: verseMatchResult;
  handleVerseTab: (verseKey: string) => void;
  handleVerseClick: (verseKey: string) => void;
}

const RootVerse = ({
  index,
  isSelected,
  rootVerse,
  handleVerseTab,
  handleVerseClick,
}: RootVerseProps) => {
  const quranService = useQuran();

  const verseChapter = quranService.getChapterName(rootVerse.suraid);

  const onClickChapter = () => {
    handleVerseTab(rootVerse.key);
  };

  const onClickVerseID = () => {
    handleVerseClick(rootVerse.key);
  };

  return (
    <BaseVerseItem
      dataKey={`sub-${rootVerse.key}`}
      verseKey={rootVerse.key}
      isSelected={isSelected}
      rootProps={{ px: "0.25rem" }}
    >
      <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
        {index + 1}.
      </Span>{" "}
      <VerseHighlightMatches verse={rootVerse} /> (
      <ButtonVerse onClick={onClickChapter}>{verseChapter}</ButtonVerse>:
      <ButtonVerse onClick={onClickVerseID}>{rootVerse.verseid}</ButtonVerse>)
    </BaseVerseItem>
  );
};

export { RootVerse };
