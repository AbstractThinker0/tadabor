import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { dbFuncs } from "@/util/db";

import useQuran from "@/context/useQuran";

import type { colorProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

import {
  Dialog,
  Button,
  Box,
  Flex,
  ButtonGroup,
  type DialogOpenChangeDetails,
} from "@chakra-ui/react";

import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";

import VerseContainer from "@/components/Custom/VerseContainer";

interface VerseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerseModal = ({ isOpen, onClose }: VerseModalProps) => {
  const currentVerse = useAppSelector(
    (state) => state.coloringPage.currentVerse
  );
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );
  const colorsList = useAppSelector((state) => state.coloringPage.colorsList);

  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const currentVerseKey = currentVerse?.key;

  const [chosenColor, setChosenColor] = useState(
    currentVerseKey && coloredVerses[currentVerseKey]
      ? coloredVerses[currentVerseKey]
      : null
  );

  useEffect(() => {
    if (!currentVerseKey) {
      setChosenColor(null);
      return;
    }

    if (!coloredVerses[currentVerseKey]) {
      setChosenColor(null);
      return;
    }

    setChosenColor(coloredVerses[currentVerseKey]);
  }, [currentVerse]);

  const onOpenChange = (details: DialogOpenChangeDetails) => {
    if (!details.open) {
      onCloseComplete();
    }
  };

  const onCloseComplete = () => {
    setChosenColor(null);
    dispatch(coloringPageActions.setCurrentVerse(null));
  };

  const setVerseColor = (verseKey: string, color: colorProps | null) => {
    if (color === null) {
      dbFuncs.deleteVerseColor(verseKey);
    } else {
      dbFuncs.saveVerseColor({
        verse_key: verseKey,
        color_id: color.colorID,
      });
    }

    dispatch(
      coloringPageActions.setVerseColor({
        verseKey: verseKey,
        color: color,
      })
    );
  };

  const onClickSave = () => {
    if (currentVerse?.key) {
      setVerseColor(currentVerse.key, chosenColor);
    }
    onClose();
  };

  const onClickColor = (color: colorProps) => {
    if (color.colorID === chosenColor?.colorID) {
      setChosenColor(null);
      return;
    }

    setChosenColor(color);
  };

  return (
    <Dialog.Root
      size="xl"
      open={isOpen}
      onInteractOutside={onClose}
      placement={"center"}
      onOpenChange={onOpenChange}
    >
      <DialogContent dir="ltr">
        <Dialog.Header
          borderBottom="1px solid"
          borderColor={"border.emphasized"}
          fontSize={"xl"}
        >
          Choose verse color
        </Dialog.Header>

        <Dialog.Body>
          <Box textAlign={"center"}>
            (
            {currentVerse
              ? `${quranService.getChapterName(currentVerse.suraid)}:${
                  currentVerse.verseid
                }`
              : ""}
            )
          </Box>
          <VerseContainer
            textAlign={"center"}
            bgColor={chosenColor ? chosenColor.colorCode : "bg.muted"}
            color={
              chosenColor ? getTextColor(chosenColor.colorCode) : undefined
            }
            padding={"4px"}
            mb={"5px"}
            borderRadius={"0.375rem"}
            lineHeight={"normal"}
          >
            {currentVerse?.versetext}
          </VerseContainer>
          <Flex justify={"center"} flexWrap={"wrap"}>
            {Object.keys(colorsList).map((colorID) => (
              <Box
                padding={"4px"}
                border={"5px solid"}
                borderColor={"bg"}
                minW={"150px"}
                cursor={"pointer"}
                textAlign={"center"}
                fontSize={"large"}
                mb={1}
                bgColor={colorsList[colorID].colorCode}
                color={getTextColor(colorsList[colorID].colorCode)}
                onClick={() => onClickColor(colorsList[colorID])}
                key={colorID}
                style={
                  chosenColor?.colorID === colorID
                    ? {
                        border: "5px solid",
                        borderImage:
                          "linear-gradient(to right, #3acfd5 0%, yellow 25%, #3a4ed5 100%) 1",
                      }
                    : {}
                }
              >
                {colorsList[colorID].colorDisplay}
              </Box>
            ))}
          </Flex>
        </Dialog.Body>
        <Dialog.Footer
          mt={5}
          justifyContent="center"
          borderTop="1px solid"
          borderColor={"border.emphasized"}
        >
          <ButtonGroup>
            <Button onClick={onClose}>Close</Button>
            <Button colorPalette="blue" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
};

export default VerseModal;
