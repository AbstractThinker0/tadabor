import { useCallback } from "react";

import { useCloudNotesStore } from "@/store/global/cloudNotes";
import { useLocalNotesStore } from "@/store/global/localNotes";
import { useActiveNoteState } from "@/store/global/notesStorage";

import type { CloudNoteProps, LocalNoteProps } from "@/types";

/**
 * Hook for single note operations.
 * Subscribes only to the specific note's state to avoid unnecessary rerenders.
 *
 * Important: This calls BOTH stores every render and selects based on `isLogged`,
 * so it does not violate React's rules of hooks when login state changes.
 */
export const useSingleNote = (noteId?: string) => {
  const { isLogged, userId, note, isNoteLoading } = useActiveNoteState(noteId);

  const fetchSingleNoteIfNeeded = useCallback(() => {
    if (!noteId) return null;

    if (isLogged) {
      if (!userId) return null;
      return useCloudNotesStore
        .getState()
        .fetchSingleCloudNote({ noteId, userId });
    }

    return useLocalNotesStore.getState().fetchSingleLocalNote(noteId);
  }, [noteId, isLogged, userId]);

  const cacheNote = useCallback(
    (noteToCache: LocalNoteProps | CloudNoteProps) => {
      if (isLogged) {
        useCloudNotesStore.getState().cacheNote(noteToCache);
      } else {
        useLocalNotesStore.getState().cacheNote(noteToCache);
      }
    },
    [isLogged]
  );

  const changeNote = useCallback(
    (payload: { name: string; value: string }) => {
      if (isLogged) {
        useCloudNotesStore.getState().changeNote(payload);
      } else {
        useLocalNotesStore.getState().changeNote(payload);
      }
    },
    [isLogged]
  );

  const changeNoteDir = useCallback(
    (payload: { name: string; value: string }) => {
      if (isLogged) {
        useCloudNotesStore.getState().changeNoteDir(payload);
      } else {
        useLocalNotesStore.getState().changeNoteDir(payload);
      }
    },
    [isLogged]
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
