import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useLettersPageStore } from "@/store/pages/lettersPage";

import { dbLetters } from "@/util/dbFuncs";
import { tryCatch } from "@/util/trycatch";

import { Text, Span } from "@chakra-ui/react";

import { ConfirmationModal } from "@/components/Generic/ConfirmationModal";
import { toaster } from "@/components/ui/toaster";

interface DeletePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PresetDeleteSummary {
  affectedDefinitions: number;
  affectedWords: number;
}

const initialSummary: PresetDeleteSummary = {
  affectedDefinitions: 0,
  affectedWords: 0,
};

const DeletePresetModal = ({ isOpen, onClose }: DeletePresetModalProps) => {
  const { t } = useTranslation();

  const currentPreset = useLettersPageStore((state) => state.currentPreset);
  const presetName = useLettersPageStore((state) =>
    state.currentPreset === "-1"
      ? ""
      : state.letterPresets[state.currentPreset] || ""
  );
  const deletePreset = useLettersPageStore((state) => state.deletePreset);

  const [summary, setSummary] = useState<PresetDeleteSummary>(initialSummary);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    if (!isOpen || currentPreset === "-1") return;

    let isMounted = true;

    const loadSummary = async () => {
      setIsLoadingSummary(true);

      const { result, error } = await tryCatch(
        dbLetters.getPresetDeleteSummary(currentPreset)
      );

      if (!isMounted) return;

      if (error) {
        console.error("Failed to load preset delete summary:", error);
        setSummary(initialSummary);
      } else {
        setSummary(result);
      }

      setIsLoadingSummary(false);
    };

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, [currentPreset, isOpen]);

  const onClickDelete = async () => {
    if (currentPreset === "-1") return;

    const success = await deletePreset(currentPreset);

    if (success) {
      toaster.create({
        description: t("save_success"),
        type: "success",
      });
    } else {
      toaster.create({
        description: t("save_failed"),
        type: "error",
      });
    }

    onClose();
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClickDelete}
      title={t("letters.delete.title")}
      confirmText={t("letters.delete.confirm")}
    >
      <Text>
        {t("letters.delete.body_prefix")}{" "}
        <Span
          padding={"3px"}
          bgColor={"red.subtle"}
          wordBreak={"break-all"}
          borderRadius={"0.375rem"}
        >
          {presetName}
        </Span>{" "}
        {t("letters.delete.body_suffix")}
      </Text>
      <Text>
        {isLoadingSummary
          ? t("letters.delete.loading_impact")
          : t("letters.delete.affected_words", {
              count: summary.affectedWords,
            })}
      </Text>
      <Text>
        {t("letters.delete.affected_definitions", {
          count: summary.affectedDefinitions,
        })}
      </Text>
    </ConfirmationModal>
  );
};

export { DeletePresetModal };
