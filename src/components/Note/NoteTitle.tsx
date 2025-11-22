import { useAppSelector } from "@/store";

import { Flex, Icon, Spinner, Text } from "@chakra-ui/react";

import { Tooltip } from "@/components/ui/tooltip-mobile";

import { MdOutlineCheckCircle } from "react-icons/md";
import useQuran from "@/context/useQuran";
import { useTranslation } from "react-i18next";

interface NoteTitleProps {
  noteType?: string;
  noteKey?: string;
  isSyncing: boolean;
  isSynced: boolean;
  isOutOfSync: boolean;
  isPendingSave: boolean;
}

const NoteTitle = ({
  noteType,
  noteKey,
  isSyncing,
  isSynced,
  isOutOfSync,
  isPendingSave
}: NoteTitleProps) => {
  const { t } = useTranslation();

  const quranService = useQuran();

  const isLogged = useAppSelector((state) => state.user.isLogged);

  const getSyncTooltip = (isSyncing: boolean, isSynced: boolean): string => {
    if (isSyncing) return "Syncing note...";
    if (isSynced) return "Note synced to the cloud.";
    if (isPendingSave) return "Note pending save.";
    if (isOutOfSync) return "Note out of sync.";
    return "Saved locally. Log in to enable cloud sync.";
  };

  const getNoteTitle = () => {
    if (noteType === "verse") {
      return `${t("noteVerse")} (${quranService.convertKeyToSuffix(noteKey!)})`;
    } else if (noteType === "root") {
      return `${t("noteRoot")} (${quranService.getRootNameByID(noteKey!)})`;
    } else if (noteType === "translation") {
      return `${t("translationVerse")} (${quranService.convertKeyToSuffix(
        noteKey!
      )})`;
    }
  };

  return (
    <Flex dir="auto" alignItems={"center"} gap={"0.2rem"}>
      <Text fontSize="sm" color={"gray.600"} py={"6px"}>
        {getNoteTitle()}{" "}
      </Text>
      {isLogged && (
        <Tooltip content={getSyncTooltip(isSyncing, isSynced)}>
          {isSyncing ? (
            <Spinner size="sm" color="blue.500" />
          ) : (
            <Icon
              as={MdOutlineCheckCircle}
              color={
                isOutOfSync ? "orange.500" : isSynced ? "green.500" : "gray.500"
              }
              boxSize={4}
            />
          )}
        </Tooltip>
      )}
    </Flex>
  );
};

export { NoteTitle };
