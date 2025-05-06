import { useState } from "react";

import useQuran from "@/context/useQuran";

import { useNote } from "@/hooks/useNote";

import VerseContainer from "@/components/Custom/VerseContainer";

import NoteForm from "@/components/Pages/YourNotes/NoteForm";
import NoteText from "@/components/Pages/YourNotes/NoteText";

import { Box } from "@chakra-ui/react";

interface RootComponentProps {
  noteID: string;
}

const RootComponent = ({ noteID }: RootComponentProps) => {
  const quranService = useQuran();

  const note = useNote({
    noteID: noteID,
  });

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
          {quranService.getRootNameByID(note.key)}
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
};

export default RootComponent;
