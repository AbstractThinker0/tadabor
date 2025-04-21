import { verseProps } from "quran-tools";

import { useAppDispatch } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import useQuran from "@/context/useQuran";

import { Box, Button } from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import VerseContainer from "@/components/Custom/VerseContainer";
import { ButtonVerse, ButtonExpand } from "@/components/Generic/Buttons";

import { colorProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

import { useBoolean } from "usehooks-ts";

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
  const { value: isOpen, toggle: setOpen } = useBoolean();
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
    <Box
      p={1}
      borderBottom={"1.5px solid"}
      borderColor={"border.emphasized"}
      key={verse.key}
      bgColor={verseColor?.colorCode}
      color={verseColor ? getTextColor(verseColor.colorCode) : undefined}
    >
      <VerseContainer>
        {verse.versetext}{" "}
        <ButtonVerse
          color={"inherit"}
          onClick={() => onClickChapter(verse)}
        >{`(${quranService.getChapterName(verse.suraid)}:${
          verse.verseid
        })`}</ButtonVerse>
        <ButtonExpand onClick={setOpen} color={"inherit"} />
        <Button variant={"ghost"} onClick={() => onClickVerseColor(verse)}>
          🎨
        </Button>
      </VerseContainer>

      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
    </Box>
  );
};

export { SelectedVerseItem };
