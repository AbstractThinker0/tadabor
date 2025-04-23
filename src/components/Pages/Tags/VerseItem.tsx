import { useAppDispatch } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { verseProps } from "quran-tools";

import { ButtonVerse } from "@/components/Generic/Buttons";

import { VerseTags } from "@/components/Pages/Tags/VerseTags";
import { tagsProps, versesTagsProps } from "@/components/Pages/Tags/consts";

import { Button } from "@chakra-ui/react";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import useQuran from "@/context/useQuran";

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
  const dispatch = useAppDispatch();

  function onClickTagVerse(verse: verseProps) {
    dispatch(tagsPageActions.setCurrentVerse(verse));
    onOpenVerseModal();
  }

  function onClickVerse() {
    dispatch(tagsPageActions.setScrollKey(verse.key));
  }

  return (
    <BaseVerseItem
      verseKey={verse.key}
      isSelected={isSelected}
      rootProps={{ _selected: { bgColor: "blue.emphasized" } }}
      outerStartElement={
        versesTags[verse.key] !== undefined && (
          <VerseTags versesTags={versesTags[verse.key]} tags={tags} />
        )
      }
      endElement={
        <Button variant={"ghost"} onClick={() => onClickTagVerse(verse)}>
          🏷️
        </Button>
      }
    >
      {verse.versetext}{" "}
      <ButtonVerse onClick={onClickVerse}>({verse.verseid})</ButtonVerse>
    </BaseVerseItem>
  );
};

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
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  function onClickVerse(verse: verseProps) {
    dispatch(tagsPageActions.gotoChapter(verse.suraid));
    dispatch(tagsPageActions.setScrollKey(verse.key));
  }

  function onClickTagVerse(verse: verseProps) {
    dispatch(tagsPageActions.setCurrentVerse(verse));
    onOpenVerseModal();
  }

  return (
    <BaseVerseItem
      verseKey={verse.key}
      outerStartElement={
        <VerseTags tags={tags} versesTags={versesTags[verse.key]} />
      }
      endElement={
        <Button variant={"ghost"} onClick={() => onClickTagVerse(verse)}>
          🏷️
        </Button>
      }
    >
      {verse.versetext}{" "}
      <ButtonVerse onClick={() => onClickVerse(verse)}>
        ({`${quranService.getChapterName(verse.suraid)}:${verse.verseid}`})
      </ButtonVerse>
    </BaseVerseItem>
  );
};

export { VerseItem, SelectedVerseItem };
