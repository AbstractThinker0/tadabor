import { memo, useState } from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector, selectTransNote } from "@/store";
import useQuran from "@/context/useQuran";

import { dbFuncs } from "@/util/db";

import { transNotesActions } from "@/store/slices/global/transNotes";

import VerseContainer from "@/components/Custom/VerseContainer";

import { Box, Flex, Text } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
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
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const verse_trans = useAppSelector(selectTransNote(inputKey))?.text;

  const [isEditable, setEditable] = useState(verse_trans ? false : true);

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleInputSubmit = (inputValue: string) => {
    setEditable(false);

    dbFuncs
      .saveTranslation(inputKey, inputValue)
      .then(() => {
        toaster.create({
          description: t("save_success"),
          type: "success",
        });
      })
      .catch(() => {
        toaster.create({
          description: t("save_failed"),
          type: "error",
        });
      });
  };

  const handleInputChange = (value: string) => {
    dispatch(
      transNotesActions.changeTranslation({
        name: inputKey,
        value: value,
      })
    );
  };

  return (
    <>
      {isEditable === false ? (
        <Versetext inputValue={verse_trans} handleEditClick={handleEditClick} />
      ) : (
        <Versearea
          inputValue={verse_trans}
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
