import { useColoringPageStore } from "@/store/pages/coloringPage";
import { useTranslation } from "react-i18next";

import { getTextColor } from "@/components/Pages/Coloring/util";

import { Text, Span } from "@chakra-ui/react";

import { ConfirmationModal } from "@/components/Generic/ConfirmationModal";

interface DeleteColorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteColorModal = ({ isOpen, onClose }: DeleteColorModalProps) => {
  const { t } = useTranslation();
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
      title={t("coloring.delete.title")}
      confirmText={t("coloring.delete.confirm")}
    >
      <Text>
        {t("coloring.delete.body_prefix")}{" "}
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
        {t("coloring.delete.body_suffix")}
      </Text>
      <Text>
        {t("coloring.delete.affected_verses", {
          count: getColoredVerses(currentColor?.colorID),
        })}
      </Text>
    </ConfirmationModal>
  );
};

export { DeleteColorModal };
