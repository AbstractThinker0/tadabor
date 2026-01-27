import { useTagsPageStore } from "@/store/pages/tagsPage";

import type { verseProps } from "quran-tools";

import { VerseTags } from "@/components/Pages/Tags/VerseTags";
import type {
  tagsProps,
  versesTagsProps,
} from "@/components/Pages/Tags/consts";

import { Button } from "@chakra-ui/react";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";
import { VerseIndex } from "@/components/Custom/VerseIndex";
import { VerseRef } from "@/components/Custom/VerseRef";

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
  const setCurrentVerse = useTagsPageStore((state) => state.setCurrentVerse);
  const setScrollKey = useTagsPageStore((state) => state.setScrollKey);

  function onClickTagVerse(verse: verseProps) {
    setCurrentVerse(verse);
    onOpenVerseModal();
  }

  function onClickVerse() {
    setScrollKey(verse.key);
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
      <VerseRef
        suraid={verse.suraid}
        verseid={verse.verseid}
        onClickVerse={onClickVerse}
      />
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
  const gotoChapter = useTagsPageStore((state) => state.gotoChapter);
  const setScrollKey = useTagsPageStore((state) => state.setScrollKey);
  const setCurrentVerse = useTagsPageStore((state) => state.setCurrentVerse);

  function onClickChapter() {
    gotoChapter(Number(verse.suraid));
    if (!isSelected) {
      setScrollKey(verse.key);
    }
  }

  function onClickVerse() {
    setScrollKey(verse.key);
  }

  function onClickTagVerse(verse: verseProps) {
    setCurrentVerse(verse);
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
      <VerseIndex index={index} /> {verse.versetext}{" "}
      <VerseRef
        suraid={verse.suraid}
        verseid={verse.verseid}
        onClickChapter={onClickChapter}
        onClickVerse={onClickVerse}
      />
    </BaseVerseItem>
  );
};

export { VerseItem, SelectedVerseItem };
