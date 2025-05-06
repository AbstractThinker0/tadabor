import { useState } from "react";

import useQuran from "@/context/useQuran";

import { useNote } from "@/hooks/useNote";

import VerseContainer from "@/components/Custom/VerseContainer";

import NoteForm from "@/components/Pages/YourNotes/NoteForm";
import NoteText from "@/components/Pages/YourNotes/NoteText";

import { Box } from "@chakra-ui/react";

interface VerseComponentProps {
  noteID: string;
}

function VerseComponent({ noteID }: VerseComponentProps) {
  const quranService = useQuran();

  const note = useNote({
    noteID: noteID,
  });

  //console.log("noteKey:", noteKey);

  const [isEditable, setEditable] = useState(note.text ? false : true);

  const handleTextChange = (value: string) => {
    note.setText(value);
  };

  const handleFormSubmit = () => {
    note.save();

    setEditable(false);
  };

  const handleSetDirection = (dir: string) => {
    note.setDirection(dir);
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
          ({quranService.convertKeyToSuffix(note.key)}) <br />{" "}
          {quranService.getVerseTextByKey(note.key)}{" "}
        </VerseContainer>
      </Box>
      {isEditable ? (
        <NoteForm
          inputValue={note.text}
          inputDirection={note.direction}
          handleFormSubmit={handleFormSubmit}
          handleTextChange={handleTextChange}
          handleSetDirection={handleSetDirection}
        />
      ) : (
        <NoteText
          inputValue={note.text}
          inputDirection={note.direction}
          onClickEditButton={onClickEditButton}
        />
      )}
    </Box>
  );
}

export default VerseComponent;
