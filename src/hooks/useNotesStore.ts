import {
  getNotesIdsByType,
  useNotesStorageState,
} from "@/store/global/notesStorage";
import type { NoteType } from "tadabor-shared";

/**
 * Hook for global notes list and metadata.
 * Subscribes to all notes, loading states, and global settings.
 *
 * Important: This calls BOTH stores every render and selects based on `isLogged`,
 * so it does not violate React's rules of hooks when login state changes.
 */
export const useNotesStore = () => {
  const { data, dataKeys, loading, complete, error } = useNotesStorageState();

  const getNotesByType = (type: NoteType) => getNotesIdsByType(dataKeys, type);

  return {
    data,
    dataKeys,
    loading,
    complete,
    error,
    getNotesIdsByType: getNotesByType,
  };
};
