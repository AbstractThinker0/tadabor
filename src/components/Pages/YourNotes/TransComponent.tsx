import { useState } from "react";

import useQuran from "@/context/useQuran";

import { useNote } from "@/hooks/useNote";

import VerseContainer from "@/components/Custom/VerseContainer";

import { Box } from "@chakra-ui/react";

import {
  NoteFormContainer,
  NoteFormEditor,
  NoteFormFooter,
} from "@/components/Note/NoteForm";
import NoteContainer from "@/components/Note/NoteContainer";

interface TransComponentProps {
  noteID: string;
}

const TransComponent = ({ noteID }: TransComponentProps) => {
  const quranService = useQuran();

  const note = useNote({
    noteID: noteID,
  });

  const [isEditable, setEditable] = useState(note.text ? false : true);

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleInputSubmit = () => {
    setEditable(false);

    note.save();
  };

  const handleInputChange = (value: string) => {
    note.setText(value);
  };

  return (
    <Box
      w={"100%"}
      bgColor={"bg"}
      border={"1px solid"}
      borderColor={"border.emphasized"}
      borderRadius={"l3"}
      shadow={"sm"}
    >
      <Box
        bgColor={"bg.info"}
        borderBottom={"1px solid"}
        borderColor={"border.emphasized"}
        borderTopRadius={"l3"}
        dir="rtl"
        p={2}
      >
        <VerseContainer>
          ({quranService.convertKeyToSuffix(note.key)}) <br />{" "}
          {quranService.getVerseTextByKey(note.key)}{" "}
        </VerseContainer>
      </Box>
      {isEditable === false ? (
        <NoteContainer
          isSynced={note.isSynced}
          isSyncing={note.isSyncing}
          inputValue={note.text}
          inputSaved={note.isSaved}
          inputDirection="ltr"
          dateCreated={note.dateCreated}
          dateModified={note.dateModified}
          noteType={note.type}
          noteKey={note.key}
          onClickEditButton={handleEditClick}
          onSaveNote={handleInputSubmit}
        />
      ) : (
        <Versearea
          inputValue={note.text}
          inputSaved={note.isSaved}
          onChangeNote={handleInputChange}
          onSaveNote={handleInputSubmit}
        />
      )}
    </Box>
  );
};

interface VerseareaProps {
  inputValue: string;
  inputSaved?: boolean;
  onChangeNote: (text: string) => void;
  onSaveNote: () => void;
}

const Versearea = ({
  inputValue,
  inputSaved = true,
  onChangeNote,
  onSaveNote,
}: VerseareaProps) => {
  return (
    <NoteFormContainer onSaveNote={onSaveNote}>
      <NoteFormEditor
        inputDirection="ltr"
        inputValue={inputValue}
        inputSaved={inputSaved}
        onChangeNote={onChangeNote}
      />
      <NoteFormFooter />
    </NoteFormContainer>
  );
};

export default TransComponent;
