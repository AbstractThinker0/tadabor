import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/store";
import { CardBody, CardFooter, Button, Text } from "@chakra-ui/react";

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
  const { t } = useTranslation();
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  return (
    <>
      <CardBody dir={inputDirection}>
        <Text whiteSpace={"pre-wrap"} fontSize={`${notesFS}rem`}>
          {inputValue}
        </Text>
      </CardBody>
      <CardFooter
        justify={"center"}
        backgroundColor={"rgba(33, 37, 41, .03)"}
        borderTop={"1px solid rgba(0, 0, 0, .175)"}
      >
        <Button
          onClick={onClickEditButton}
          colorScheme="blue"
          size="sm"
          fontWeight={"normal"}
        >
          {t("text_edit")}
        </Button>
      </CardFooter>
    </>
  );
};

export default NoteText;
