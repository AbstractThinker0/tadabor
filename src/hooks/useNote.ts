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

  const noteText = note?.text ?? "";
  const noteDirection = note?.dir ?? "";
  const noteSaved = note?.saved ?? false;
  const noteValidKey = note?.key ?? noteKey ?? noteIndex.split(":")[1];

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
    dispatch(noteAction.markSaved(noteIndex));

    dbSave({
      id: noteIndex,
      key: noteValidKey,
      text: noteText,
      type: note.type,
      uuid: note.uuid,
      dir: noteDirection,
      date_created: note.date_created,
      date_modified: note.date_modified,
    })
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
          dispatch(
            cloudNotesActions.updateSyncDate({
              name: note.id,
              value: result?.note.dateLastSynced,
            })
          );
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  return {
    text: noteText,
    direction: noteDirection,
    isSaved: noteSaved,
    key: noteValidKey,
    setText,
    setDirection,
    save: saveNote,
  };
};
