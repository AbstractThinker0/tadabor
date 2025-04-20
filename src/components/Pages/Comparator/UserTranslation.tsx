import { useState } from "react";
import { useTranslation } from "react-i18next";

import { selectTransNote, useAppSelector } from "@/store";
import { transNotesActions } from "@/store/slices/global/transNotes";

import { useNote } from "@/hooks/useNote";
import { dbFuncs } from "@/util/db";

import { Box, Button } from "@chakra-ui/react";
import TextareaAutosize from "@/components/Custom/TextareaAutosize";
import { ButtonEdit } from "@/components/Generic/Buttons";

interface UserTranslationProps {
  verseKey: string;
}

const UserTranslation = ({ verseKey }: UserTranslationProps) => {
  const { t } = useTranslation();

  const notesFS = useAppSelector((state) => state.settings.notesFontSize);
  const [stateEditable, setStateEditable] = useState(false);

  const { noteText, setText, saveNote } = useNote({
    noteID: verseKey,
    noteSelector: selectTransNote,
    actionChangeNote: transNotesActions.changeTranslation,
    actionSaveNote: transNotesActions.changeSavedTrans,
    dbSaveNote: dbFuncs.saveTranslation,
  });

  const onClickAdd = () => {
    setStateEditable(true);
  };

  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const onClickSave = () => {
    setStateEditable(false);

    saveNote();
  };

  return (
    <Box py={2} dir="ltr">
      <Box color={"fg.muted"}>Your translation</Box>
      {stateEditable ? (
        <>
          <TextareaAutosize
            value={noteText}
            placeholder="Enter your text"
            onChange={onChangeText}
          />

          <Button
            onClick={onClickSave}
            colorPalette="green"
            size="sm"
            fontWeight={"normal"}
          >
            {t("text_save")}
          </Button>
        </>
      ) : noteText ? (
        <Box whiteSpace={"pre-wrap"}>
          <Box fontSize={`${notesFS}rem`}>{noteText}</Box>
          <ButtonEdit onClick={onClickAdd} />
        </Box>
      ) : (
        <div>
          <div>Empty.</div>

          <Button
            onClick={onClickAdd}
            colorPalette="green"
            size="sm"
            fontWeight={"normal"}
          >
            Add
          </Button>
        </div>
      )}
    </Box>
  );
};

export default UserTranslation;
