import { useState } from "react";

import { useAppSelector } from "@/store";

import useQuran from "@/context/useQuran";

import { useNote } from "@/hooks/useNote";

import VerseContainer from "@/components/Custom/VerseContainer";

import { Box, Flex, Text } from "@chakra-ui/react";

import TextareaAutosize from "@/components/Custom/TextareaAutosize";
import { ButtonEdit, ButtonSave } from "@/components/Generic/Buttons";

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

  const handleInputSubmit = (inputValue: string) => {
    setEditable(false);

    note.save();
  };

  const handleInputChange = (value: string) => {
    note.setText(value);
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
        bgColor={"gray.muted"}
        borderBottom={"1px solid"}
        borderColor={"border.emphasized"}
        dir="rtl"
        p={2}
      >
        <VerseContainer>
          ({quranService.convertKeyToSuffix(note.key)}) <br />{" "}
          {quranService.getVerseTextByKey(note.key)}{" "}
        </VerseContainer>
      </Box>
      {isEditable === false ? (
        <Versetext inputValue={note.text} handleEditClick={handleEditClick} />
      ) : (
        <Versearea
          inputValue={note.text}
          handleInputChange={handleInputChange}
          handleInputSubmit={handleInputSubmit}
        />
      )}
    </Box>
  );
};

interface VersetextProps {
  inputValue: string;
  handleEditClick: () => void;
}

const Versetext = ({ inputValue, handleEditClick }: VersetextProps) => {
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  return (
    <>
      <Box p={3} dir="ltr">
        <Text whiteSpace={"pre-wrap"} fontSize={`${notesFS}rem`}>
          {inputValue}
        </Text>
      </Box>
      <Flex
        p={3}
        justifyContent={"center"}
        bgColor={"gray.muted"}
        borderTop={"1px solid"}
        borderColor={"border.emphasized"}
      >
        <ButtonEdit onClick={handleEditClick} />
      </Flex>
    </>
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

  const onChangeTextarea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(event.target.value);
  };

  return (
    <Box as="form" onSubmit={onSubmit} dir="ltr">
      <Box p={3}>
        <TextareaAutosize
          value={inputValue}
          onChange={onChangeTextarea}
          lineHeight={"normal"}
          placeholder={"Enter your text."}
          required
        />
      </Box>
      <Flex
        p={3}
        justifyContent={"center"}
        bgColor={"gray.muted"}
        borderTop={"1px solid"}
        borderColor={"border.emphasized"}
      >
        <ButtonSave />
      </Flex>
    </Box>
  );
};

export default TransComponent;
