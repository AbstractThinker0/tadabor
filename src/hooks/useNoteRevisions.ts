import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const { note } = useSingleNote(noteId);
  const noteUuid = note?.uuid;
  const revisionsQueryKey = ["note-revisions", noteId, noteUuid, refreshKey];

  const loadRevisions = useCallback(async (): Promise<INoteRevision[]> => {
    if (!noteId || !noteUuid) {
      return [];
    }

    const { result, error } = await tryCatch(
      dbNoteRevisions.loadByNote(noteId, noteUuid)
    );

    if (error || !result) {
      console.error("Failed to load note revisions:", error);
      return [];
    }

    return result;
  }, [noteId, noteUuid]);

  const revisionsQuery = useQuery({
    queryKey: revisionsQueryKey,
    queryFn: loadRevisions,
    enabled: Boolean(noteId && noteUuid && isEnabled),
    placeholderData: [],
  });

  const revisions = noteId && noteUuid && isEnabled ? revisionsQuery.data : [];
  const isLoading = isEnabled && revisionsQuery.isFetching;

  const deleteRevision = async (revisionId: string) => {
    const { error } = await tryCatch(dbNoteRevisions.delete(revisionId));

    if (error) {
      console.error("Failed to delete note revision:", error);
      return false;
    }

    queryClient.setQueryData<INoteRevision[]>(
      revisionsQueryKey,
      (current = []) => current.filter((item) => item.id !== revisionId)
    );
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

    queryClient.setQueryData<INoteRevision[]>(revisionsQueryKey, []);
    return true;
  };

  return {
    revisions,
    isLoading,
    reload: revisionsQuery.refetch,
    deleteRevision,
    clearRevisions,
  };
};
