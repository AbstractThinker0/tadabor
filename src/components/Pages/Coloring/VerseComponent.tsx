import { memo } from "react";

import { verseProps } from "quran-tools";

import { useAppDispatch } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { Button } from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import VerseContainer from "@/components/Custom/VerseContainer";
import { ButtonVerse, ButtonExpand } from "@/components/Generic/Buttons";

import { useBoolean } from "usehooks-ts";

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

export { VerseComponent };
