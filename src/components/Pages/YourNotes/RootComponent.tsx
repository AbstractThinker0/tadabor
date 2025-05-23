import { useState } from "react";

import useQuran from "@/context/useQuran";

import { useNote } from "@/hooks/useNote";

import VerseContainer from "@/components/Custom/VerseContainer";

import NoteForm from "@/components/Custom/NoteForm";
import NoteContainer from "@/components/Custom/NoteContainer";

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
      bg={"bg"}
      shadow={"sm"}
    >
      <Box
        dir="rtl"
        bgColor={"bg.info"}
        borderBottom={"1px solid"}
        borderColor={"border.emphasized"}
        borderTopRadius={"l3"}
        p={2}
      >
        <VerseContainer>
          {quranService.getRootNameByID(note.key)}
        </VerseContainer>
      </Box>
      {isEditable ? (
        <NoteForm
          inputSaved={note.isSaved}
          inputValue={note.text}
          inputDirection={note.direction}
          onSaveNote={handleFormSubmit}
          onChangeNote={handleTextChange}
          handleSetDirection={handleSetDirection}
        />
      ) : (
        <NoteContainer
          inputValue={note.text}
          inputDirection={note.direction}
          inputSaved={note.isSaved}
          dateCreated={note.dateCreated}
          dateModified={note.dateModified}
          noteType={note.type}
          noteKey={note.key}
          isSynced={note.isSynced}
          isSyncing={note.isSyncing}
          onSaveNote={handleFormSubmit}
          onClickEditButton={onClickEditButton}
        />
      )}
    </Box>
  );
};

export default RootComponent;
