import { useState } from "react";

import { Box, Collapsible } from "@chakra-ui/react";

import NoteForm from "@/components/Custom/NoteForm";
import NoteContainer from "@/components/Custom/NoteContainer";

import { useNote } from "@/hooks/useNote";

interface CollapsibleNoteProps {
  isOpen: boolean;
  noteID?: string;
  noteType?: "verse" | "root" | "translation";
  noteKey?: string;
}

const CollapsibleNote = ({
  isOpen,
  noteID,
  noteType,
  noteKey,
}: CollapsibleNoteProps) => {
  const note = useNote({
    noteID,
    noteType,
    noteKey,
  });

  const [isEditable, setEditable] = useState(note.text ? false : true);

  const handleSetDirection = (dir: string) => {
    note.setDirection(dir);
  };

  const onChangeTextarea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    note.setText(event.target.value);
  };

  const onSubmitForm = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    note.save();

    setEditable(false);
  };

  const onClickEditButton = () => {
    setEditable(true);
  };

  return (
    <CollapsibleGeneric
      isOpen={isOpen}
      inputValue={note.text}
      inputDirection={note.direction}
      inputSaved={note.isSaved}
      isEditable={isEditable}
      isSynced={note.isSynced}
      isSyncing={note.isSyncing}
      dateCreated={note.dateCreated}
      dateModified={note.dateModified}
      noteType={note.type}
      noteKey={note.key}
      handleSetDirection={handleSetDirection}
      onChangeTextarea={onChangeTextarea}
      onSubmitForm={onSubmitForm}
      onClickEditButton={onClickEditButton}
    />
  );
};

interface CollapsibleGenericProps {
  isOpen: boolean;
  isEditable: boolean;
  isSynced: boolean;
  isSyncing: boolean;
  inputValue: string;
  inputDirection: string;
  inputSaved: boolean;
  dateCreated?: number;
  dateModified?: number;
  noteType?: string;
  noteKey?: string;
  onClickEditButton: () => void;
  handleSetDirection: (dir: string) => void;
  onChangeTextarea: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmitForm: (event: React.FormEvent<HTMLDivElement>) => void;
}

const CollapsibleGeneric = ({
  isOpen,
  isEditable,
  isSynced,
  isSyncing,
  inputValue,
  inputDirection,
  inputSaved,
  dateCreated,
  dateModified,
  noteType,
  noteKey,
  onClickEditButton,
  handleSetDirection,
  onChangeTextarea,
  onSubmitForm,
}: CollapsibleGenericProps) => {
  return (
    <Collapsible.Root open={isOpen} lazyMount unmountOnExit>
      <Collapsible.Content>
        <FormText
          isEditable={isEditable}
          isSynced={isSynced}
          isSyncing={isSyncing}
          inputValue={inputValue}
          inputDirection={inputDirection}
          inputSaved={inputSaved}
          dateCreated={dateCreated}
          dateModified={dateModified}
          noteType={noteType}
          noteKey={noteKey}
          onClickEditButton={onClickEditButton}
          handleSetDirection={handleSetDirection}
          onChangeTextarea={onChangeTextarea}
          onSubmitForm={onSubmitForm}
        />
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

interface FormTextProps {
  isEditable: boolean;
  isSynced: boolean;
  isSyncing: boolean;
  inputValue: string;
  inputDirection: string;
  inputSaved?: boolean;
  dateCreated?: number;
  dateModified?: number;
  noteType?: string;
  noteKey?: string;
  onClickEditButton: () => void;
  handleSetDirection: (dir: string) => void;
  onChangeTextarea: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmitForm: (event: React.FormEvent<HTMLDivElement>) => void;
}

const FormText = ({
  isEditable,
  isSynced,
  isSyncing,
  inputValue,
  inputDirection,
  inputSaved = true,
  dateCreated,
  dateModified,
  noteType,
  noteKey,
  onClickEditButton,
  handleSetDirection,
  onChangeTextarea,
  onSubmitForm,
}: FormTextProps) => {
  return (
    <Box
      color={"fg"}
      bgColor={"bg.panel"}
      pb={1}
      px={1}
      border="1px solid"
      borderColor={"border"}
      borderRadius={"l3"}
    >
      {isEditable === false ? (
        <NoteContainer
          isSynced={isSynced}
          isSyncing={isSyncing}
          inputValue={inputValue}
          inputDirection={inputDirection}
          inputSaved={inputSaved}
          dateCreated={dateCreated}
          dateModified={dateModified}
          noteType={noteType}
          noteKey={noteKey}
          onClickEditButton={onClickEditButton}
          onSubmitForm={onSubmitForm}
        />
      ) : (
        <NoteForm
          inputValue={inputValue}
          inputDirection={inputDirection}
          inputSaved={inputSaved}
          handleSetDirection={handleSetDirection}
          onChangeTextarea={onChangeTextarea}
          onSubmitForm={onSubmitForm}
        />
      )}
    </Box>
  );
};

export { CollapsibleNote, CollapsibleGeneric, FormText };
