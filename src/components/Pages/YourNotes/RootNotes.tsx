import { useTranslation } from "react-i18next";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import NoteComponent from "@/components/Pages/YourNotes/NoteComponent";
import BackupComponent from "@/components/Pages/YourNotes/BackupComponent";
import NoteSortSelect from "@/components/Pages/YourNotes/NoteSortSelect";

import { Box, VStack } from "@chakra-ui/react";
import { useRootsLoaded } from "@/hooks/useRootsLoaded";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useNoteSorting } from "@/hooks/useNoteSorting";

const RootNotes = () => {
  const rootsLoaded = useRootsLoaded();

  if (!rootsLoaded) return <LoadingSpinner text="Loading roots data.." />;

  return <NotesList />;
};

const NotesList = () => {
  const { t } = useTranslation();

  const { getNotesIDsbyType, data: userNotes } = useNotesStore();
  const rootNotesIDs = getNotesIDsbyType("root");

  const rankComparator = (a: string, b: string) => {
    // Note ID format: root:rootString
    // Simple string comparison for roots
    return a.localeCompare(b);
  };

  const { sortBy, setSortBy, sortedNotesIDs } = useNoteSorting({
    noteIDs: rootNotesIDs,
    userNotes,
    rankComparator,
  });

  return (
    <>
      {rootNotesIDs.length ? (
        <>
          <BackupComponent noteType="root" />

          <NoteSortSelect sortBy={sortBy} onSortChange={setSortBy} />

          <VStack gap={"2rem"} px={"1rem"} mdDown={{ px: "0.2rem" }}>
            {sortedNotesIDs.map((noteID) => (
              <NoteComponent noteID={noteID} key={noteID} />
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

export default RootNotes;
