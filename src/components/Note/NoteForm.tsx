import { useState } from "react";

import { Box, type BoxProps } from "@chakra-ui/react";

import TextareaNote from "@/components/Note/TextareaNote";
import NoteContainer from "@/components/Note/NoteContainer";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { useNote } from "@/hooks/useNote";

interface NoteFormProps {
  isOpen: boolean;
  noteID?: string;
  noteType?: "verse" | "root" | "translation";
  noteKey?: string;
  renderHeader?: React.ReactNode;
  rootProps?: BoxProps;
}

const NoteForm = ({
  isOpen,
  noteID,
  noteType,
  noteKey,
  renderHeader,
  rootProps,
}: NoteFormProps) => {
  const note = useNote({
    noteID,
    noteType,
    noteKey,
    isVisible: isOpen,
  });

  const [isEditable, setEditable] = useState(note.text ? false : true);

  const handleSetDirection = (dir: string) => {
    note.setDirection(dir);
  };

  const onChangeNote = (text: string) => {
    note.setText(text);
  };

  const onSaveNote = () => {
    note.save();

    setEditable(false);
  };

  const onClickEditButton = () => {
    setEditable(true);
  };

  const onClickCancelButton = () => {
    note.setText(note.preSaveText);

    if (note.preSaveText) {
      setEditable(false);
    } else {
      setEditable(true);
    }
  };

  if (note.isLoading) {
    return <LoadingSpinner text="Fetching note.." />;
  }

  return (
    <Box
      w={"100%"}
      color={"fg"}
      bgColor={"bg.panel"}
      pb={1}
      border="1px solid"
      borderColor={"border"}
      borderRadius={"l3"}
      {...rootProps}
    >
      {renderHeader && (
        <Box
          p={2}
          dir="rtl"
          bgColor={"bg.info"}
          borderBottom={"1px solid"}
          borderColor={"border.emphasized"}
          borderTopRadius={"l3"}
        >
          {renderHeader}
        </Box>
      )}
      {isEditable === false ? (
        <NoteContainer
          isSynced={note.isSynced}
          isSyncing={note.isSyncing}
          isOutOfSync={note.isOutOfSync}
          inputValue={note.text}
          inputDirection={note.direction}
          inputSaved={note.isSaved}
          dateCreated={note.dateCreated}
          dateModified={note.dateModified}
          noteType={note.type}
          noteKey={note.key}
          onClickEditButton={onClickEditButton}
          onClickCancelButton={onClickCancelButton}
          onSaveNote={onSaveNote}
        />
      ) : (
        <TextareaNote
          isSynced={note.isSynced}
          isSyncing={note.isSyncing}
          isOutOfSync={note.isOutOfSync}
          noteType={note.type}
          noteKey={note.key}
          preSaveText={note.preSaveText}
          inputValue={note.text}
          inputDirection={note.direction}
          inputSaved={note.isSaved}
          handleSetDirection={handleSetDirection}
          onChangeNote={onChangeNote}
          onSaveNote={onSaveNote}
          onClickCancelButton={onClickCancelButton}
        />
      )}
    </Box>
  );
};

export { NoteForm };
