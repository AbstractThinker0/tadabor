//
import { useTranslation } from "react-i18next";
import { RootState, useAppDispatch, useAppSelector } from "@/store";

import { toaster } from "@/components/ui/toaster";

interface useNoteParams {
  noteID: string;
  noteSelector: (id: string) => (state: RootState) => any;
  actionChangeNote: (payload: { name: string; value: string }) => any;
  actionChangeNoteDir: (payload: { name: string; value: string }) => any;
  dbSaveNote: (id: string, text: string, dir: string) => Promise<any>;
}

export const useNote = ({
  noteID,
  noteSelector,
  actionChangeNoteDir,
  actionChangeNote,
  dbSaveNote,
}: useNoteParams) => {
  const note = useAppSelector(noteSelector(noteID));
  const noteText = note?.text || "";
  const noteDirection = note?.dir || "";
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const setText = (text: string) => {
    dispatch(actionChangeNote({ name: noteID, value: text }));
  };

  const setDirection = (dir: string) => {
    dispatch(actionChangeNoteDir({ name: noteID, value: dir }));
  };

  const saveNote = () => {
    dbSaveNote(noteID, noteText, noteDirection)
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

  return {
    noteText,
    noteDirection,
    setText,
    setDirection,
    saveNote,
  };
};
