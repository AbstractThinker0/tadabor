import { useAppSelector } from "@/store";

import { Box, Text } from "@chakra-ui/react";
import { ButtonEdit } from "@/components/Generic/Buttons";

interface NoteContainerProps {
  inputValue: string;
  inputDirection: string;
  onClickEditButton: () => void;
}

const NoteContainer = ({
  inputValue,
  inputDirection,
  onClickEditButton,
}: NoteContainerProps) => {
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  return (
    <Box pt={10}>
      <Box
        pt={2}
        px={3}
        mb={2}
        border={"1px solid"}
        borderColor={"green.solid"}
        borderRadius={"0.375rem"}
        dir={inputDirection}
      >
        <Text whiteSpace={"pre-wrap"} fontSize={`${notesFS}rem`} pb={2} mb={10}>
          {inputValue}
        </Text>
      </Box>
      <Box textAlign={"center"}>
        <ButtonEdit onClick={onClickEditButton} />
      </Box>
    </Box>
  );
};

export default NoteContainer;
