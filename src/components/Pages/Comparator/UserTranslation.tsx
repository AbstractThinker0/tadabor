import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { selectTransNote, useAppDispatch, useAppSelector } from "@/store";
import { transNotesActions } from "@/store/slices/global/transNotes";
import { dbFuncs } from "@/util/db";

import { Box, Button } from "@chakra-ui/react";
import TextareaAutosize from "@/components/Custom/TextareaAutosize";
import { ButtonEdit } from "@/components/Generic/Buttons";

interface UserTranslationProps {
  verseKey: string;
}

const UserTranslation = ({ verseKey }: UserTranslationProps) => {
  const { t } = useTranslation();
  const verseTrans = useAppSelector(selectTransNote(verseKey));
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);
  const [stateEditable, setStateEditable] = useState(false);
  const dispatch = useAppDispatch();

  const onClickAdd = () => {
    setStateEditable(true);
  };

  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(
      transNotesActions.changeTranslation({
        name: verseKey,
        value: event.target.value,
      })
    );
  };

  const onClickSave = () => {
    setStateEditable(false);

    dbFuncs
      .saveTranslation(verseKey, verseTrans)
      .then(() => {
        toast.success(t("save_success"));
      })
      .catch(() => {
        toast.error(t("save_failed"));
      });
  };

  return (
    <Box py={2} dir="ltr">
      <Box color={"rgb(108, 117, 125)"}>Your translation</Box>
      {stateEditable ? (
        <>
          <TextareaAutosize
            value={verseTrans}
            placeholder="Enter your text"
            onChange={onChangeText}
          />

          <Button
            onClick={onClickSave}
            colorScheme="green"
            size="sm"
            fontWeight={"normal"}
          >
            {t("text_save")}
          </Button>
        </>
      ) : verseTrans ? (
        <Box whiteSpace={"pre-wrap"}>
          <Box fontSize={`${notesFS}rem`}>{verseTrans}</Box>
          <ButtonEdit onClick={onClickAdd} />
        </Box>
      ) : (
        <div>
          <div>Empty.</div>

          <Button
            onClick={onClickAdd}
            colorScheme="green"
            size="sm"
            fontWeight={"normal"}
          >
            Add
          </Button>
        </div>
      )}
    </Box>
  );
};

export default UserTranslation;
