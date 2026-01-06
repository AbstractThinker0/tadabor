import { useCallback } from "react";

import { useUserStore } from "@/store/zustand/userStore";

import { useCloudNotesStore } from "@/store/zustand/cloudNotes";
import { useLocalNotesStore } from "@/store/zustand/localNotes";

import { useBeforeUnload } from "react-router";

interface NotesProviderProps {
  children: React.ReactNode;
}

const NotesProvider = ({ children }: NotesProviderProps) => {
  const hasUnsavedNotes = useCallback(() => {
    const userStore = useUserStore;
    const localNotesStore = useLocalNotesStore;
    const cloudNotesStore = useCloudNotesStore;

    const isLogged = userStore.getState().isLogged;
    const localNotes = localNotesStore.getState().data;
    const cloudNotes = cloudNotesStore.getState().data;

    let hasUnsaved = false;

    if (isLogged && cloudNotes) {
      hasUnsaved = Object.values(cloudNotes).some(
        (note) => note.saved === false && (note.preSave || note.text)
      );
    } else if (localNotes) {
      hasUnsaved = Object.values(localNotes).some(
        (note) => note.saved === false && (note.preSave || note.text)
      );
    }

    return hasUnsaved;
  }, []); // No dependencies needed

  useBeforeUnload((e) => {
    if (hasUnsavedNotes()) {
      e.preventDefault();
      e.returnValue = "You have unsaved notes..";
    }
  });

  return <>{children}</>;
};

export default NotesProvider;
