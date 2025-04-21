import { useAppDispatch } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { verseProps } from "quran-tools";
import useQuran from "@/context/useQuran";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

import VerseContainer from "@/components/Custom/VerseContainer";

import { VerseTags } from "@/components/Pages/Tags/VerseTags";
import { tagsProps, versesTagsProps } from "@/components/Pages/Tags/consts";

import { Box, Button } from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import { useBoolean } from "usehooks-ts";

interface SelectedVerseItemProps {
  verse: verseProps;
  versesTags: versesTagsProps;
  tags: tagsProps;
  onOpenVerseModal: () => void;
}

const SelectedVerseItem = ({
  verse,
  versesTags,
  tags,
  onOpenVerseModal,
}: SelectedVerseItemProps) => {
  return (
    <Box
      borderBottom={"1.5px solid"}
      borderColor={"border.emphasized"}
      p={"4px"}
    >
      <VerseTags tags={tags} versesTags={versesTags[verse.key]} />
      <SelectedVerseComponent
        onOpenVerseModal={onOpenVerseModal}
        verse={verse}
      />
    </Box>
  );
};

interface SelectedVerseComponentProps {
  verse: verseProps;
  onOpenVerseModal: () => void;
}

const SelectedVerseComponent = ({
  verse,
  onOpenVerseModal,
}: SelectedVerseComponentProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();
  const { value: isOpen, toggle: setOpen } = useBoolean();

  function onClickVerse(verse: verseProps) {
    dispatch(tagsPageActions.gotoChapter(verse.suraid));
    dispatch(tagsPageActions.setScrollKey(verse.key));
  }

  function onClickTagVerse(verse: verseProps) {
    dispatch(tagsPageActions.setCurrentVerse(verse));
    onOpenVerseModal();
  }

  return (
    <>
      <VerseContainer>
        {verse.versetext}{" "}
        <ButtonVerse onClick={() => onClickVerse(verse)}>
          ({`${quranService.getChapterName(verse.suraid)}:${verse.verseid}`})
        </ButtonVerse>
        <ButtonExpand onClick={setOpen} />
        <Button variant={"ghost"} onClick={() => onClickTagVerse(verse)}>
          🏷️
        </Button>
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
    </>
  );
};

export { SelectedVerseItem };
