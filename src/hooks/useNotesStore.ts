import { useUserStore } from "@/store/zustand/userStore";
import { useCloudNotesStore } from "@/store/zustand/cloudNotes";
import { useLocalNotesStore } from "@/store/zustand/localNotes";

/**
 * Hook for global notes list and metadata.
 * Subscribes to all notes, loading states, and global settings.
 *
 * Important: This calls BOTH stores every render and selects based on `isLogged`,
 * so it does not violate React's rules of hooks when login state changes.
 */
export const useNotesStore = () => {
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

  const data = isLogged ? cloudData : localData;
  const dataKeys = isLogged ? cloudKeys : localKeys;
  const loading = isLogged ? cloudLoading : localLoading;
  const complete = isLogged ? cloudComplete : localComplete;
  const error = isLogged ? cloudError : localError;

  return {
    data,
    dataKeys,
    loading,
    complete,
    error,
  };
};
