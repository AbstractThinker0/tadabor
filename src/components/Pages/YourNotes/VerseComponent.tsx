import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import useQuran from "@/context/useQuran";
import { useAppDispatch, useAppSelector, selectNote } from "@/store";
import { verseNotesActions } from "@/store/slices/global/verseNotes";
import { dbFuncs } from "@/util/db";

import VerseContainer from "@/components/Custom/VerseContainer";

import NoteForm from "@/components/Pages/YourNotes/NoteForm";
import NoteText from "@/components/Pages/YourNotes/NoteText";

import { Box } from "@chakra-ui/react";

interface VerseComponentProps {
  inputKey: string;
}

function VerseComponent({ inputKey }: VerseComponentProps) {
  const quranService = useQuran();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const verseNote = useAppSelector(selectNote(inputKey));

  const inputValue = verseNote?.text || "";
  const inputDirection = verseNote?.dir || "";

  const [isEditable, setEditable] = useState(inputValue ? false : true);

  const handleTextChange = (value: string) => {
    dispatch(
      verseNotesActions.changeNote({
        name: inputKey,
        value,
      })
    );
  };

  const handleFormSubmit = () => {
    dbFuncs
      .saveNote(inputKey, inputValue, inputDirection)
      .then(() => {
        toast.success(t("save_success"));
      })
      .catch(() => {
        toast.error(t("save_failed"));
      });

    setEditable(false);
  };

  const handleSetDirection = (dir: string) => {
    dispatch(
      verseNotesActions.changeNoteDir({
        name: inputKey,
        value: dir,
      })
    );
  };

  const onClickEditButton = () => {
    setEditable(true);
  };

  return (
    <Box
      w={"100%"}
      borderColor={"border.emphasized"}
      bgColor={"bg"}
      borderRadius={"0.35rem"}
    >
      <Box
        p={2}
        dir="rtl"
        backgroundColor={"gray.muted"}
        borderBottom={"1px solid"}
        borderColor={"border.emphasized"}
        borderTopRadius={"0.35rem"}
      >
        <VerseContainer>
          ({quranService.convertKeyToSuffix(inputKey)}) <br />{" "}
          {quranService.getVerseTextByKey(inputKey)}{" "}
        </VerseContainer>
      </Box>
      {isEditable ? (
        <NoteForm
          inputValue={inputValue}
          inputDirection={inputDirection}
          handleFormSubmit={handleFormSubmit}
          handleTextChange={handleTextChange}
          handleSetDirection={handleSetDirection}
        />
      ) : (
        <NoteText
          inputValue={inputValue}
          inputDirection={inputDirection}
          onClickEditButton={onClickEditButton}
        />
      )}
    </Box>
  );
}

export default VerseComponent;
