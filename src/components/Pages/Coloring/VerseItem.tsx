import { verseProps } from "quran-tools";

import { useAppDispatch } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { Button } from "@chakra-ui/react";

import { colorProps } from "@/components/Pages/Coloring/consts";
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
        <Button variant={"ghost"} onClick={() => onClickVerseColor(verse)}>
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
  verse: verseProps;
  verseColor: colorProps | undefined;
  openVerseModal: () => void;
}

const SelectedVerseItem = ({
  verse,
  verseColor,
  openVerseModal,
}: SelectedVerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const onClickChapter = (verse: verseProps) => {
    dispatch(coloringPageActions.gotoChapter(Number(verse.suraid)));
    dispatch(coloringPageActions.setScrollKey(verse.key));
  };

  const onClickVerseColor = (verse: verseProps) => {
    dispatch(coloringPageActions.setCurrentVerse(verse));
    openVerseModal();
  };

  return (
    <BaseVerseItem
      verseKey={verse.key}
      rootProps={{
        bgColor: verseColor?.colorCode,
        color: verseColor ? getTextColor(verseColor.colorCode) : undefined,
      }}
      endElement={
        <Button variant={"ghost"} onClick={() => onClickVerseColor(verse)}>
          🎨
        </Button>
      }
    >
      {verse.versetext}{" "}
      <ButtonVerse
        color={"inherit"}
        onClick={() => onClickChapter(verse)}
      >{`(${quranService.getChapterName(verse.suraid)}:${
        verse.verseid
      })`}</ButtonVerse>
    </BaseVerseItem>
  );
};

export { VerseItem, SelectedVerseItem };
