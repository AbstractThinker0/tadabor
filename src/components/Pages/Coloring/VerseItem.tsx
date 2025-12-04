import type { verseProps } from "quran-tools";

import { useAppDispatch } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { Button, Span } from "@chakra-ui/react";

import type { colorProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

import { ButtonVerse } from "@/components/Generic/Buttons";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import useQuran from "@/context/useQuran";

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
  const dispatch = useAppDispatch();

  const onClickVerseColor = (verse: verseProps) => {
    dispatch(coloringPageActions.setCurrentVerse(verse));
    openVerseModal();
  };

  function onClickVerse() {
    dispatch(coloringPageActions.setScrollKey(verse.key));
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
      <ButtonVerse color={"inherit"} onClick={onClickVerse}>
        ({verse.verseid})
      </ButtonVerse>
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
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const onClickChapter = (verse: verseProps) => {
    dispatch(coloringPageActions.gotoChapter(Number(verse.suraid)));
    if (!isSelected) {
      dispatch(coloringPageActions.setScrollKey(verse.key));
    }
  };

  function onClickVerse() {
    dispatch(coloringPageActions.setScrollKey(verse.key));
  }

  const onClickVerseColor = (verse: verseProps) => {
    dispatch(coloringPageActions.setCurrentVerse(verse));
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
      <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
        {index + 1}.
      </Span>{" "}
      {verse.versetext}{" "}
      <Span whiteSpace="nowrap">
        (
        <ButtonVerse color={"inherit"} onClick={() => onClickChapter(verse)}>
          {quranService.getChapterName(verse.suraid)}
        </ButtonVerse>
        :
        <ButtonVerse color={"inherit"} onClick={() => onClickVerse()}>
          {verse.verseid}
        </ButtonVerse>
        )
      </Span>
    </BaseVerseItem>
  );
};

export { VerseItem, SelectedVerseItem };
