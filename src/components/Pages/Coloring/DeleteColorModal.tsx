import { useColoringPageStore } from "@/store/pages/coloringPage";

import { getTextColor } from "@/components/Pages/Coloring/util";

import { Text, Span } from "@chakra-ui/react";

import ConfirmationModal from "@/components/Generic/ConfirmationModal";

interface DeleteColorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteColorModal = ({ isOpen, onClose }: DeleteColorModalProps) => {
  const coloredVerses = useColoringPageStore((state) => state.coloredVerses);
  const currentColor = useColoringPageStore((state) => state.currentColor);
  const deleteColor = useColoringPageStore((state) => state.deleteColor);

  async function onClickDelete() {
    if (!currentColor) return;

    await deleteColor(currentColor.colorID);
    onClose();
  }

  const getColoredVerses = (colorID: string | undefined) => {
    if (!colorID) return 0;

    return Object.keys(coloredVerses).filter((verseKey) => {
      return coloredVerses[verseKey]?.colorID === colorID;
    }).length;
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClickDelete}
      title="Delete color confirmation"
      confirmText="Yes, delete"
    >
      <Text>
        Are you sure you want to delete{" "}
        <Span
          p={1}
          fontFamily={"initial"}
          overflowWrap={"break-word"}
          borderRadius={4}
          bgColor={currentColor?.colorCode}
          color={
            currentColor ? getTextColor(currentColor.colorCode) : undefined
          }
        >
          {currentColor?.colorDisplay}
        </Span>{" "}
        color? All verses colored with this color will be uncolored.
      </Text>
      <Text>
        Number of verses affected: {getColoredVerses(currentColor?.colorID)}
      </Text>
    </ConfirmationModal>
  );
};

export default DeleteColorModal;
