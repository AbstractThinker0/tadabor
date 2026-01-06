import { Box, Flex } from "@chakra-ui/react";

import { useNavigationStore } from "@/store/zustand/navigationStore";

import { NoteTitle } from "@/components/Note/NoteTitle";
import TextareaToolbar from "@/components/Note/TextareaToolbar";

import { ButtonCopy } from "@/components/Custom/ButtonCopy";

interface TextareaHeaderProps {
  handleSetDirection: (direction: string) => void;
  noteType?: string;
  noteKey?: string;
  isSynced: boolean;
  isSyncing: boolean;
  isOutOfSync: boolean;
  inputValue: string;
  inputSaved: boolean;
}

const TextareaHeader = ({
  handleSetDirection,
  isSynced,
  isSyncing,
  isOutOfSync,
  noteType,
  noteKey,
  inputValue,
  inputSaved,
}: TextareaHeaderProps) => {
  const isPendingSave = !inputSaved || !inputValue;

  const pageDirection = useNavigationStore((state) => state.pageDirection);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
      dir={pageDirection}
      pb={"6px"}
    >
      <Box position="absolute" insetInlineStart={0}>
        <NoteTitle
          noteKey={noteKey}
          noteType={noteType}
          isSynced={isSynced}
          isSyncing={isSyncing}
          isOutOfSync={isOutOfSync}
          isPendingSave={isPendingSave}
        />
      </Box>
      <TextareaToolbar handleSetDirection={handleSetDirection} />
      <Box position="absolute" insetInlineEnd={0}>
        <ButtonCopy
          copyText={inputValue}
          copyNotice="Copied note to clipboard"
        />
      </Box>
    </Flex>
  );
};

export { TextareaHeader };
