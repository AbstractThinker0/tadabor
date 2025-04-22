import { useAppDispatch } from "@/store";

import useQuran from "@/context/useQuran";

import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { verseMatchResult } from "quran-tools";

import { Box } from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";

import VerseContainer from "@/components/Custom/VerseContainer";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import { useBoolean } from "usehooks-ts";

interface SearchVerseItemProps {
  verse: verseMatchResult;
  isSelected: boolean;
}

const SearchVerseItem = ({ verse, isSelected }: SearchVerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const { value: isOpen, toggle } = useBoolean();

  const onClickVerseChapter = () => {
    dispatch(qbPageActions.gotoChapter(verse.suraid));
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  return (
    <Box
      data-id={verse.key}
      p={1}
      borderBottom="1px solid"
      borderColor={"border.emphasized"}
      aria-selected={isSelected}
      _selected={{ bgColor: "orange.muted" }}
    >
      <VerseContainer>
        <VerseHighlightMatches verse={verse} /> (
        <ButtonVerse
          onClick={onClickVerseChapter}
        >{`${quranService.getChapterName(verse.suraid)}:${
          verse.verseid
        }`}</ButtonVerse>
        )
        <ButtonExpand onClick={toggle} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
    </Box>
  );
};

SearchVerseItem.displayName = "SearchVerseItem";

export { SearchVerseItem };
