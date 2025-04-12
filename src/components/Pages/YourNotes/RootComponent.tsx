import { useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import { selecRootNote, useAppDispatch, useAppSelector } from "@/store";
import { rootNotesActions } from "@/store/slices/global/rootNotes";

import { dbFuncs } from "@/util/db";

import VerseContainer from "@/components/Custom/VerseContainer";

import NoteForm from "@/components/Pages/YourNotes/NoteForm";
import NoteText from "@/components/Pages/YourNotes/NoteText";

import { toaster } from "@/components/ui/toaster";
import { Box } from "@chakra-ui/react";

interface RootComponentProps {
  inputKey: string;
}

const RootComponent = ({ inputKey }: RootComponentProps) => {
  const quranService = useQuran();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const rootNote = useAppSelector(selecRootNote(inputKey));

  const inputValue = rootNote?.text || "";
  const inputDirection = rootNote?.dir || "";

  const [isEditable, setEditable] = useState(inputValue ? false : true);

  const handleTextChange = (value: string) => {
    dispatch(rootNotesActions.changeRootNote({ name: inputKey, value }));
  };

  const handleFormSubmit = () => {
    dbFuncs
      .saveRootNote(inputKey, inputValue, inputDirection)
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

    setEditable(false);
  };

  const handleSetDirection = (dir: string) => {
    dispatch(
      rootNotesActions.changeRootNoteDir({
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
      border={"1px solid"}
      borderColor={"border.emphasized"}
      borderRadius={"l3"}
      bg={"bg.panel"}
    >
      <Box
        dir="rtl"
        bgColor={"gray.muted"}
        borderBottom={"1px solid"}
        borderColor={"border.emphasized"}
        p={2}
      >
        <VerseContainer>
          {quranService.getRootNameByID(inputKey)}
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
};

export default RootComponent;
