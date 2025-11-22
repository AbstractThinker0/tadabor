import { useTranslation } from "react-i18next";

import NoteComponent from "@/components/Pages/YourNotes/NoteComponent";
import BackupComponent from "@/components/Pages/YourNotes/BackupComponent";
import NoteSortSelect from "@/components/Pages/YourNotes/NoteSortSelect";

import { Box, VStack } from "@chakra-ui/react";
import { useSavedNotes } from "@/hooks/useSavedNotes";
import { useNoteSorting } from "@/hooks/useNoteSorting";

const VerseNotes = () => {
  const { t } = useTranslation();

  const { getNotesIDsbyType, userNotes } = useSavedNotes();
  const verseNotesIDs = getNotesIDsbyType("verse");

  const rankComparator = (a: string, b: string) => {
    // Note ID format: verse:chapter:verse
    const partsA = a.split(":");
    const partsB = b.split(":");

    const chapterA = parseInt(partsA[1] || "0");
    const verseA = parseInt(partsA[2] || "0");

    const chapterB = parseInt(partsB[1] || "0");
    const verseB = parseInt(partsB[2] || "0");

    if (chapterA !== chapterB) return chapterA - chapterB;
    return verseA - verseB;
  };

  const { sortBy, setSortBy, sortedNotesIDs } = useNoteSorting({
    noteIDs: verseNotesIDs,
    userNotes,
    rankComparator,
  });

  return (
    <>
      {verseNotesIDs.length ? (
        <>
          <BackupComponent noteType="verse" />

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

export default VerseNotes;
