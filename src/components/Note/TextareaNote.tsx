import { useTranslation } from "react-i18next";

import { Box } from "@chakra-ui/react";

import TextareaToolbar from "@/components/Note/TextareaToolbar";

import TextareaAutosize from "@/components/Note/TextareaAutosize";
import { ButtonSave } from "@/components/Generic/Buttons";

interface TextareaNoteProps {
  preSaveText?: string;
  inputValue: string;
  inputDirection: string;
  inputSaved?: boolean;
  handleSetDirection: (dir: string) => void;
  onChangeNote: (text: string) => void;
  onSaveNote: () => void;
}

const TextareaNote = ({
  inputValue,
  inputDirection,
  inputSaved = true,
  handleSetDirection,
  onChangeNote,
  onSaveNote,
}: TextareaNoteProps) => {
  return (
    <TextareaNoteContainer onSaveNote={onSaveNote}>
      <TextareaToolbar handleSetDirection={handleSetDirection} />
      <TextareaNoteEditor
        inputValue={inputValue}
        inputDirection={inputDirection}
        inputSaved={inputSaved}
        onChangeNote={onChangeNote}
      />
      <TextareaNoteFooter />
    </TextareaNoteContainer>
  );
};

interface TextareaNoteContainerProps {
  onSaveNote: () => void;
  children: React.ReactNode;
}

const TextareaNoteContainer = ({
  onSaveNote,
  children,
}: TextareaNoteContainerProps) => {
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

interface TextareaNoteEditorProps {
  inputValue: string;
  inputDirection?: string;
  inputSaved?: boolean;
  onChangeNote: (text: string) => void;
}

const TextareaNoteEditor = ({
  inputValue,
  inputDirection = "",
  inputSaved = true,
  onChangeNote,
}: TextareaNoteEditorProps) => {
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

const TextareaNoteFooter = () => {
  return (
    <Box textAlign={"center"}>
      <ButtonSave />
    </Box>
  );
};

export { TextareaNoteContainer, TextareaNoteEditor, TextareaNoteFooter };
export default TextareaNote;
