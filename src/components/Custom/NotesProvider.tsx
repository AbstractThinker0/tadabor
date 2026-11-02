import { useCallback } from "react";

import { hasUnsavedNotes } from "@/features/notes/notesStorage";

import { useBeforeUnload } from "react-router";

interface NotesProviderProps {
  children: React.ReactNode;
}

const NotesProvider = ({ children }: NotesProviderProps) => {
  const shouldWarnOnUnload = useCallback(() => hasUnsavedNotes(), []);

  useBeforeUnload((e) => {
    if (shouldWarnOnUnload()) {
      e.preventDefault();
      e.returnValue = "You have unsaved notes..";
    }
  });

  return <>{children}</>;
};

export { NotesProvider };