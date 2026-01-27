import type { verseProps } from "quran-tools";

import { useColoringPageStore } from "@/store/pages/coloringPage";

import { Button } from "@chakra-ui/react";

import type { colorProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";
import { VerseIndex } from "@/components/Custom/VerseIndex";
import { VerseRef } from "@/components/Custom/VerseRef";

interface VerseItemProps {
  verse: verseProps;
  verseColor: colorProps | undefined;
  isSelected: boolean;
  openVerseModal: () => void;
}

const VerseItem = ({
  verse,
  verseColor,
  isSelected,
  openVerseModal,
}: VerseItemProps) => {
  const setCurrentVerse = useColoringPageStore(
    (state) => state.setCurrentVerse
  );
  const setScrollKey = useColoringPageStore((state) => state.setScrollKey);

  const onClickVerseColor = (verse: verseProps) => {
    setCurrentVerse(verse);
    openVerseModal();
  };

  function onClickVerse() {
    setScrollKey(verse.key);
  }

  return (
    <BaseVerseItem
      verseKey={verse.key}
      isSelected={isSelected}
      rootProps={{
        bgColor: verseColor?.colorCode,
        color: verseColor ? getTextColor(verseColor.colorCode) : undefined,
        _selected: {
          padding: 0,
          border: "5px solid",
          borderImage:
            "linear-gradient(to right, #3acfd5 0%, yellow 25%, #3a4ed5 100%) 1",
        },
      }}
      endElement={
        <Button
          variant={"ghost"}
          onClick={() => onClickVerseColor(verse)}
          width={"6px"}
          height={"36px"}
        >
          🎨
        </Button>
      }
    >
      {verse.versetext}{" "}
      <VerseRef
        suraid={verse.suraid}
        verseid={verse.verseid}
        onClickVerse={onClickVerse}
        color="inherit"
      />
    </BaseVerseItem>
  );
};

interface SelectedVerseItemProps {
  index: number;
  verse: verseProps;
  verseColor: colorProps | undefined;
  openVerseModal: () => void;
  isSelected: boolean;
}

const SelectedVerseItem = ({
  index,
  verse,
  verseColor,
  openVerseModal,
  isSelected,
}: SelectedVerseItemProps) => {
  const gotoChapter = useColoringPageStore((state) => state.gotoChapter);
  const setScrollKey = useColoringPageStore((state) => state.setScrollKey);
  const setCurrentVerse = useColoringPageStore(
    (state) => state.setCurrentVerse
  );

  const onClickChapter = () => {
    gotoChapter(Number(verse.suraid));
    if (!isSelected) {
      setScrollKey(verse.key);
    }
  };

  function onClickVerse() {
    setScrollKey(verse.key);
  }

  const onClickVerseColor = (verse: verseProps) => {
    setCurrentVerse(verse);
    openVerseModal();
  };

  return (
    <BaseVerseItem
      verseKey={verse.key}
      isSelected={isSelected}
      rootProps={{
        bgColor: verseColor?.colorCode,
        color: verseColor ? getTextColor(verseColor.colorCode) : undefined,
        _selected: {
          padding: 0,
          border: "5px solid",
          borderImage:
            "linear-gradient(to right, #3acfd5 0%, yellow 25%, #3a4ed5 100%) 1",
        },
      }}
      endElement={
        <Button variant={"ghost"} onClick={() => onClickVerseColor(verse)}>
          🎨
        </Button>
      }
    >
      <VerseIndex index={index} /> {verse.versetext}{" "}
      <VerseRef
        suraid={verse.suraid}
        verseid={verse.verseid}
        onClickChapter={onClickChapter}
        onClickVerse={onClickVerse}
        color="inherit"
      />
    </BaseVerseItem>
  );
};

export { VerseItem, SelectedVerseItem };
