import { useEffect } from "react";

import { useLocalNotesStore } from "@/store/global/localNotes";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

const LocalNotesProvider = ({ children }: { children: React.ReactNode }) => {
  const isLocalNotesLoading = useLocalNotesStore((state) => state.loading);
  const fetchLocalNotes = useLocalNotesStore((state) => state.fetchLocalNotes);

  useEffect(() => {
    fetchLocalNotes();
  }, [fetchLocalNotes]);

  if (isLocalNotesLoading) {
    return <LoadingSpinner text="Loading local notes.." />;
  }

  return <>{children}</>;
};

export default LocalNotesProvider;
