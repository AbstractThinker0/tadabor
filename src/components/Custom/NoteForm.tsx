import { useTranslation } from "react-i18next";

import { Box } from "@chakra-ui/react";

import TextareaToolbar from "@/components/Generic/TextareaToolbar";

import TextareaAutosize from "@/components/Custom/TextareaAutosize";
import { ButtonSave } from "@/components/Generic/Buttons";

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
    <Box as="form" onSubmit={onSubmitForm} padding={"0.5rem"}>
      <TextareaToolbar handleSetDirection={handleSetDirection} />
      <TextareaAutosize
        value={inputValue}
        dir={inputDirection}
        onChange={onChangeTextarea}
        lineHeight={"normal"}
        placeholder={t("text_form")}
        required
        borderRadius={"2xl"}
        colorPalette={"blue"}
      />
      <Box textAlign={"center"}>
        <ButtonSave />
      </Box>
    </Box>
  );
};

export default NoteForm;
