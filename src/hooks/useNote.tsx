//
import { useTranslation } from "react-i18next";
import { RootState, useAppDispatch, useAppSelector } from "@/store";

import { toaster } from "@/components/ui/toaster";
import {
  ChangeNoteDirPayload,
  ChangeNotePayload,
  NoteProp,
  SavedNotePayload,
} from "@/types";

interface useNoteParams {
  noteID: string;
  noteSelector: (id: string) => (state: RootState) => NoteProp;
  actionChangeNote: (payload: ChangeNotePayload) => any;
  actionChangeNoteDir: (payload: ChangeNoteDirPayload) => any;
  actionSaveNote: (payload: SavedNotePayload) => any;
  dbSaveNote: (id: string, text: string, dir: string) => Promise<any>;
}

export const useNote = ({
  noteID,
  noteSelector,
  actionChangeNoteDir,
  actionChangeNote,
  actionSaveNote,
  dbSaveNote,
}: useNoteParams) => {
  const note = useAppSelector(noteSelector(noteID));
  const noteText = note?.text || "";
  const noteDirection = note?.dir || "";
  const noteSaved = note?.saved || false;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const setText = (text: string) => {
    dispatch(actionChangeNote({ name: noteID, value: text }));
  };

  const setDirection = (dir: string) => {
    dispatch(actionChangeNoteDir({ name: noteID, value: dir }));
  };

  const saveNote = () => {
    dispatch(
      actionSaveNote({ name: noteID, text: noteText, dir: noteDirection })
    );

    dbSaveNote(noteID, noteText, noteDirection)
      .then(() => {
        toaster.create({
          description: t("save_success"),
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Failed to save note:", error);
        toaster.create({
          description: t("save_failed"),
          type: "error",
        });
      });
  };

  return {
    noteText,
    noteDirection,
    noteSaved,
    setText,
    setDirection,
    saveNote,
  };
};
