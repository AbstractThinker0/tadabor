import { useNavigationStore } from "@/store/global/navigationStore";

import { Box, Flex, Text } from "@chakra-ui/react";

import {
  ButtonCancel,
  ButtonEdit,
  ButtonSave,
} from "@/components/Generic/Buttons";
import { NoteText } from "@/components/Note/NoteText";

import { NoteTitle } from "@/components/Note/NoteTitle";

import { ButtonCopy } from "@/components/Custom/ButtonCopy";

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
        inputValue={inputValue}
        inputSaved={inputSaved}
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
  inputValue: string;
  inputSaved: boolean;
}

const NoteContainerHeader = ({
  noteType,
  noteKey,
  isSyncing,
  isSynced,
  isOutOfSync,
  inputValue,
  inputSaved,
}: NoteContainerHeaderProps) => {
  const pageDirection = useNavigationStore((state) => state.pageDirection);

  const isPendingSave = !inputSaved || !inputValue;

  return (
    <Flex
      dir={pageDirection}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <NoteTitle
        noteKey={noteKey}
        noteType={noteType}
        isSynced={isSynced}
        isSyncing={isSyncing}
        isOutOfSync={isOutOfSync}
        isPendingSave={isPendingSave}
      />

      <ButtonCopy copyText={inputValue} copyNotice="Copied note to clipboard" />
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
  const isMobile = useNavigationStore((state) => state.isSmallScreen);

  // Show Cancel/Save only when there are unsaved changes AND not currently syncing
  const showCancelSave = !inputSaved && !isSyncing;

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
        {showCancelSave && <ButtonCancel onClick={onClickCancelButton} />}

        <ButtonEdit onClick={onClickEditButton} loading={isSyncing} />

        {showCancelSave && <ButtonSave />}
      </Flex>
    </>
  );
};

export default NoteContainer;
