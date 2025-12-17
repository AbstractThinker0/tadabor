import { useCallback } from "react";

import { useAppSelector } from "@/store";

import { useBeforeUnload } from "react-router";

interface NotesProviderProps {
  children: React.ReactNode;
}

const NotesProvider = ({ children }: NotesProviderProps) => {
  const isLogged = useAppSelector((state) => state.user.isLogged);

  const localNotes = useAppSelector((state) => state.localNotes.data);

  const cloudNotes = useAppSelector((state) => state.cloudNotes.data);

  const hasUnsavedNotes = useCallback(() => {
    let hasUnsavedNotes = false;

    if (isLogged && cloudNotes) {
      hasUnsavedNotes = Object.values(cloudNotes).some(
        (note) => note.saved === false && (note.preSave || note.text)
      );
    } else if (localNotes) {
      hasUnsavedNotes = Object.values(localNotes).some(
        (note) => note.saved === false && (note.preSave || note.text)
      );
    }

    return hasUnsavedNotes;
  }, [isLogged, cloudNotes, localNotes]);

  useBeforeUnload((e) => {
    if (hasUnsavedNotes()) {
      e.preventDefault();
      e.returnValue = "You have unsaved notes..";
    }
  });

  return <>{children}</>;
};

export default NotesProvider;
