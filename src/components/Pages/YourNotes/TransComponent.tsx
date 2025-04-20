import { memo, useState } from "react";

import { useAppSelector, selectTransNote } from "@/store";
import { transNotesActions } from "@/store/slices/global/transNotes";
import useQuran from "@/context/useQuran";

import { useNote } from "@/hooks/useNote";

import { dbFuncs } from "@/util/db";

import VerseContainer from "@/components/Custom/VerseContainer";

import { Box, Flex, Text } from "@chakra-ui/react";

import TextareaAutosize from "@/components/Custom/TextareaAutosize";
import { ButtonEdit, ButtonSave } from "@/components/Generic/Buttons";

interface TransComponentProps {
  verseKey: string;
}

const TransComponent = ({ verseKey }: TransComponentProps) => {
  const quranService = useQuran();

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
          ({quranService.convertKeyToSuffix(verseKey)}) <br />{" "}
          {quranService.getVerseTextByKey(verseKey)}{" "}
        </VerseContainer>
      </Box>
      <TransBody inputKey={verseKey} />
    </Box>
  );
};

interface TransBodyProps {
  inputKey: string;
}

const TransBody = memo(({ inputKey }: TransBodyProps) => {
  const { noteText, setText, saveNote } = useNote({
    noteID: inputKey,
    noteSelector: selectTransNote,
    actionChangeNote: transNotesActions.changeTranslation,
    actionSaveNote: transNotesActions.changeSavedTrans,
    dbSaveNote: dbFuncs.saveTranslation,
  });

  const [isEditable, setEditable] = useState(noteText ? false : true);

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleInputSubmit = (inputValue: string) => {
    setEditable(false);

    saveNote();
  };

  const handleInputChange = (value: string) => {
    setText(value);
  };

  return (
    <>
      {isEditable === false ? (
        <Versetext inputValue={noteText} handleEditClick={handleEditClick} />
      ) : (
        <Versearea
          inputValue={noteText}
          handleInputChange={handleInputChange}
          handleInputSubmit={handleInputSubmit}
        />
      )}
    </>
  );
});

TransBody.displayName = "TransBody";

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
