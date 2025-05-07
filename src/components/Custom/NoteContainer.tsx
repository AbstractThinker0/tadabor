import { useAppSelector } from "@/store";

import { Box, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { ButtonEdit, ButtonSave } from "@/components/Generic/Buttons";
import { Tooltip } from "@/components/ui/tooltip";

import { MdOutlineCheckCircle } from "react-icons/md";
import useQuran from "@/context/useQuran";
import { useTranslation } from "react-i18next";

interface NoteContainerProps {
  isSynced: boolean;
  isSyncing: boolean;
  inputValue: string;
  inputDirection: string;
  inputSaved?: boolean;
  dateCreated?: number;
  dateModified?: number;
  noteType?: string;
  noteKey?: string;
  onClickEditButton: () => void;
  onSubmitForm: (event: React.FormEvent<HTMLDivElement>) => void;
}

const NoteContainer = ({
  isSynced,
  isSyncing,
  inputValue,
  inputDirection,
  inputSaved = true,
  dateCreated,
  dateModified,
  noteType,
  noteKey,
  onClickEditButton,
  onSubmitForm,
}: NoteContainerProps) => {
  const { t } = useTranslation();

  const notesFS = useAppSelector((state) => state.settings.notesFontSize);
  const isMobile = useAppSelector((state) => state.navigation.isSmallScreen);

  const quranService = useQuran();

  const getSyncTooltip = (isSyncing: boolean, isSynced: boolean): string => {
    if (isSyncing) return "Syncing note...";
    if (isSynced) return "Note is synced to the cloud.";
    return "Saved locally. Log in to enable cloud sync.";
  };

  const getNoteTitle = () => {
    if (noteType === "verse") {
      return `${t("noteVerse")} (${quranService.convertKeyToSuffix(noteKey!)})`;
    } else if (noteType === "root") {
      return `${t("noteRoot")} (${quranService.getRootNameByID(noteKey!)})`;
    }
  };

  return (
    <Box
      as="form"
      onSubmit={onSubmitForm}
      px={"0.5rem"}
      pb={"0.5rem"}
      pt={"0.1rem"}
    >
      <Flex justifyContent={"space-between"}>
        <Box>
          <Tooltip content={getSyncTooltip(isSyncing, isSynced)}>
            {isSyncing ? (
              <Spinner size="sm" color="blue.500" />
            ) : (
              <Icon
                as={MdOutlineCheckCircle}
                color={isSynced ? "green.500" : "gray.500"}
                boxSize={4}
              />
            )}
          </Tooltip>
        </Box>
        <Text dir={"auto"} fontSize="lg" fontWeight="bold" color={"gray.600"}>
          {getNoteTitle()}
        </Text>
      </Flex>
      <Box
        pt={"0.1rem"}
        pb={2}
        px={3}
        border={"1px solid"}
        borderColor={inputSaved ? "green.solid" : "yellow.solid"}
        borderRadius={"2xl"}
      >
        <Text
          whiteSpace={"pre-wrap"}
          fontSize={`${notesFS}rem`}
          dir={inputDirection}
          mb={"5.5rem"}
        >
          {inputValue}
        </Text>
      </Box>
      {/* Date output */}
      {(dateCreated || dateModified) && (
        <Flex
          fontSize="xs"
          color="gray.500"
          px={1}
          mdDown={{ px: "0" }}
          justifyContent={"space-between"}
        >
          {dateCreated && (
            <Text>
              Created:{" "}
              {new Date(dateCreated).toLocaleString(undefined, {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              })}
            </Text>
          )}
          {dateModified && (
            <Text>
              {isMobile ? "Modified: " : "Last modified: "}
              {new Date(dateModified).toLocaleString(undefined, {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              })}
            </Text>
          )}
        </Flex>
      )}
      <Flex justifyContent={"center"} gap={"1rem"}>
        <ButtonEdit onClick={onClickEditButton} />
        {!inputSaved && <ButtonSave />}
      </Flex>
    </Box>
  );
};

export default NoteContainer;
