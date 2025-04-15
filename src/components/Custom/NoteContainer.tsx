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
    <Box px={"0.5rem"} pb={"0.5rem"} pt={"3rem"}>
      <Box
        py={2}
        px={3}
        mb={2}
        border={"1px solid"}
        borderColor={"green.solid"}
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
      <Box textAlign={"center"}>
        <ButtonEdit onClick={onClickEditButton} />
      </Box>
    </Box>
  );
};

export default NoteContainer;
