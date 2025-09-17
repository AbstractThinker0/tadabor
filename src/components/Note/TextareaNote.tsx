import { useTranslation } from "react-i18next";

import { Box, Flex } from "@chakra-ui/react";

import TextareaAutosize from "@/components/Note/TextareaAutosize";
import { ButtonCancel, ButtonSave } from "@/components/Generic/Buttons";
import { TextareaHeader } from "@/components/Note/TextareaHeader";

interface TextareaNoteProps {
  isSynced: boolean;
  isSyncing: boolean;
  isOutOfSync: boolean;
  noteType?: string;
  noteKey?: string;
  preSaveText?: string;
  inputValue: string;
  inputDirection: string;
  inputSaved?: boolean;
  handleSetDirection: (dir: string) => void;
  onChangeNote: (text: string) => void;
  onSaveNote: () => void;
  onClickCancelButton: () => void;
}

const TextareaNote = ({
  isSynced,
  isSyncing,
  isOutOfSync,
  noteType,
  noteKey,
  preSaveText,
  inputValue,
  inputDirection,
  inputSaved = true,
  handleSetDirection,
  onChangeNote,
  onSaveNote,
  onClickCancelButton,
}: TextareaNoteProps) => {
  const canCancel = preSaveText !== inputValue || inputValue.length > 0;

  return (
    <TextareaNoteContainer onSaveNote={onSaveNote}>
      <TextareaHeader
        handleSetDirection={handleSetDirection}
        noteKey={noteKey}
        noteType={noteType}
        isSynced={isSynced}
        isSyncing={isSyncing}
        isOutOfSync={isOutOfSync}
        inputValue={inputValue}
      />
      <TextareaNoteEditor
        inputValue={inputValue}
        inputDirection={inputDirection}
        inputSaved={inputSaved}
        onChangeNote={onChangeNote}
      />
      <TextareaNoteFooter
        onClickCancelButton={onClickCancelButton}
        canCancel={canCancel}
      />
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
      data-incomplete={inputSaved === false ? true : undefined}
      _incomplete={{
        borderColor: "yellow.solid",
        outlineColor: "yellow.solid",
      }}
    />
  );
};

interface TextareaNoteFooterProps {
  onClickCancelButton?: () => void;
  canCancel: boolean;
}

const TextareaNoteFooter = ({
  onClickCancelButton,
  canCancel,
}: TextareaNoteFooterProps) => {
  return (
    <Flex justifyContent={"center"} gap={"1rem"} pt={"0.5rem"}>
      <ButtonCancel onClick={onClickCancelButton} disabled={!canCancel} />

      <ButtonSave />
    </Flex>
  );
};

export { TextareaNoteContainer, TextareaNoteEditor, TextareaNoteFooter };
export default TextareaNote;
