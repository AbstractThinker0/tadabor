import { useTranslation } from "react-i18next";

import { Box, Button, FormControl, IconButton } from "@chakra-ui/react";

import {
  IconTextDirectionLtr,
  IconTextDirectionRtl,
} from "@/components/Generic/Icons";
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
      <Box dir="ltr" textAlign="center" lineHeight={1}>
        <IconButton
          variant="ghost"
          aria-label="ltr"
          icon={<IconTextDirectionLtr />}
          onClick={() => handleSetDirection("ltr")}
        />
        <IconButton
          variant="ghost"
          aria-label="rtl"
          icon={<IconTextDirectionRtl />}
          onClick={() => handleSetDirection("rtl")}
        />
      </Box>
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
