import { useEffect, useEffectEvent, useState } from "react";

import { useColoringPageStore } from "@/store/zustand/coloringPage";

import useQuran from "@/context/useQuran";

import type { colorProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

import { Dialog, Button, Box, Flex, ButtonGroup } from "@chakra-ui/react";

import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";

import VerseContainer from "@/components/Custom/VerseContainer";

interface VerseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerseModal = ({ isOpen, onClose }: VerseModalProps) => {
  const currentVerse = useColoringPageStore((state) => state.currentVerse);
  const coloredVerses = useColoringPageStore((state) => state.coloredVerses);
  const colorsList = useColoringPageStore((state) => state.colorsList);

  const setVerseColor = useColoringPageStore((state) => state.setVerseColor);
  const setCurrentVerse = useColoringPageStore(
    (state) => state.setCurrentVerse
  );
  const quranService = useQuran();

  const [chosenColor, setChosenColor] = useState<colorProps | null>(null);

  const onVerseChange = useEffectEvent(() => {
    if (currentVerse?.key && coloredVerses[currentVerse.key]) {
      setChosenColor(coloredVerses[currentVerse.key]);
    }
  });

  // Sync chosenColor with the current verse's color when modal opens
  useEffect(() => {
    onVerseChange();
  }, [currentVerse]);

  const onCloseModal = () => {
    onClose();
    setChosenColor(null);
    setCurrentVerse(null);
  };

  const onClickSave = async () => {
    if (currentVerse?.key) {
      await setVerseColor(currentVerse.key, chosenColor);
    }
    onCloseModal();
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
      onInteractOutside={onCloseModal}
      placement={"center"}
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
              ? `${quranService.getChapterName(currentVerse.suraid)}:${currentVerse.verseid
              }`
              : ""}
            )
          </Box>
          <VerseContainer
            displayMode="default"
            center
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
            <Button onClick={onCloseModal}>Close</Button>
            <Button colorPalette="blue" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onCloseModal} />
      </DialogContent>
    </Dialog.Root>
  );
};

export default VerseModal;
