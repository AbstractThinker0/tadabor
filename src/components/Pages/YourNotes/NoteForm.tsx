import { useTranslation } from "react-i18next";
import { Box, Flex } from "@chakra-ui/react";

import TextareaAutosize from "@/components/Custom/TextareaAutosize";
import TextareaToolbar from "@/components/Generic/TextareaToolbar";
import { ButtonSave } from "@/components/Generic/Buttons";

interface NoteFormProps {
  inputValue: string;
  inputDirection: string;
  handleFormSubmit: () => void;
  handleSetDirection: (dir: string) => void;
  handleTextChange: (value: string) => void;
}

const NoteForm = ({
  inputValue,
  inputDirection,
  handleFormSubmit,
  handleSetDirection,
  handleTextChange,
}: NoteFormProps) => {
  const { t } = useTranslation();

  const onSubmitForm = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    handleFormSubmit();
  };

  const onChangeTextarea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleTextChange(event.target.value);
  };

  return (
    <Box as="form" onSubmit={onSubmitForm}>
      <Box p={2}>
        <TextareaToolbar handleSetDirection={handleSetDirection} />
        <TextareaAutosize
          value={inputValue}
          dir={inputDirection}
          onChange={onChangeTextarea}
          lineHeight={"normal"}
          placeholder={t("text_form")}
          required
        />
      </Box>
      <Flex
        p={3}
        justifyContent={"center"}
        backgroundColor={"gray.muted"}
        borderTop={"1px solid"}
        borderColor={"border.emphasized"}
      >
        <ButtonSave />
      </Flex>
    </Box>
  );
};

export default NoteForm;
