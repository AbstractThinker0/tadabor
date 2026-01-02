import { useTranslation } from "react-i18next";
import { useCloudNotesStore } from "@/store/zustand/cloudNotes";
import { useNotesStore } from "@/hooks/useNotesStore";

import { toaster } from "@/components/ui/toaster";
import { dbFuncs, type ICloudNote } from "@/util/db";

import {
  createNewNote,
  computeDateModified,
  fromDexieToBackend,
} from "@/util/notes";
import type { CloudNoteProps } from "@/types";
import { useEffect, useEffectEvent, useState } from "react";
import { useUploadNote } from "@/services/backend";
import { tryCatch } from "@/util/trycatch";

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

  const {
    isLogged,
    userId,
    note,
    isNoteLoading,
    cacheNote,
    changeNote,
    changeNoteDir,
    markSaved,
    fetchSingleNoteIfNeeded,
  } = useNotesStore(noteIndex);

  const updateSyncDate = useCloudNotesStore((state) => state.updateSyncDate);

  const dbSave = isLogged ? dbFuncs.saveCloudNote : dbFuncs.saveLocalNote;

  const uploadNote = useUploadNote();

  // Track local save state (dbSave is async and not tracked by uploadNote.isPending)
  const [isDbSaving, setIsDbSaving] = useState(false);

  const [noteSplitType, noteSplitKey] = noteIndex.split(":");

  const noteText = note?.text ?? "";
  const notePreSaveText = note?.preSave ?? "";
  const noteSaved = note?.saved ?? false;
  const noteValidKey = note?.key ?? noteKey ?? noteSplitKey;
  const noteValidType = note?.type ?? noteType ?? noteSplitType;
  const noteDirection =
    note?.dir ?? (noteValidType === "translation" ? "ltr" : "");
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
      type: note.type,
      uuid: note.uuid,
      dir: noteDirection,
      date_created: note.date_created,
      date_modified: newDateModified,
      ...(isLogged && { authorId: userId, date_synced: 0 }),
    };

    setIsDbSaving(true);

    await performLocalSave(saveData);

    if (isLogged) {
      await performCloudSync(saveData);
    }

    setIsDbSaving(false);
  };

  // Helper: Perform local DB save and update state
  const performLocalSave = async (saveData: ICloudNote) => {
    const { error } = await tryCatch(dbSave(saveData));

    if (error) {
      console.error("Failed to save note locally:", error);
      toaster.create({
        description: t("ui.messages.save_failed"),
        type: "error",
      });
      return { success: false };
    }

    markSaved({ saveData });
    toaster.create({
      description: t("ui.messages.save_success"),
      type: "success",
    });
    return { success: true };
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

      // Update local DB with sync date (non-blocking)
      dbFuncs.updateCloudNoteSyncDate(saveData.id, syncDate).catch((err) => {
        console.error("Failed to update sync date in local DB:", err);
      });
    }
  };

  const fetchNoteIfNeeded = useEffectEvent(() => {
    fetchSingleNoteIfNeeded();
  });

  useEffect(() => {
    if (!isVisible) return;

    fetchNoteIfNeeded();
  }, [isVisible, isLogged]);

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
