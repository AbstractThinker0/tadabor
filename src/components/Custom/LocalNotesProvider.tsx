import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useLocalNotesStore } from "@/store/global/localNotes";

import { LoadingSpinner } from "@/components/Generic/LoadingSpinner";

const LocalNotesProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const isLocalNotesLoading = useLocalNotesStore((state) => state.loading);
  const fetchLocalNotes = useLocalNotesStore((state) => state.fetchLocalNotes);

  useEffect(() => {
    fetchLocalNotes();
  }, [fetchLocalNotes]);

  if (isLocalNotesLoading) {
    return <LoadingSpinner text={t("ui.state.loading_local_notes")} />;
  }

  return <>{children}</>;
};

export { LocalNotesProvider };
