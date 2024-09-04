import { useTranslation } from "react-i18next";

import { Box, Button, FormControl } from "@chakra-ui/react";

import TextareaToolbar from "@/components/Generic/TextareaToolbar";

import TextareaAutosize from "@/components/Custom/TextareaAutosize";

interface NoteFormProps {
  inputValue: string;
  inputDirection: string;
  handleSetDirection: (dir: string) => void;
  onChangeTextarea: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmitForm: (event: React.FormEvent<HTMLDivElement>) => void;
}

const NoteForm = ({
  inputValue,
  inputDirection,
  handleSetDirection,
  onChangeTextarea,
  onSubmitForm,
}: NoteFormProps) => {
  const { t } = useTranslation();

  return (
    <FormControl as="form" onSubmit={onSubmitForm}>
      <TextareaToolbar handleSetDirection={handleSetDirection} />
      <TextareaAutosize
        value={inputValue}
        dir={inputDirection}
        onChange={onChangeTextarea}
        lineHeight={"normal"}
        placeholder={t("text_form")}
        isRequired
      />
      <Box textAlign={"center"}>
        <Button
          type="submit"
          colorScheme="green"
          size="sm"
          fontWeight={"normal"}
        >
          {t("text_save")}
        </Button>
      </Box>
    </FormControl>
  );
};

export default NoteForm;
