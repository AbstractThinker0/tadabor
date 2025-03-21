import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { dbFuncs } from "@/util/db";

import { getTextColor } from "@/components/Pages/Coloring/util";

import { Dialog, Button, ButtonGroup, Text, Box } from "@chakra-ui/react";

import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";

interface DeleteColorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteColorModal = ({ isOpen, onClose }: DeleteColorModalProps) => {
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );
  const currentColor = useAppSelector(
    (state) => state.coloringPage.currentColor
  );

  const dispatch = useAppDispatch();

  function deleteColor(colorID: string) {
    dispatch(coloringPageActions.deleteColor(colorID));
    dbFuncs.deleteColor(colorID);

    for (const verseKey in coloredVerses) {
      if (coloredVerses[verseKey].colorID === colorID) {
        dbFuncs.deleteVerseColor(verseKey);
      }
    }
  }

  function onClickDelete() {
    if (!currentColor) return;

    deleteColor(currentColor.colorID);
    onClose();
  }

  const getColoredVerses = (colorID: string | undefined) => {
    if (!colorID) return 0;

    return Object.keys(coloredVerses).filter((verseKey) => {
      return coloredVerses[verseKey]?.colorID === colorID;
    }).length;
  };

  return (
    <Dialog.Root
      size="xl"
      open={isOpen}
      onInteractOutside={onClose}
      placement={"center"}
    >
      <DialogContent dir="ltr">
        <Dialog.Header
          borderBottom="1px solid"
          borderColor={"border.emphasized"}
        >
          Delete color confirmation
        </Dialog.Header>
        <Dialog.Body>
          <Text>
            Are you sure you want to delete{" "}
            <Box
              as="span"
              p={1}
              fontFamily={"initial"}
              overflowWrap={"break-word"}
              borderRadius={4}
              backgroundColor={currentColor?.colorCode}
              color={
                currentColor ? getTextColor(currentColor.colorCode) : undefined
              }
            >
              {currentColor?.colorDisplay}
            </Box>{" "}
            color? All verses colored with this color will be uncolored.
          </Text>
          <Text>
            Number of verses affected: {getColoredVerses(currentColor?.colorID)}
          </Text>
        </Dialog.Body>
        <Dialog.Footer
          mt={5}
          justifyContent="center"
          borderTop="1px solid"
          borderColor={"border.emphasized"}
        >
          <ButtonGroup>
            <Button colorPalette="gray" onClick={onClose}>
              No, Cancel
            </Button>

            <Button colorPalette="red" onClick={onClickDelete}>
              Yes, delete
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
};

export default DeleteColorModal;
