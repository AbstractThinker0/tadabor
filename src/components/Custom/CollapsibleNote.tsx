import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

import { selectNote, useAppDispatch, useAppSelector } from "@/store";
import { verseNotesActions } from "@/store/slices/global/verseNotes";
import { dbFuncs } from "@/util/db";

import { Box, Collapsible } from "@chakra-ui/react";

import NoteForm from "@/components/Custom/NoteForm";
import NoteContainer from "@/components/Custom/NoteContainer";
import { toaster } from "@/components/ui/toaster";

interface CollapsibleNoteProps {
  isOpen: boolean;
  inputKey: string;
}

const CollapsibleNote = memo(({ isOpen, inputKey }: CollapsibleNoteProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const currentNote = useAppSelector(selectNote(inputKey));

  const inputValue = currentNote?.text || "";
  const inputDirection = currentNote?.dir || "";

  const [isEditable, setEditable] = useState(inputValue ? false : true);

  const handleSetDirection = (dir: string) => {
    dispatch(
      verseNotesActions.changeNoteDir({
        name: inputKey,
        value: dir,
      })
    );
  };

  const onChangeTextarea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      verseNotesActions.changeNote({
        name: inputKey,
        value: event.target.value,
      })
    );
  };

  const onSubmitForm = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    dbFuncs
      .saveNote(inputKey, inputValue, inputDirection)
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
  };

  const onClickEditButton = () => {
    setEditable(true);
  };

  return (
    <Collapsible.Root open={isOpen} lazyMount>
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
});

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

export { CollapsibleNote, FormText };
