import { memo, useState } from "react";

import { useNote } from "@/hooks/useNote";

import {
  NoteFormContainer,
  NoteFormEditor,
  NoteFormFooter,
} from "@/components/Note/NoteForm";
import NoteContainer, {
  NoteContainerHeader,
} from "@/components/Note/NoteContainer";
import { CollapsibleGeneric } from "@/components/Generic/CollapsibleGeneric";

interface TransComponentProps {
  verseKey: string;
  isOpen: boolean;
}

const TransComponent = memo(({ verseKey, isOpen }: TransComponentProps) => {
  const note = useNote({
    noteType: "translation",
    noteKey: verseKey,
  });

  const [isEditable, setEditable] = useState(note.text ? false : true);

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleInputSubmit = () => {
    setEditable(false);

    note.save();
  };

  const handleInputChange = (value: string) => {
    note.setText(value);
  };

  return (
    <CollapsibleGeneric isOpen={isOpen}>
      {isEditable === false ? (
        <NoteContainer
          isSynced={note.isSynced}
          isSyncing={note.isSyncing}
          inputValue={note.text}
          inputSaved={note.isSaved}
          inputDirection="ltr"
          dateCreated={note.dateCreated}
          dateModified={note.dateModified}
          noteType={note.type}
          noteKey={note.key}
          onClickEditButton={handleEditClick}
          onSaveNote={handleInputSubmit}
        />
      ) : (
        <Versearea
          inputValue={note.text}
          inputSaved={note.isSaved}
          onChangeNote={handleInputChange}
          onSaveNote={handleInputSubmit}
          isSynced={note.isSynced}
          isSyncing={note.isSyncing}
          noteKey={note.key}
          noteType={note.type}
        />
      )}
    </CollapsibleGeneric>
  );
});

TransComponent.displayName = "TransComponent";

interface VerseareaProps {
  inputValue: string;
  inputSaved?: boolean;
  isSynced: boolean;
  isSyncing: boolean;
  noteKey: string;
  noteType: string;
  onChangeNote: (text: string) => void;
  onSaveNote: () => void;
}

const Versearea = ({
  inputValue,
  inputSaved = true,
  onChangeNote,
  onSaveNote,
  isSynced,
  isSyncing,
  noteKey,
  noteType,
}: VerseareaProps) => {
  return (
    <NoteFormContainer onSaveNote={onSaveNote}>
      <NoteContainerHeader
        isSynced={isSynced}
        isSyncing={isSyncing}
        noteKey={noteKey}
        noteType={noteType}
      />
      <NoteFormEditor
        inputDirection="ltr"
        inputValue={inputValue}
        inputSaved={inputSaved}
        onChangeNote={onChangeNote}
      />
      <NoteFormFooter />
    </NoteFormContainer>
  );
};

export default TransComponent;
