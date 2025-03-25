import { useAppSelector } from "@/store";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ButtonEdit } from "@/components/Generic/Buttons";

interface NoteTextProps {
  inputValue: string;
  inputDirection: string;
  onClickEditButton: () => void;
}

const NoteText = ({
  inputValue,
  inputDirection,
  onClickEditButton,
}: NoteTextProps) => {
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  return (
    <>
      <Box dir={inputDirection} p={2}>
        <Text whiteSpace={"pre-wrap"} fontSize={`${notesFS}rem`}>
          {inputValue}
        </Text>
      </Box>
      <Flex
        p={3}
        justifyContent={"center"}
        backgroundColor={"gray.muted"}
        borderTop={"1px solid"}
        borderColor={"border.emphasized"}
      >
        <ButtonEdit onClick={onClickEditButton} />
      </Flex>
    </>
  );
};

export default NoteText;
