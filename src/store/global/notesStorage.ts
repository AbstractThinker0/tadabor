import { useCloudNotesStore } from "@/store/global/cloudNotes";
import { useLocalNotesStore } from "@/store/global/localNotes";
import { useUserStore } from "@/store/global/userStore";
import { saveCloudNote, saveLocalNote } from "@/services/noteSave";
import type { NoteType } from "tadabor-shared";
import { hasNoteType } from "@/util/noteIdentity";

const selectActiveValue = <T>(
  isLogged: boolean,
  localValue: T,
  cloudValue: T
) => (isLogged ? cloudValue : localValue);

export const getNoteActions = (isLogged: boolean, userId?: number) => {
  const store = isLogged
    ? useCloudNotesStore.getState()
    : useLocalNotesStore.getState();

  return {
    cacheNote: store.cacheNote,
    changeNote: store.changeNote,
    changeNoteDir: store.changeNoteDir,
    fetchSingleNoteIfNeeded: (noteId?: string) => {
      if (!noteId) return null;
      if (isLogged) {
        if (!userId) return null;
        return useCloudNotesStore
          .getState()
          .fetchSingleCloudNote({ noteId, userId });
      }
      return useLocalNotesStore.getState().fetchSingleLocalNote(noteId);
    },
  };
};

export const saveActiveNote = ({
  isLogged,
  userId,
  uploadNote,
  ...noteParams
}: Omit<Parameters<typeof saveLocalNote>[0], "markSaved"> & {
  isLogged: boolean;
  userId?: number;
  uploadNote: Parameters<typeof saveCloudNote>[0]["uploadNote"];
}) => {
  if (isLogged) {
    return saveCloudNote({
      ...noteParams,
      authorId: userId,
      markSaved: (saveData) =>
        useCloudNotesStore.getState().markSaved({ saveData }),
      uploadNote,
      updateSyncDate: useCloudNotesStore.getState().updateSyncDate,
    });
  }

  return saveLocalNote({
    ...noteParams,
    markSaved: (saveData) =>
      useLocalNotesStore.getState().markSaved({ saveData }),
  });
};

export const useNotesStorageState = () => {
  const isLogged = useUserStore((state) => state.isLogged);

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

  return {
    data: selectActiveValue(isLogged, localData, cloudData),
    dataKeys: selectActiveValue(isLogged, localKeys, cloudKeys),
    loading: selectActiveValue(isLogged, localLoading, cloudLoading),
    complete: selectActiveValue(isLogged, localComplete, cloudComplete),
    error: selectActiveValue(isLogged, localError, cloudError),
  };
};

export const useActiveNoteState = (noteId?: string) => {
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

  return {
    isLogged,
    userId,
    note: selectActiveValue(isLogged, localNote, cloudNote),
    isNoteLoading: noteId
      ? selectActiveValue(isLogged, localNoteLoading, cloudNoteLoading)
      : undefined,
  };
};

export const getNotesIdsByType = (dataKeys: string[], noteType: NoteType) =>
  dataKeys.filter((noteId) => hasNoteType(noteId, noteType));

export const hasUnsavedNotes = () => {
  const isLogged = useUserStore.getState().isLogged;
  const localNotes = useLocalNotesStore.getState().data;
  const cloudNotes = useCloudNotesStore.getState().data;
  const activeNotes = selectActiveValue(isLogged, localNotes, cloudNotes);

  return Object.values(activeNotes).some(
    (note) => note.saved === false && (note.preSave || note.text)
  );
};
