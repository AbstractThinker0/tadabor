import { useTranslation } from "react-i18next";

import { Box } from "@chakra-ui/react";

import TextareaToolbar from "@/components/Generic/TextareaToolbar";

import TextareaAutosize from "@/components/Custom/TextareaAutosize";
import { ButtonSave } from "@/components/Generic/Buttons";

interface NoteFormProps {
  preSaveText?: string;
  inputValue: string;
  inputDirection: string;
  inputSaved?: boolean;
  handleSetDirection: (dir: string) => void;
  onChangeNote: (text: string) => void;
  onSaveNote: () => void;
}

const NoteForm = ({
  inputValue,
  inputDirection,
  inputSaved = true,
  handleSetDirection,
  onChangeNote,
  onSaveNote,
}: NoteFormProps) => {
  return (
    <NoteFormContainer onSaveNote={onSaveNote}>
      <TextareaToolbar handleSetDirection={handleSetDirection} />
      <NoteFormEditor
        inputValue={inputValue}
        inputDirection={inputDirection}
        inputSaved={inputSaved}
        onChangeNote={onChangeNote}
      />
      <NoteFormFooter />
    </NoteFormContainer>
  );
};

interface NoteFormContainerProps {
  onSaveNote: () => void;
  children: React.ReactNode;
}

const NoteFormContainer = ({
  onSaveNote,
  children,
}: NoteFormContainerProps) => {
  const onSubmitNote = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    onSaveNote();
  };
  return (
    <Box as="form" onSubmit={onSubmitNote} padding={"0.5rem"}>
      {children}
    </Box>
  );
};

interface NoteFormEditorProps {
  inputValue: string;
  inputDirection?: string;
  inputSaved?: boolean;
  onChangeNote: (text: string) => void;
}

const NoteFormEditor = ({
  inputValue,
  inputDirection = "",
  inputSaved = true,
  onChangeNote,
}: NoteFormEditorProps) => {
  const { t } = useTranslation();

  const onChangeTextarea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeNote(event.target.value);
  };

  return (
    <TextareaAutosize
      value={inputValue}
      dir={inputDirection}
      onChange={onChangeTextarea}
      placeholder={t("text_form")}
      required
      borderRadius={"2xl"}
      colorPalette={"blue"}
      data-incomplete={!inputSaved ? true : undefined}
      _incomplete={{
        borderColor: "yellow.solid",
        outlineColor: "yellow.solid",
      }}
    />
  );
};

const NoteFormFooter = () => {
  return (
    <Box textAlign={"center"}>
      <ButtonSave />
    </Box>
  );
};

export { NoteFormContainer, NoteFormEditor, NoteFormFooter };
export default NoteForm;
