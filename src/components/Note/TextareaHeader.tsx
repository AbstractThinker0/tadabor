import { Box, Flex } from "@chakra-ui/react";

import { useAppSelector } from "@/store";

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
}

const TextareaHeader = ({
  handleSetDirection,
  isSynced,
  isSyncing,
  isOutOfSync,
  noteType,
  noteKey,
  inputValue,
}: TextareaHeaderProps) => {
  const pageDirection = useAppSelector(
    (state) => state.navigation.pageDirection
  );

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
      dir={pageDirection}
    >
      <Box position="absolute" insetInlineStart={0}>
        <NoteTitle
          noteKey={noteKey}
          noteType={noteType}
          isSynced={isSynced}
          isSyncing={isSyncing}
          isOutOfSync={isOutOfSync}
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
