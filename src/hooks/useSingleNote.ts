import { useCallback, useMemo } from "react";

import { useUserStore } from "@/store/global/userStore";
import { useCloudNotesStore } from "@/store/global/cloudNotes";
import { useLocalNotesStore } from "@/store/global/localNotes";

import type { CloudNoteProps, LocalNoteProps } from "@/types";
import type { ICloudNote, ILocalNote } from "@/util/db";

/**
 * Hook for single note operations.
 * Subscribes only to the specific note's state to avoid unnecessary rerenders.
 *
 * Important: This calls BOTH stores every render and selects based on `isLogged`,
 * so it does not violate React's rules of hooks when login state changes.
 */
export const useSingleNote = (noteId?: string) => {
  const isLogged = useUserStore((state) => state.isLogged);
  const userId = useUserStore((state) => state.id);

  const localNote = useLocalNotesStore((state) =>
    noteId ? state.data[noteId] : undefined
  );
  const cloudNote = useCloudNotesStore((state) =>
    noteId ? state.data[noteId] : undefined
  );

  const localNoteLoading = useLocalNotesStore((state) =>
    noteId ? state.dataLoading[noteId] : undefined
  );
  const cloudNoteLoading = useCloudNotesStore((state) =>
    noteId ? state.dataLoading[noteId] : undefined
  );

  const note = isLogged ? cloudNote : localNote;

  const isNoteLoading = useMemo(() => {
    if (!noteId) return undefined;

    return isLogged ? cloudNoteLoading : localNoteLoading;
  }, [noteId, isLogged, cloudNoteLoading, localNoteLoading]);

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

  const markSaved = useCallback(
    (payload: { saveData: ICloudNote | ILocalNote }) => {
      if (isLogged) {
        return useCloudNotesStore.getState().markSaved(payload);
      } else {
        return useLocalNotesStore.getState().markSaved(payload);
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
    markSaved,
  };
};
