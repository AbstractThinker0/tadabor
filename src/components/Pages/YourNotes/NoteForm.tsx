import { useTranslation } from "react-i18next";
import { CardBody, CardFooter, FormControl, Button } from "@chakra-ui/react";

import TextareaAutosize from "@/components/Custom/TextareaAutosize";
import TextareaToolbar from "@/components/Generic/TextareaToolbar";

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
    <FormControl as="form" onSubmit={onSubmitForm}>
      <CardBody>
        <TextareaToolbar handleSetDirection={handleSetDirection} />
        <TextareaAutosize
          value={inputValue}
          dir={inputDirection}
          onChange={onChangeTextarea}
          lineHeight={"normal"}
          placeholder={t("text_form")}
          isRequired
        />
      </CardBody>
      <CardFooter
        justify={"center"}
        backgroundColor={"rgba(33, 37, 41, .03)"}
        borderTop={"1px solid rgba(0, 0, 0, .175)"}
      >
        <Button
          type="submit"
          colorScheme="green"
          size="sm"
          fontWeight={"normal"}
        >
          {t("text_save")}
        </Button>
      </CardFooter>
    </FormControl>
  );
};

export default NoteForm;
