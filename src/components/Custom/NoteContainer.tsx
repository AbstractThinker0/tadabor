import { useAppSelector } from "@/store";

import { Box, Flex, Text } from "@chakra-ui/react";
import { ButtonEdit, ButtonSave } from "@/components/Generic/Buttons";

interface NoteContainerProps {
  inputValue: string;
  inputDirection: string;
  inputSaved?: boolean;
  onClickEditButton: () => void;
  onSubmitForm: (event: React.FormEvent<HTMLDivElement>) => void;
}

const NoteContainer = ({
  inputValue,
  inputDirection,
  inputSaved = true,
  onClickEditButton,
  onSubmitForm,
}: NoteContainerProps) => {
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  return (
    <Box
      as="form"
      onSubmit={onSubmitForm}
      px={"0.5rem"}
      pb={"0.5rem"}
      pt={"3rem"}
    >
      <Box
        py={2}
        px={3}
        mb={2}
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
      <Flex justifyContent={"center"} gap={"1rem"}>
        <ButtonEdit onClick={onClickEditButton} />
        {!inputSaved && <ButtonSave />}
      </Flex>
    </Box>
  );
};

export default NoteContainer;
