import { memo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector, selectTransNote } from "@/store";
import { transNotesActions } from "@/store/slices/global/transNotes";
import { dbFuncs } from "@/util/db";

import { Box, Text } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import TextareaAutosize from "@/components/Custom/TextareaAutosize";
import { ButtonEdit, ButtonSave } from "@/components/Generic/Buttons";

interface TransComponentProps {
  inputKey: string;
}

const TransComponent = memo(({ inputKey }: TransComponentProps) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const inputValue = useAppSelector(selectTransNote(inputKey)).text;

  const [isEditable, setEditable] = useState(inputValue ? false : true);

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleInputSubmit = () => {
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
      {isEditable ? (
        <Versearea
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleInputSubmit={handleInputSubmit}
        />
      ) : (
        <Versetext inputValue={inputValue} handleEditClick={handleEditClick} />
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
  const onSubmit = () => {
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
