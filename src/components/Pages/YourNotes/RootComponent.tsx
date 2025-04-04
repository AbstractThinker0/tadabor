import { useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import { selecRootNote, useAppDispatch, useAppSelector } from "@/store";
import { rootNotesActions } from "@/store/slices/global/rootNotes";

import { dbFuncs } from "@/util/db";

import VerseContainer from "@/components/Custom/VerseContainer";

import NoteForm from "@/components/Pages/YourNotes/NoteForm";
import NoteText from "@/components/Pages/YourNotes/NoteText";

import { Card, CardHeader } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

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
    <Card.Root w={"100%"} variant={"outline"} borderColor={"border.emphasized"}>
      <CardHeader
        dir="rtl"
        bgColor={"gray.muted"}
        borderBottom={"1px solid"}
        borderColor={"border.emphasized"}
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
    </Card.Root>
  );
};

export default RootComponent;
