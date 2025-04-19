import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  RootState,
  selectNote,
  selectRootNote,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import { verseNotesActions } from "@/store/slices/global/verseNotes";
import { rootNotesActions } from "@/store/slices/global/rootNotes";
import { dbFuncs } from "@/util/db";

import { Box, Collapsible } from "@chakra-ui/react";

import NoteForm from "@/components/Custom/NoteForm";
import NoteContainer from "@/components/Custom/NoteContainer";
import { toaster } from "@/components/ui/toaster";

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
    const currentNote = useAppSelector(noteSelector(noteID));
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const inputValue = currentNote?.text || "";
    const inputDirection = currentNote?.dir || "";

    const [isEditable, setEditable] = useState(inputValue ? false : true);

    const handleSetDirection = useCallback((dir: string) => {
      dispatch(
        actionChangeNoteDir({
          name: noteID,
          value: dir,
        })
      );
    }, []);

    const onChangeTextarea = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(
          actionChangeNote({
            name: noteID,
            value: event.target.value,
          })
        );
      },
      []
    );

    const onSubmitForm = useCallback(
      (event: React.FormEvent<HTMLDivElement>) => {
        event.preventDefault();

        dbSaveNote(noteID, inputValue, inputDirection)
          .then(() => {
            toaster.create({
              description: t("save_success"),
              type: "success",
            });
          })
          .catch(() => {
            toaster.create({
              description: t("save_failed"),
              type: "error",
            });
          });

        setEditable(false);
      },
      [inputValue, inputDirection]
    );

    const onClickEditButton = useCallback(() => {
      setEditable(true);
    }, []);

    return (
      <CollapsibleGeneric
        isOpen={isOpen}
        inputValue={inputValue}
        isEditable={isEditable}
        inputDirection={inputDirection}
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
