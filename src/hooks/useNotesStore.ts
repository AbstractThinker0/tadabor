import { useCallback, useMemo } from "react";

import { useAppSelector } from "@/store";
import { useCloudNotesStore } from "@/store/zustand/cloudNotes";
import { useLocalNotesStore } from "@/store/zustand/localNotes";

import type { CloudNoteProps, LocalNoteProps } from "@/types";

export type ActiveNote = LocalNoteProps | CloudNoteProps;

/**
 * Unifies local/cloud notes behind a single hook.
 *
 * Important: This calls BOTH stores every render and selects based on `isLogged`,
 * so it does not violate React's rules of hooks when login state changes.
 */
export const useNotesStore = (noteId?: string) => {
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const userId = useAppSelector((state) => state.user.id);

  const localData = useLocalNotesStore((state) => state.data);
  const cloudData = useCloudNotesStore((state) => state.data);

  const localKeys = useLocalNotesStore((state) => state.dataKeys);
  const cloudKeys = useCloudNotesStore((state) => state.dataKeys);

  const localLoading = useLocalNotesStore((state) => state.loading);
  const cloudLoading = useCloudNotesStore((state) => state.loading);

  const localComplete = useLocalNotesStore((state) => state.complete);
  const cloudComplete = useCloudNotesStore((state) => state.complete);

  const localError = useLocalNotesStore((state) => state.error);
  const cloudError = useCloudNotesStore((state) => state.error);

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

  const localNoteComplete = useLocalNotesStore((state) =>
    noteId ? state.dataComplete[noteId] : undefined
  );
  const cloudNoteComplete = useCloudNotesStore((state) =>
    noteId ? state.dataComplete[noteId] : undefined
  );

  const data = isLogged ? cloudData : localData;
  const dataKeys = isLogged ? cloudKeys : localKeys;
  const loading = isLogged ? cloudLoading : localLoading;
  const complete = isLogged ? cloudComplete : localComplete;
  const error = isLogged ? cloudError : localError;

  const note = isLogged ? cloudNote : localNote;

  const isNoteLoading = useMemo(() => {
    if (!noteId) return undefined;

    return isLogged
      ? cloudNoteLoading || !cloudNoteComplete
      : localNoteLoading || !localNoteComplete;
  }, [
    noteId,
    isLogged,
    cloudNoteLoading,
    cloudNoteComplete,
    localNoteLoading,
    localNoteComplete,
  ]);

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
    (noteToCache: ActiveNote) => {
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
    (payload: { id: string; dateModified: number }) => {
      if (isLogged) {
        useCloudNotesStore.getState().markSaved(payload);
      } else {
        useLocalNotesStore.getState().markSaved(payload);
      }
    },
    [isLogged]
  );

  return {
    isLogged,
    userId,

    data,
    dataKeys,
    loading,
    complete,
    error,

    note,
    isNoteLoading,

    fetchSingleNoteIfNeeded,
    cacheNote,
    changeNote,
    changeNoteDir,
    markSaved,
  };
};
