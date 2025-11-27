import { useTranslation } from "react-i18next";
import {
  selectCloudNote,
  selectLocalNote,
  useAppDispatch,
  useAppSelector,
} from "@/store";

import { toaster } from "@/components/ui/toaster";

import {
  fetchSingleLocalNote,
  localNotesActions,
} from "@/store/slices/global/localNotes";
import { dbFuncs } from "@/util/db";
import {
  cloudNotesActions,
  fetchSingleCloudNote,
} from "@/store/slices/global/cloudNotes";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/util/trpc";
import {
  createNewNote,
  computeDateModified,
  fromDexieToBackend,
} from "@/util/notes";
import type { CloudNoteProps } from "@/types";
import { useEffect } from "react";

interface useNoteParams {
  noteID?: string;
  noteType?: "verse" | "root" | "translation";
  noteKey?: string;
  isVisible?: boolean;
}

export const useNote = ({
  noteID,
  noteType,
  noteKey,
  isVisible = true,
}: useNoteParams) => {
  const noteIndex = noteID || `${noteType}:${noteKey}`;

  const isLogged = useAppSelector((state) => state.user.isLogged);
  const userId = useAppSelector((state) => state.user.id);

  const selector = isLogged
    ? selectCloudNote(noteIndex)
    : selectLocalNote(noteIndex);

  const note = useAppSelector(selector);

  const isLoadingLocal = useAppSelector(
    (state) => state.localNotes.dataLoading[noteIndex]
  );

  const isLoadingCloud = useAppSelector(
    (state) => state.cloudNotes.dataLoading[noteIndex]
  );

  const isNoteLoading = isLogged ? isLoadingCloud : isLoadingLocal;

  const noteAction = isLogged ? cloudNotesActions : localNotesActions;

  const dbSave = isLogged ? dbFuncs.saveCloudNote : dbFuncs.saveLocalNote;

  const trpc = useTRPC();
  const uploadNote = useMutation(trpc.notes.uploadNote.mutationOptions());

  const [noteSplitType, noteSplitKey] = noteIndex.split(":");

  const noteText = note?.text ?? "";
  const notePreSaveText = note?.preSave ?? "";
  const noteSaved = note?.saved ?? false;
  const noteValidKey = note?.key ?? noteKey ?? noteSplitKey;
  const noteValidType = note?.type ?? noteType ?? noteSplitType;
  const noteDirection =
    note?.dir ?? (noteValidType === "translation" ? "ltr" : "");
  const noteIsSynced = (note as CloudNoteProps)?.isSynced || false;
  const noteIsSyncing = uploadNote.isPending;
  const noteSyncDate = (note as CloudNoteProps)?.date_synced ?? 0;
  const noteModifiedDate = note?.date_modified ?? 0;
  const isOutOfSync = noteSyncDate < noteModifiedDate;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const setText = (text: string) => {
    if (!note) {
      dispatch(
        noteAction.cacheNote(
          createNewNote({
            id: noteIndex,
            text,
            dir: noteDirection,
            authorId: userId ? userId : undefined,
          })
        )
      );
    } else {
      dispatch(noteAction.changeNote({ name: noteIndex, value: text }));
    }
  };

  const setDirection = (dir: string) => {
    if (!note) {
      dispatch(
        noteAction.cacheNote(
          createNewNote({
            id: noteIndex,
            dir,
            authorId: userId ? userId : undefined,
          })
        )
      );
    } else {
      dispatch(noteAction.changeNoteDir({ name: noteIndex, value: dir }));
    }
  };

  const saveNote = async () => {
    if (!note) return; // Nothing to save yet
    let syncDate = 0;

    const newDateModified = computeDateModified(note);

    if (isLogged) {
      // upload the note to cloud
      try {
        const uploadData = fromDexieToBackend({
          ...note,
          key: noteValidKey,
          date_modified: newDateModified,
        });

        const result = await uploadNote.mutateAsync(uploadData);

        if (result && result.success) {
          syncDate = result.note.dateLastSynced;
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

    // We delay marking saved until after persistence completes

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
      date_modified: newDateModified,
    };

    // Add date_synced only for cloud notes
    if (syncDate) {
      saveData.date_synced = syncDate;
    }

    dbSave(saveData)
      .then(() => {
        dispatch(
          noteAction.markSaved({
            id: noteIndex,
            dateModified: newDateModified,
          })
        );
        toaster.create({
          description: t("ui.messages.save_success"),
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Failed to save note:", error);
        toaster.create({
          description: t("ui.messages.save_failed"),
          type: "error",
        });
      });
  };

  useEffect(() => {
    if (!isVisible) return;

    if (isNoteLoading === false) return;

    if (isLogged) {
      dispatch(fetchSingleCloudNote({ noteId: noteIndex, userId }));
    } else {
      dispatch(fetchSingleLocalNote(noteIndex));
    }
  }, [isVisible, isLogged, isNoteLoading, userId, noteIndex, dispatch]);

  return {
    preSaveText: notePreSaveText,
    text: noteText,
    direction: noteDirection,
    isSaved: noteSaved,
    type: noteValidType,
    key: noteValidKey,
    isLoading: isNoteLoading !== false,
    isSynced: noteIsSynced,
    isSyncing: noteIsSyncing,
    isOutOfSync,
    dateCreated: note?.date_created,
    dateModified: note?.date_modified,
    setText,
    setDirection,
    save: saveNote,
  };
};
