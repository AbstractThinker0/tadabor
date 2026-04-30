import { useCallback, useEffect, useState } from "react";

import { useSingleNote } from "@/hooks/useSingleNote";
import type { INoteRevision } from "@/types/db";
import { dbNoteRevisions } from "@/util/dbFuncs";
import { tryCatch } from "@/util/trycatch";

interface UseNoteRevisionsParams {
  noteId?: string;
  refreshKey?: number;
  isEnabled?: boolean;
}

export const useNoteRevisions = ({
  noteId,
  refreshKey = 0,
  isEnabled = true,
}: UseNoteRevisionsParams) => {
  const [revisions, setRevisions] = useState<INoteRevision[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { note } = useSingleNote(noteId);
  const noteUuid = note?.uuid;

  const loadRevisions = useCallback(async () => {
    if (!noteId || !noteUuid || !isEnabled) {
      setRevisions([]);
      return [];
    }

    setIsLoading(true);

    const { result, error } = await tryCatch(
      dbNoteRevisions.loadByNote(noteId, noteUuid)
    );

    setIsLoading(false);

    if (error || !result) {
      console.error("Failed to load note revisions:", error);
      return [];
    }

    setRevisions(result);
    return result;
  }, [noteId, noteUuid, isEnabled]);

  useEffect(() => {
    void loadRevisions();
  }, [loadRevisions, refreshKey]);

  const deleteRevision = async (revisionId: string) => {
    const { error } = await tryCatch(dbNoteRevisions.delete(revisionId));

    if (error) {
      console.error("Failed to delete note revision:", error);
      return false;
    }

    setRevisions((current) => current.filter((item) => item.id !== revisionId));
    return true;
  };

  const clearRevisions = async () => {
    if (!noteId || !noteUuid) return false;

    const { error } = await tryCatch(
      dbNoteRevisions.clearByNote(noteId, noteUuid)
    );

    if (error) {
      console.error("Failed to clear note revisions:", error);
      return false;
    }

    setRevisions([]);
    return true;
  };

  return {
    revisions,
    isLoading,
    reload: loadRevisions,
    deleteRevision,
    clearRevisions,
  };
};