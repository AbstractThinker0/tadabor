import { verseMatchResult, verseProps } from "quran-tools";
import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { Box } from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import VerseContainer from "@/components/Custom/VerseContainer";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import { useBoolean } from "usehooks-ts";
import { useState } from "react";

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
    <GenericVerseItem verseKey={verse.key} isSelected={isSelected}>
      {verse.versetext}{" "}
      <ButtonVerse onClick={onClickVerse}>({verse.verseid})</ButtonVerse>
    </GenericVerseItem>
  );
};

interface SearchVerseItemProps {
  verse: verseMatchResult;
  isSelected: boolean;
}

const SearchVerseItem = ({ verse, isSelected }: SearchVerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const onClickVerseChapter = () => {
    dispatch(qbPageActions.gotoChapter(verse.suraid));
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  return (
    <GenericVerseItem verseKey={verse.key} isSelected={isSelected}>
      <VerseHighlightMatches verse={verse} /> (
      <ButtonVerse
        onClick={onClickVerseChapter}
      >{`${quranService.getChapterName(verse.suraid)}:${
        verse.verseid
      }`}</ButtonVerse>
      )
    </GenericVerseItem>
  );
};

interface GenericVerseItemProps {
  verseKey: string;
  isSelected: boolean;
  children: React.ReactNode;
}

const GenericVerseItem = ({
  verseKey,
  isSelected,
  children,
}: GenericVerseItemProps) => {
  const { value: isOpen, toggle } = useBoolean();
  const [isHovered, setIsHovered] = useState(false);

  const compactVerses = useAppSelector(
    (state) => state.navigation.compactVerses
  );

  return (
    <Box
      data-id={verseKey}
      py={"0.5rem"}
      px={"1rem"}
      smDown={{ px: "0.2rem" }}
      borderBottom="1px solid"
      borderColor={"border.emphasized"}
      aria-selected={isSelected}
      _selected={{ bgColor: "orange.muted" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <VerseContainer>
        {children}
        {(!compactVerses || isSelected || isHovered || isOpen) && (
          <ButtonExpand onClick={toggle} />
        )}
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verseKey} />
    </Box>
  );
};

export { VerseItem, SearchVerseItem };
