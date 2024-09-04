import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import useQuran from "@/context/useQuran";

import { selecRootNote, useAppDispatch, useAppSelector } from "@/store";
import { rootNotesActions } from "@/store/slices/global/rootNotes";

import { dbFuncs } from "@/util/db";

import VerseContainer from "@/components/Custom/VerseContainer";

import NoteForm from "@/components/Pages/YourNotes/NoteForm";
import NoteText from "@/components/Pages/YourNotes/NoteText";

import { Card, CardHeader } from "@chakra-ui/react";

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
        toast.success(t("save_success"));
      })
      .catch(() => {
        toast.error(t("save_failed"));
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
    <Card w={"100%"} variant={"outline"} borderColor={"rgba(0, 0, 0, .175)"}>
      <CardHeader
        dir="rtl"
        backgroundColor={"rgba(33, 37, 41, .03)"}
        borderBottom={"1px solid rgba(0, 0, 0, .175)"}
      >
        <VerseContainer>
          {quranService.getRootNameByID(inputKey)}
        </VerseContainer>
      </CardHeader>
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
    </Card>
  );
};

export default RootComponent;
