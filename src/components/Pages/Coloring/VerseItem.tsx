import { memo } from "react";

import { verseProps } from "quran-tools";

import { useAppDispatch } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { Button, Box } from "@chakra-ui/react";

import { colorProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import VerseContainer from "@/components/Custom/VerseContainer";
import { ButtonVerse, ButtonExpand } from "@/components/Generic/Buttons";

import { useBoolean } from "usehooks-ts";

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
  return (
    <Box
      p={"5px"}
      borderBottom={"1.5px solid"}
      borderColor={"border.emphasized"}
      style={
        isSelected
          ? {
              padding: 0,
              border: "5px solid",
              borderImage:
                "linear-gradient(to right, #3acfd5 0%, yellow 25%, #3a4ed5 100%) 1",
            }
          : {}
      }
      data-id={verse.key}
      bgColor={verseColor?.colorCode}
      color={verseColor ? getTextColor(verseColor.colorCode) : undefined}
    >
      <VerseComponent verse={verse} openVerseModal={openVerseModal} />
    </Box>
  );
};

interface VerseComponentProps {
  verse: verseProps;
  openVerseModal: () => void;
}

const VerseComponent = memo(
  ({ verse, openVerseModal }: VerseComponentProps) => {
    const { value: isOpen, toggle: setOpen } = useBoolean();
    const dispatch = useAppDispatch();

    const onClickVerseColor = (verse: verseProps) => {
      dispatch(coloringPageActions.setCurrentVerse(verse));
      openVerseModal();
    };

    function onClickVerse() {
      dispatch(coloringPageActions.setScrollKey(verse.key));
    }

    return (
      <>
        <VerseContainer>
          {verse.versetext}{" "}
          <ButtonVerse color={"inherit"} onClick={onClickVerse}>
            ({verse.verseid})
          </ButtonVerse>
          <ButtonExpand color={"inherit"} onClick={setOpen} />
          <Button variant={"ghost"} onClick={() => onClickVerseColor(verse)}>
            🎨
          </Button>
        </VerseContainer>
        <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
      </>
    );
  }
);

VerseComponent.displayName = "VerseComponent";

export { VerseItem };
