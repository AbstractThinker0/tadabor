import { useAppSelector } from "@/store";

import { Box, Flex, Icon, Spinner, Text } from "@chakra-ui/react";

import {
  ButtonCancel,
  ButtonEdit,
  ButtonSave,
} from "@/components/Generic/Buttons";
import { NoteText } from "@/components/Note/NoteText";

import { Tooltip } from "@/components/ui/tooltip-mobile";

import { MdOutlineCheckCircle } from "react-icons/md";
import useQuran from "@/context/useQuran";
import { useTranslation } from "react-i18next";

interface NoteContainerProps {
  isSynced: boolean;
  isSyncing: boolean;
  isOutOfSync: boolean;
  inputValue: string;
  inputDirection?: string;
  inputSaved?: boolean;
  dateCreated?: number;
  dateModified?: number;
  noteType?: string;
  noteKey?: string;
  onClickEditButton: () => void;
  onClickCancelButton: () => void;
  onSaveNote: () => void;
}

const NoteContainer = ({
  isSynced,
  isSyncing,
  isOutOfSync,
  inputValue,
  inputDirection = "",
  inputSaved = true,
  dateCreated,
  dateModified,
  noteType,
  noteKey,
  onClickEditButton,
  onClickCancelButton,
  onSaveNote,
}: NoteContainerProps) => {
  const onSubmitNote = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    onSaveNote();
  };

  return (
    <Box
      as="form"
      onSubmit={onSubmitNote}
      px={"0.5rem"}
      pb={"0.5rem"}
      pt={"0.1rem"}
    >
      <NoteContainerHeader
        noteKey={noteKey}
        noteType={noteType}
        isSynced={isSynced}
        isSyncing={isSyncing}
        isOutOfSync={isOutOfSync}
      />
      <NoteContainerBody
        inputSaved={inputSaved}
        inputValue={inputValue}
        inputDirection={inputDirection}
      />
      <NoteContainerFooter
        isSyncing={isSyncing}
        inputSaved={inputSaved}
        dateCreated={dateCreated}
        dateModified={dateModified}
        onClickEditButton={onClickEditButton}
        onClickCancelButton={onClickCancelButton}
      />
    </Box>
  );
};

interface NoteContainerHeaderProps {
  noteType?: string;
  noteKey?: string;
  isSyncing: boolean;
  isSynced: boolean;
  isOutOfSync: boolean;
}

const NoteContainerHeader = ({
  noteType,
  noteKey,
  isSyncing,
  isSynced,
  isOutOfSync,
}: NoteContainerHeaderProps) => {
  const { t } = useTranslation();

  const quranService = useQuran();

  const isLogged = useAppSelector((state) => state.user.isLogged);

  const getSyncTooltip = (isSyncing: boolean, isSynced: boolean): string => {
    if (isSyncing) return "Syncing note...";
    if (isSynced) return "Note is synced to the cloud.";
    if (isOutOfSync) return "Note is out of sync.";
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
      <Text fontSize="lg" fontWeight="bold" color={"gray.600"} py={"6px"}>
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

interface NoteContainerBodyProps {
  inputSaved: boolean;
  inputValue: string;
  inputDirection?: string;
}

const NoteContainerBody = ({
  inputSaved,
  inputValue,
  inputDirection,
}: NoteContainerBodyProps) => {
  return (
    <Box
      pt={"0.1rem"}
      pb={2}
      px={3}
      border={"1px solid"}
      borderColor={inputSaved ? "green.solid" : "yellow.solid"}
      borderRadius={"2xl"}
      dir={inputDirection}
    >
      <NoteText dir={inputDirection} mb={"50px"} pt={"6px"}>
        {inputValue}
      </NoteText>
    </Box>
  );
};

interface NoteContainerFooterProps {
  isSyncing: boolean;
  inputSaved?: boolean;
  dateCreated?: number;
  dateModified?: number;
  onClickEditButton: () => void;
  onClickCancelButton: () => void;
}

const NoteContainerFooter = ({
  isSyncing,
  inputSaved = true,
  dateCreated,
  dateModified,
  onClickEditButton,
  onClickCancelButton,
}: NoteContainerFooterProps) => {
  const isMobile = useAppSelector((state) => state.navigation.isSmallScreen);

  return (
    <>
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
        {!inputSaved && !isSyncing && (
          <ButtonCancel onClick={onClickCancelButton} />
        )}

        <ButtonEdit onClick={onClickEditButton} loading={isSyncing} />

        {!inputSaved && !isSyncing && <ButtonSave />}
      </Flex>
    </>
  );
};

export default NoteContainer;
