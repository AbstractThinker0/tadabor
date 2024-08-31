import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/store";

import { Box, Text, Button } from "@chakra-ui/react";

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
  const { t } = useTranslation();
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  return (
    <Box pt={10}>
      <Box
        pt={2}
        px={4}
        border={"1px solid green"}
        borderRadius={"0.375rem"}
        dir={inputDirection}
      >
        <Text whiteSpace={"pre-wrap"} fontSize={`${notesFS}rem`} mb={12}>
          {inputValue}
        </Text>
      </Box>
      <Box textAlign={"center"}>
        <Button
          onClick={onClickEditButton}
          colorScheme="blue"
          size="sm"
          fontWeight={"normal"}
        >
          {t("text_edit")}
        </Button>
      </Box>
    </Box>
  );
};

export default NoteContainer;
