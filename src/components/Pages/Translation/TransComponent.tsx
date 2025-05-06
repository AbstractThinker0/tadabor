import { memo, useState } from "react";

import { useAppSelector } from "@/store";

import { useNote } from "@/hooks/useNote";

import { Box, Text } from "@chakra-ui/react";

import TextareaAutosize from "@/components/Custom/TextareaAutosize";
import { ButtonEdit, ButtonSave } from "@/components/Generic/Buttons";

interface TransComponentProps {
  verseKey: string;
}

const TransComponent = memo(({ verseKey }: TransComponentProps) => {
  const note = useNote({
    noteType: "translation",
    noteKey: verseKey,
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
    <>
      {isEditable ? (
        <Versearea
          inputValue={note.text}
          handleInputChange={handleInputChange}
          handleInputSubmit={handleInputSubmit}
        />
      ) : (
        <Versetext inputValue={note.text} handleEditClick={handleEditClick} />
      )}
    </>
  );
});

TransComponent.displayName = "TransComponent";

interface VersetextProps {
  inputValue: string;
  handleEditClick: () => void;
}

const Versetext = ({ inputValue, handleEditClick }: VersetextProps) => {
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const onClickEdit = () => {
    handleEditClick();
  };

  return (
    <Box padding={2}>
      <Box border={"1px solid"} borderColor={"border.emphasized"} padding={1}>
        <Text whiteSpace={"pre-wrap"} fontSize={`${notesFS}rem`} dir="ltr">
          {inputValue}
        </Text>
      </Box>
      <Box textAlign={"center"}>
        <ButtonEdit onClick={onClickEdit} />
      </Box>
    </Box>
  );
};

interface VerseareaProps {
  inputValue: string;
  handleInputChange: (value: string) => void;
  handleInputSubmit: (inputValue: string) => void;
}

const Versearea = ({
  inputValue,
  handleInputChange,
  handleInputSubmit,
}: VerseareaProps) => {
  const onSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleInputSubmit(inputValue);
  };

  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(event.target.value);
  };

  return (
    <Box as="form" onSubmit={onSubmit} padding={2} dir="ltr">
      <TextareaAutosize
        placeholder="Enter your text."
        value={inputValue}
        onChange={onChangeText}
        bgColor={"bg"}
      />
      <Box textAlign={"center"}>
        <ButtonSave />
      </Box>
    </Box>
  );
};

export default TransComponent;
