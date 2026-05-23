import { useTranslation } from "react-i18next";
import { useCloudNotesStore } from "@/store/global/cloudNotes";
import { useSingleNote } from "@/hooks/useSingleNote";
import { useUserStore } from "@/store/global/userStore";

import { toaster } from "@/components/ui/toaster";
import { type ICloudNote } from "@/util/db";
import { dbNoteRevisions } from "@/util/dbFuncs";

import {
  createNewNote,
  createNoteRevision,
  computeDateModified,
  fromDexieToBackend,
} from "@/util/notes";
import {
  getDefaultNoteDirection,
  isNoteType,
  resolveNoteIdentity,
  type NoteType,
} from "@/util/noteIdentity";
import type { CloudNoteProps } from "@/types";
import { useState } from "react";
import { useUploadNote } from "@/services/backend";
import { tryCatch } from "@/util/trycatch";

interface useNoteParams {
  noteID?: string;
  noteType?: NoteType;
  noteKey?: string;
}

export const useNote = ({ noteID, noteType, noteKey }: useNoteParams) => {
  const isLogged = useUserStore((state) => state.isLogged);
  const userId = useUserStore((state) => state.id);
  const identity = resolveNoteIdentity({ noteID, noteType, noteKey });
  const noteIndex = identity.id;

  const {
    note,
    isNoteLoading,
    cacheNote,
    changeNote,
    changeNoteDir,
    markSaved,
  } = useSingleNote(noteIndex);

  const updateSyncDate = useCloudNotesStore((state) => state.updateSyncDate);

  const uploadNote = useUploadNote();

  // Track local save state (dbSave is async and not tracked by uploadNote.isPending)
  const [isDbSaving, setIsDbSaving] = useState(false);

  const noteText = note?.text ?? "";
  const notePreSaveText = note?.preSave ?? "";
  const notePreSaveDirection = note?.preSaveDir ?? "";
  const noteSaved = note?.saved ?? false;
  const noteValidKey = note?.key ?? identity.key;
  const noteValidType =
    note?.type && isNoteType(note.type) ? note.type : identity.type;
  const noteDirection = note?.dir ?? getDefaultNoteDirection(noteValidType);
  const noteIsSynced = (note as CloudNoteProps)?.isSynced || false;
  // isSyncing is true if either cloud upload OR local db save is in progress
  const noteIsSyncing = uploadNote.isPending || isDbSaving;
  const noteSyncDate = (note as CloudNoteProps)?.date_synced ?? 0;
  const noteModifiedDate = note?.date_modified ?? 0;
  const isOutOfSync = noteSyncDate < noteModifiedDate;

  const { t } = useTranslation();

  const setText = (text: string) => {
    if (!note) {
      const newNote = createNewNote({
        id: noteIndex,
        text,
        dir: noteDirection,
        authorId: userId ? userId : undefined,
      });

      cacheNote(newNote);
    } else {
      changeNote({ name: noteIndex, value: text });
    }
  };

  const setDirection = (dir: string) => {
    if (!note) {
      const newNote = createNewNote({
        id: noteIndex,
        dir,
        authorId: userId ? userId : undefined,
      });

      cacheNote(newNote);
    } else {
      changeNoteDir({ name: noteIndex, value: dir });
    }
  };

  const saveNote = async () => {
    if (!note) return;

    const newDateModified = computeDateModified(note);

    const saveData = {
      id: noteIndex,
      key: noteValidKey,
      text: noteText,
      type: noteValidType,
      uuid: note.uuid,
      dir: noteDirection,
      date_created: note.date_created,
      date_modified: newDateModified,
      ...(isLogged && { authorId: userId, date_synced: 0 }),
    };

    setIsDbSaving(true);

    try {
      const revision = createNoteRevision(note);

      if (revision) {
        const { error: revisionError } = await tryCatch(
          dbNoteRevisions.save(revision)
        );

        if (revisionError) {
          console.error("Failed to save note revision:", revisionError);
        }
      }

      await performLocalSave(saveData);

      if (isLogged) {
        await performCloudSync(saveData);
      }
    } finally {
      setIsDbSaving(false);
    }
  };

  // Helper: Perform local DB save and update state
  const performLocalSave = async (saveData: ICloudNote) => {
    const { result } = await tryCatch(markSaved({ saveData }));

    if (!result) {
      toaster.create({
        description: t("ui.messages.save_failed"),
        type: "error",
      });
    } else {
      toaster.create({
        description: t("ui.messages.save_success"),
        type: "success",
      });
    }
  };

  // Helper: Perform cloud upload and update sync date
  const performCloudSync = async (saveData: ICloudNote) => {
    const uploadData = fromDexieToBackend(saveData);

    const { error: uploadError, result } = await tryCatch(
      uploadNote.mutateAsync(uploadData)
    );

    if (uploadError) {
      console.error("Cloud sync failed:", uploadError);
      return;
    }

    if (result.success) {
      const syncDate = result.note.dateLastSynced;

      updateSyncDate({
        name: saveData.id,
        value: syncDate,
      });
    }
  };

  // For now we don't use this since we bulk fetch notes on login ( might be needed again later for multi tabs usage )
  /*
  const fetchNoteIfNeeded = useEffectEvent(() => {
    fetchSingleNoteIfNeeded();
  });

  useEffect(() => {
    if (!isVisible) return;

    fetchNoteIfNeeded();
  }, [isVisible, isLogged]);
  */

  return {
    id: noteIndex,
    preSaveText: notePreSaveText,
    preSaveDirection: notePreSaveDirection,
    text: noteText,
    direction: noteDirection,
    isSaved: noteSaved,
    type: noteValidType,
    key: noteValidKey,
    isLoading: isNoteLoading,
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
