import { useState } from "react";

import useQuran from "@/context/useQuran";

import { selectRootNote } from "@/store";
import { rootNotesActions } from "@/store/slices/global/rootNotes";

import { useNote } from "@/hooks/useNote";

import { dbFuncs } from "@/util/db";

import VerseContainer from "@/components/Custom/VerseContainer";

import NoteForm from "@/components/Pages/YourNotes/NoteForm";
import NoteText from "@/components/Pages/YourNotes/NoteText";

import { Box } from "@chakra-ui/react";

interface RootComponentProps {
  inputKey: string;
}

const RootComponent = ({ inputKey }: RootComponentProps) => {
  const quranService = useQuran();

  const { noteText, noteDirection, setText, setDirection, saveNote } = useNote({
    noteID: inputKey,
    noteSelector: selectRootNote,
    actionChangeNoteDir: rootNotesActions.changeRootNote,
    actionChangeNote: rootNotesActions.changeRootNote,
    actionSaveNote: rootNotesActions.changeSavedNote,
    dbSaveNote: dbFuncs.saveRootNote,
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
      border={"1px solid"}
      borderColor={"border.emphasized"}
      borderRadius={"l3"}
      bg={"bg.panel"}
    >
      <Box
        dir="rtl"
        bgColor={"gray.muted"}
        borderBottom={"1px solid"}
        borderColor={"border.emphasized"}
        p={2}
      >
        <VerseContainer>
          {quranService.getRootNameByID(inputKey)}
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
};

export default RootComponent;
