//
import { useTranslation } from "react-i18next";
import {
  selectCloudNote,
  selectLocalNote,
  useAppDispatch,
  useAppSelector,
} from "@/store";

import { toaster } from "@/components/ui/toaster";

import { localNotesActions } from "@/store/slices/global/localNotes";
import { dbFuncs } from "@/util/db";
import { cloudNotesActions } from "@/store/slices/global/cloudNotes";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/util/trpc";
import { createNewNote } from "@/util/notes";
import { CloudNoteProps } from "@/types";

interface useNoteParams {
  noteID?: string;
  noteType?: "verse" | "root" | "translation";
  noteKey?: string;
}

export const useNote = ({ noteID, noteType, noteKey }: useNoteParams) => {
  const noteIndex = noteID || `${noteType}:${noteKey}`;

  const isLogged = useAppSelector((state) => state.user.isLogged);

  const selector = isLogged
    ? selectCloudNote(noteIndex)
    : selectLocalNote(noteIndex);

  const note = useAppSelector(selector);

  const noteAction = isLogged ? cloudNotesActions : localNotesActions;

  const dbSave = isLogged ? dbFuncs.saveCloudNote : dbFuncs.saveLocalNote;

  const trpc = useTRPC();
  const uploadNote = useMutation(trpc.notes.uploadNote.mutationOptions());

  const [noteSplitType, noteSplitKey] = noteIndex.split(":");

  const noteText = note?.text ?? "";
  const noteDirection = note?.dir ?? "";
  const noteSaved = note?.saved ?? false;
  const noteValidKey = note?.key ?? noteKey ?? noteSplitKey;
  const noteValidType = note?.type ?? noteType ?? noteSplitType;
  const noteIsSynced = (note as CloudNoteProps)?.isSynced || false;
  const noteIsSyncing = uploadNote.isPending;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const setText = (text: string) => {
    if (!note) {
      dispatch(noteAction.cacheNote(createNewNote({ id: noteIndex, text })));
    } else {
      dispatch(noteAction.changeNote({ name: noteIndex, value: text }));
    }
  };

  const setDirection = (dir: string) => {
    if (!note) {
      dispatch(noteAction.cacheNote(createNewNote({ id: noteIndex, dir })));
    } else {
      dispatch(noteAction.changeNoteDir({ name: noteIndex, value: dir }));
    }
  };

  const saveNote = async () => {
    let syncDate = 0;
    if (isLogged) {
      // upload the note to cloud
      try {
        const uploadData = {
          key: noteValidKey,
          type: note.type,
          uuid: note.uuid,
          content: note.text,
          dateCreated: note.date_created!,
          dateModified: note.date_modified!,
          direction: note.dir!,
        };

        const result = await uploadNote.mutateAsync(uploadData);

        if (result?.success) {
          syncDate = result?.note.dateLastSynced;
          dispatch(
            cloudNotesActions.updateSyncDate({
              name: note.id,
              value: syncDate,
            })
          );
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }

    dispatch(noteAction.markSaved(noteIndex));

    type SaveDataProps = {
      id: string;
      key: string;
      text: string;
      type: string;
      uuid: string;
      dir: string;
      date_created: number | undefined;
      date_modified: number | undefined;
      date_synced?: number; // Optional property
    };

    const saveData: SaveDataProps = {
      id: noteIndex,
      key: noteValidKey,
      text: noteText,
      type: note.type,
      uuid: note.uuid,
      dir: noteDirection,
      date_created: note.date_created,
      date_modified: note.date_modified,
    };

    // Add date_synced only for cloud notes
    if (syncDate) {
      saveData.date_synced = syncDate;
    }

    dbSave(saveData)
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
    text: noteText,
    direction: noteDirection,
    isSaved: noteSaved,
    type: noteValidType,
    key: noteValidKey,
    isSynced: noteIsSynced,
    isSyncing: noteIsSyncing,
    dateCreated: note?.date_created,
    dateModified: note?.date_modified,
    setText,
    setDirection,
    save: saveNote,
  };
};
