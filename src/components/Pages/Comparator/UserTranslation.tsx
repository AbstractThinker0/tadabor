import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/store";

import { useNote } from "@/hooks/useNote";

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

  const note = useNote({
    noteType: "translation",
    noteKey: verseKey,
  });

  const onClickAdd = () => {
    setStateEditable(true);
  };

  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    note.setText(event.target.value);
  };

  const onClickSave = () => {
    setStateEditable(false);

    note.save();
  };

  return (
    <Box py={2} dir="ltr">
      <Box color={"fg.muted"}>Your translation</Box>
      {stateEditable ? (
        <>
          <TextareaAutosize
            value={note.text}
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
      ) : note.text ? (
        <Box whiteSpace={"pre-wrap"}>
          <Box fontSize={`${notesFS}rem`}>{note.text}</Box>
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
