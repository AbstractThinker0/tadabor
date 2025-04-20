import { useState } from "react";

import useQuran from "@/context/useQuran";
import { selectNote } from "@/store";
import { verseNotesActions } from "@/store/slices/global/verseNotes";
import { useNote } from "@/hooks/useNote";

import { dbFuncs } from "@/util/db";

import VerseContainer from "@/components/Custom/VerseContainer";

import NoteForm from "@/components/Pages/YourNotes/NoteForm";
import NoteText from "@/components/Pages/YourNotes/NoteText";

import { Box } from "@chakra-ui/react";

interface VerseComponentProps {
  inputKey: string;
}

function VerseComponent({ inputKey }: VerseComponentProps) {
  const quranService = useQuran();

  const { noteText, noteDirection, setText, setDirection, saveNote } = useNote({
    noteID: inputKey,
    noteSelector: selectNote,
    actionChangeNoteDir: verseNotesActions.changeNoteDir,
    actionChangeNote: verseNotesActions.changeNote,
    actionSaveNote: verseNotesActions.changeSavedNote,
    dbSaveNote: dbFuncs.saveNote,
  });

  const [isEditable, setEditable] = useState(noteText ? false : true);

  const handleTextChange = (value: string) => {
    setText(value);
  };

  const handleFormSubmit = () => {
    saveNote();

    setEditable(false);
  };

  const handleSetDirection = (dir: string) => {
    setDirection(dir);
  };

  const onClickEditButton = () => {
    setEditable(true);
  };

  return (
    <Box
      w={"100%"}
      borderColor={"border.emphasized"}
      bgColor={"bg"}
      borderRadius={"0.35rem"}
    >
      <Box
        p={2}
        dir="rtl"
        bgColor={"gray.muted"}
        borderBottom={"1px solid"}
        borderColor={"border.emphasized"}
        borderTopRadius={"0.35rem"}
      >
        <VerseContainer>
          ({quranService.convertKeyToSuffix(inputKey)}) <br />{" "}
          {quranService.getVerseTextByKey(inputKey)}{" "}
        </VerseContainer>
      </Box>
      {isEditable ? (
        <NoteForm
          inputValue={noteText}
          inputDirection={noteDirection}
          handleFormSubmit={handleFormSubmit}
          handleTextChange={handleTextChange}
          handleSetDirection={handleSetDirection}
        />
      ) : (
        <NoteText
          inputValue={noteText}
          inputDirection={noteDirection}
          onClickEditButton={onClickEditButton}
        />
      )}
    </Box>
  );
}

export default VerseComponent;
