import { useAppDispatch } from "@/store";

import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { verseProps } from "quran-tools";

import { Box } from "@chakra-ui/react";
import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";

import VerseContainer from "@/components/Custom/VerseContainer";
import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";
import { useBoolean } from "usehooks-ts";

interface VerseItemProps {
  verse: verseProps;
  isSelected: boolean;
}

const VerseItem = ({ verse, isSelected }: VerseItemProps) => {
  const dispatch = useAppDispatch();

  const { value: isOpen, toggle } = useBoolean();

  const onClickVerse = () => {
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  return (
    <Box
      data-id={verse.key}
      p={"0.3rem"}
      smDown={{ px: "0.2rem" }}
      borderBottom="1px solid"
      borderColor={"border.emphasized"}
      aria-selected={isSelected}
      _selected={{ bgColor: "orange.muted" }}
    >
      <VerseContainer py={1} color={"brand.text"}>
        {verse.versetext}{" "}
        <ButtonVerse onClick={onClickVerse}>({verse.verseid})</ButtonVerse>
        <ButtonExpand onClick={toggle} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
    </Box>
  );
};

export default VerseItem;
