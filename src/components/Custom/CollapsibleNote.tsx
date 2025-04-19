import { memo, useState } from "react";

import { RootState, selectNote, selectRootNote } from "@/store";
import { verseNotesActions } from "@/store/slices/global/verseNotes";
import { rootNotesActions } from "@/store/slices/global/rootNotes";
import { dbFuncs } from "@/util/db";

import { Box, Collapsible } from "@chakra-ui/react";

import NoteForm from "@/components/Custom/NoteForm";
import NoteContainer from "@/components/Custom/NoteContainer";

import { useNote } from "@/hooks/useNote";

interface CollapsibleNoteProps {
  isOpen: boolean;
  inputKey: string;
}

const CollapsibleNote = ({ isOpen, inputKey }: CollapsibleNoteProps) => {
  return (
    <CollapsibleNoteGeneric
      isOpen={isOpen}
      noteID={inputKey}
      noteSelector={selectNote}
      actionChangeNote={verseNotesActions.changeNote}
      actionChangeNoteDir={verseNotesActions.changeNoteDir}
      dbSaveNote={dbFuncs.saveNote}
    />
  );
};

interface CollapsibleRootNoteProps {
  isOpen: boolean;
  rootID: string;
}

const CollapsibleRootNote = ({ isOpen, rootID }: CollapsibleRootNoteProps) => {
  return (
    <CollapsibleNoteGeneric
      isOpen={isOpen}
      noteID={rootID}
      noteSelector={selectRootNote}
      actionChangeNote={rootNotesActions.changeRootNote}
      actionChangeNoteDir={rootNotesActions.changeRootNoteDir}
      dbSaveNote={dbFuncs.saveRootNote}
    />
  );
};

interface CollapsibleNoteGenericProps {
  isOpen: boolean;
  noteID: string;
  noteSelector: (id: string) => (state: RootState) => any;
  actionChangeNote: (payload: { name: string; value: string }) => any;
  actionChangeNoteDir: (payload: { name: string; value: string }) => any;
  dbSaveNote: (id: string, text: string, dir: string) => Promise<any>;
}

const CollapsibleNoteGeneric = memo(
  ({
    isOpen,
    noteID,
    noteSelector,
    actionChangeNoteDir,
    actionChangeNote,
    dbSaveNote,
  }: CollapsibleNoteGenericProps) => {
    const { noteText, noteDirection, setText, setDirection, saveNote } =
      useNote({
        noteID,
        noteSelector,
        actionChangeNoteDir,
        actionChangeNote,
        dbSaveNote,
      });

    const [isEditable, setEditable] = useState(noteText ? false : true);

    const handleSetDirection = (dir: string) => {
      setDirection(dir);
    };

    const onChangeTextarea = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setText(event.target.value);
    };

    const onSubmitForm = (event: React.FormEvent<HTMLDivElement>) => {
      event.preventDefault();

      saveNote();

      setEditable(false);
    };

    const onClickEditButton = () => {
      setEditable(true);
    };

    return (
      <CollapsibleGeneric
        isOpen={isOpen}
        inputValue={noteText}
        isEditable={isEditable}
        inputDirection={noteDirection}
        handleSetDirection={handleSetDirection}
        onChangeTextarea={onChangeTextarea}
        onSubmitForm={onSubmitForm}
        onClickEditButton={onClickEditButton}
      />
    );
  }
);

interface CollapsibleGenericProps {
  isOpen: boolean;
  isEditable: boolean;
  inputValue: string;
  inputDirection: string;
  onClickEditButton: () => void;
  handleSetDirection: (dir: string) => void;
  onChangeTextarea: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmitForm: (event: React.FormEvent<HTMLDivElement>) => void;
}

const CollapsibleGeneric = ({
  isOpen,
  isEditable,
  inputValue,
  inputDirection,
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
          inputValue={inputValue}
          inputDirection={inputDirection}
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
  inputValue: string;
  inputDirection: string;
  onClickEditButton: () => void;
  handleSetDirection: (dir: string) => void;
  onChangeTextarea: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmitForm: (event: React.FormEvent<HTMLDivElement>) => void;
}

const FormText = ({
  isEditable,
  inputValue,
  inputDirection,
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
          inputValue={inputValue}
          inputDirection={inputDirection}
          onClickEditButton={onClickEditButton}
        />
      ) : (
        <NoteForm
          inputValue={inputValue}
          inputDirection={inputDirection}
          handleSetDirection={handleSetDirection}
          onChangeTextarea={onChangeTextarea}
          onSubmitForm={onSubmitForm}
        />
      )}
    </Box>
  );
};

export { CollapsibleNote, CollapsibleRootNote, CollapsibleGeneric, FormText };
