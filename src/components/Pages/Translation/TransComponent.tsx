import { memo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector, selectTransNote } from "@/store";
import { transNotesActions } from "@/store/slices/global/transNotes";
import { dbFuncs } from "@/util/db";

import { Box, Button, Text } from "@chakra-ui/react";
import TextareaAutosize from "@/components/Custom/TextareaAutosize";

interface TransComponentProps {
  verse_key: string;
}

const TransComponent = memo(({ verse_key }: TransComponentProps) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const verse_trans = useAppSelector(selectTransNote(verse_key));

  const [stateEditable, setStateEditable] = useState(
    verse_trans ? false : true
  );

  const handleEditClick = useCallback(() => {
    setStateEditable(true);
  }, []);

  const handleInputSubmit = useCallback(
    (inputKey: string, inputValue: string) => {
      setStateEditable(false);

      dbFuncs
        .saveTranslation(inputKey, inputValue)
        .then(() => {
          toast.success(t("save_success"));
        })
        .catch(() => {
          toast.error(t("save_failed"));
        });
    },
    [t]
  );

  const handleInputChange = useCallback(
    (key: string, value: string) => {
      dispatch(
        transNotesActions.changeTranslation({
          name: key,
          value: value,
        })
      );
    },
    [dispatch]
  );

  return (
    <>
      {stateEditable === false ? (
        <Versetext
          inputKey={verse_key}
          inputValue={verse_trans}
          handleEditClick={handleEditClick}
        />
      ) : (
        <Versearea
          inputKey={verse_key}
          inputValue={verse_trans}
          handleInputChange={handleInputChange}
          handleInputSubmit={handleInputSubmit}
        />
      )}
    </>
  );
});

TransComponent.displayName = "TransComponent";

interface VersetextProps {
  inputValue: string;
  inputKey: string;
  handleEditClick: () => void;
}

const Versetext = ({
  inputValue,
  inputKey,
  handleEditClick,
}: VersetextProps) => {
  const { t } = useTranslation();
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const onClickEdit = () => {
    handleEditClick();
  };

  return (
    <Box padding={2}>
      <Box border={"1px solid #dee2e6"} padding={1}>
        <Text whiteSpace={"pre-wrap"} fontSize={`${notesFS}rem`} dir="ltr">
          {inputValue}
        </Text>
      </Box>
      <Box textAlign={"center"}>
        <Button
          colorScheme="blue"
          onClick={onClickEdit}
          size="sm"
          fontWeight={"normal"}
        >
          {t("text_edit")}
        </Button>
      </Box>
    </Box>
  );
};

interface VerseareaProps {
  inputKey: string;
  inputValue: string;
  handleInputChange: (key: string, value: string) => void;
  handleInputSubmit: (inputKey: string, inputValue: string) => void;
}

const Versearea = ({
  inputValue,
  inputKey,
  handleInputChange,
  handleInputSubmit,
}: VerseareaProps) => {
  const { t } = useTranslation();

  const onClickSave = () => {
    handleInputSubmit(inputKey, inputValue);
  };

  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(inputKey, event.target.value);
  };

  return (
    <Box padding={2} dir="ltr">
      <TextareaAutosize
        placeholder="Enter your text."
        value={inputValue}
        onChange={onChangeText}
        backgroundColor={"white"}
      />
      <Box textAlign={"center"}>
        <Button
          colorScheme="green"
          size="sm"
          fontWeight={"normal"}
          onClick={onClickSave}
        >
          {t("text_save")}
        </Button>
      </Box>
    </Box>
  );
};

export default TransComponent;
