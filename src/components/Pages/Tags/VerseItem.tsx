import { useAppDispatch } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import type { verseProps } from "quran-tools";

import { ButtonVerse } from "@/components/Generic/Buttons";

import { VerseTags } from "@/components/Pages/Tags/VerseTags";
import type {
  tagsProps,
  versesTagsProps,
} from "@/components/Pages/Tags/consts";

import { Button, Span } from "@chakra-ui/react";

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
        <Button
          variant={"ghost"}
          onClick={() => onClickTagVerse(verse)}
          width={"6px"}
          height={"36px"}
        >
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
  index: number;
  verse: verseProps;
  versesTags: versesTagsProps;
  tags: tagsProps;
  onOpenVerseModal: () => void;
  isSelected: boolean;
}

const SelectedVerseItem = ({
  index,
  verse,
  versesTags,
  tags,
  onOpenVerseModal,
  isSelected,
}: SelectedVerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  function onClickChapter(verse: verseProps) {
    dispatch(tagsPageActions.gotoChapter(verse.suraid));
    if (!isSelected) {
      dispatch(tagsPageActions.setScrollKey(verse.key));
    }
  }

  function onClickVerse(verse: verseProps) {
    dispatch(tagsPageActions.setScrollKey(verse.key));
  }

  function onClickTagVerse(verse: verseProps) {
    dispatch(tagsPageActions.setCurrentVerse(verse));
    onOpenVerseModal();
  }

  return (
    <BaseVerseItem
      isSelected={isSelected}
      rootProps={{ _selected: { bgColor: "blue.emphasized" } }}
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
      <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
        {index + 1}.
      </Span>{" "}
      {verse.versetext} (
      <ButtonVerse onClick={() => onClickChapter(verse)}>
        {quranService.getChapterName(verse.suraid)}
      </ButtonVerse>
      :
      <ButtonVerse onClick={() => onClickVerse(verse)}>
        {verse.verseid}
      </ButtonVerse>
      )
    </BaseVerseItem>
  );
};

export { VerseItem, SelectedVerseItem };
