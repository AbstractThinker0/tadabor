import { useState } from "react";

import { Box } from "@chakra-ui/react";

import NoteForm from "@/components/Note/NoteForm";
import NoteContainer from "@/components/Note/NoteContainer";

import { CollapsibleGeneric } from "@/components/Generic/CollapsibleGeneric";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

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
    isVisible: isOpen,
  });

  const [isEditable, setEditable] = useState(note.text ? false : true);

  const handleSetDirection = (dir: string) => {
    note.setDirection(dir);
  };

  const onChangeNote = (text: string) => {
    note.setText(text);
  };

  const onSaveNote = () => {
    note.save();

    setEditable(false);
  };

  const onClickEditButton = () => {
    setEditable(true);
  };

  return (
    <CollapsibleGeneric isOpen={isOpen}>
      {note.isLoading ? (
        <LoadingSpinner text="Fetching note.." />
      ) : (
        <FormText
          preSaveText={note.preSaveText}
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
          onChangeNote={onChangeNote}
          onSaveNote={onSaveNote}
          onClickEditButton={onClickEditButton}
        />
      )}
    </CollapsibleGeneric>
  );
};

interface FormTextProps {
  preSaveText?: string;
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
  onChangeNote: (text: string) => void;
  onSaveNote: () => void;
}

const FormText = ({
  preSaveText,
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
  onChangeNote,
  onSaveNote,
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
          onSaveNote={onSaveNote}
        />
      ) : (
        <NoteForm
          preSaveText={preSaveText}
          inputValue={inputValue}
          inputDirection={inputDirection}
          inputSaved={inputSaved}
          handleSetDirection={handleSetDirection}
          onChangeNote={onChangeNote}
          onSaveNote={onSaveNote}
        />
      )}
    </Box>
  );
};

export { CollapsibleNote, FormText };
