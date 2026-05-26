import { useTranslation } from "react-i18next";

import { LoadingSpinner } from "@/components/Generic/LoadingSpinner";

import { NoteComponent } from "@/components/Pages/YourNotes/NoteComponent";
import { BackupComponent } from "@/components/Pages/YourNotes/BackupComponent";
import { NoteSortSelect } from "@/components/Pages/YourNotes/NoteSortSelect";

import { Box, VStack } from "@chakra-ui/react";
import { useRootsLoaded } from "@/hooks/useRootsLoaded";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useNoteSorting } from "@/hooks/useNoteSorting";

const RootNotes = () => {
  const { t } = useTranslation();
  const rootsLoaded = useRootsLoaded();

  if (!rootsLoaded)
    return <LoadingSpinner text={t("ui.state.loading_roots_data")} />;

  return <NotesList />;
};

const NotesList = () => {
  const { t } = useTranslation();

  const { getNotesIdsByType, data: userNotes } = useNotesStore();
  const rootNoteIds = getNotesIdsByType("root");

  const rankComparator = (a: string, b: string) => {
    // Note ID format: root:{numericRootId}
    // Simple string comparison for roots
    return a.localeCompare(b);
  };

  const { sortBy, setSortBy, sortedNoteIds } = useNoteSorting({
    noteType: "root",
    noteIds: rootNoteIds,
    userNotes,
    rankComparator,
  });

  return (
    <>
      {rootNoteIds.length ? (
        <>
          <BackupComponent noteType="root" />

          <NoteSortSelect sortBy={sortBy} onSortChange={setSortBy} />

          <VStack gap={"2rem"} px={"1rem"} mdDown={{ px: "0.2rem" }}>
            {sortedNoteIds.map((noteId) => (
              <NoteComponent noteId={noteId} key={noteId} />
            ))}
          </VStack>
        </>
      ) : (
        <Box textAlign={"center"} fontSize={"larger"}>
          {t("notes.no_notes")}
        </Box>
      )}
    </>
  );
};

export { RootNotes };
