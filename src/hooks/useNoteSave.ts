import { useState } from "react";
import { useTranslation } from "react-i18next";

import { toaster } from "@/components/ui/toaster";
import { useUploadNote } from "@/services/backend";
import { saveCloudNote, saveLocalNote } from "@/services/noteSave";
import { useCloudNotesStore } from "@/store/global/cloudNotes";
import { useLocalNotesStore } from "@/store/global/localNotes";
import { useUserStore } from "@/store/global/userStore";
import type { CloudNoteProps, LocalNoteProps } from "@/types/notes";
import type { NoteType } from "@/util/noteIdentity";
import { fromDexieToBackend } from "@/util/notes";

interface UseNoteSaveParams {
  noteId: string;
  note?: LocalNoteProps | CloudNoteProps;
  noteType: NoteType;
  noteDirection: string;
}

export const useNoteSave = ({
  noteId,
  note,
  noteType,
  noteDirection,
}: UseNoteSaveParams) => {
  const { t } = useTranslation();
  const isLogged = useUserStore((state) => state.isLogged);
  const userId = useUserStore((state) => state.id);
  const uploadNote = useUploadNote();
  const updateSyncDate = useCloudNotesStore((state) => state.updateSyncDate);
  const [isDbSaving, setIsDbSaving] = useState(false);

  const save = async () => {
    if (!note) {
      return false;
    }

    setIsDbSaving(true);

    try {
      const result = isLogged
        ? await saveCloudNote({
            noteId,
            note,
            noteType,
            noteDirection,
            authorId: userId,
            markSaved: (saveData) =>
              useCloudNotesStore.getState().markSaved({ saveData }),
            uploadNote: (saveData) =>
              uploadNote.mutateAsync(fromDexieToBackend(saveData)),
            updateSyncDate,
          })
        : await saveLocalNote({
            noteId,
            note,
            noteType,
            noteDirection,
            markSaved: (saveData) =>
              useLocalNotesStore.getState().markSaved({ saveData }),
          });

      if (!result.saved) {
        toaster.create({
          description: t("ui.messages.save_failed"),
          type: "error",
        });

        return false;
      }

      toaster.create({
        description: t("ui.messages.save_success"),
        type: "success",
      });

      return true;
    } finally {
      setIsDbSaving(false);
    }
  };

  return {
    save,
    isSaving: uploadNote.isPending || isDbSaving,
  };
};