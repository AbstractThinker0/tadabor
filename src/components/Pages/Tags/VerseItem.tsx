import { memo } from "react";

import { useAppDispatch } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { verseProps } from "quran-tools";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

import VerseContainer from "@/components/Custom/VerseContainer";

import { VerseTags } from "@/components/Pages/Tags/VerseTags";
import { tagsProps, versesTagsProps } from "@/components/Pages/Tags/consts";

import { Box, Button } from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import { useBoolean } from "usehooks-ts";

interface VerseItemProps {
  verse: verseProps;
  isSelected: boolean;
  versesTags: versesTagsProps;
  tags: tagsProps;
  onOpenVerseModal: () => void;
}

const VerseItem = ({
  verse,
  isSelected,
  versesTags,
  tags,
  onOpenVerseModal,
}: VerseItemProps) => {
  return (
    <Box
      data-id={verse.key}
      aria-selected={isSelected}
      _selected={{ bgColor: "blue.emphasized" }}
      borderBottom={"1.5px solid"}
      borderColor={"border.emphasized"}
      p={"4px"}
    >
      {versesTags[verse.key] !== undefined && (
        <VerseTags versesTags={versesTags[verse.key]} tags={tags} />
      )}
      <ListVerseComponent onOpenVerseModal={onOpenVerseModal} verse={verse} />
    </Box>
  );
};

interface ListVerseComponentProps {
  verse: verseProps;
  onOpenVerseModal: () => void;
}

const ListVerseComponent = memo(
  ({ onOpenVerseModal, verse }: ListVerseComponentProps) => {
    const dispatch = useAppDispatch();
    const { value: isOpen, toggle: setOpen } = useBoolean();

    function onClickTagVerse(verse: verseProps) {
      dispatch(tagsPageActions.setCurrentVerse(verse));
      onOpenVerseModal();
    }

    function onClickVerse() {
      dispatch(tagsPageActions.setScrollKey(verse.key));
    }

    return (
      <>
        <VerseContainer>
          {verse.versetext}{" "}
          <ButtonVerse onClick={onClickVerse}>({verse.verseid})</ButtonVerse>
          <ButtonExpand onClick={setOpen} />
          <Button variant={"ghost"} onClick={() => onClickTagVerse(verse)}>
            🏷️
          </Button>
        </VerseContainer>
        <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
      </>
    );
  }
);

ListVerseComponent.displayName = "ListVerseComponent";

export { VerseItem };
