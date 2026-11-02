import { useCallback } from "react";

import { getNoteActions, useActiveNoteState } from "@/features/notes/notesStorage";

/**
 * Hook for single note operations.
 * Subscribes only to the specific note's state to avoid unnecessary rerenders.
 *
 * Important: This calls BOTH stores every render and selects based on `isLogged`,
 * so it does not violate React's rules of hooks when login state changes.
 */
export const useSingleNote = (noteId?: string) => {
  const { isLogged, userId, note, isNoteLoading } = useActiveNoteState(noteId);
  const { cacheNote, changeNote, changeNoteDir } = getNoteActions(isLogged, userId);

  const fetchSingleNoteIfNeeded = useCallback(
    () => getNoteActions(isLogged, userId).fetchSingleNoteIfNeeded(noteId),
    [noteId, isLogged, userId]
  );

  return {
    note,
    isNoteLoading,
    fetchSingleNoteIfNeeded,
    cacheNote,
    changeNote,
    changeNoteDir,
  };
};
