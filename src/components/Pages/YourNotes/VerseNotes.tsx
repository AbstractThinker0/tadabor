import { useTranslation } from "react-i18next";

import NoteComponent from "@/components/Pages/YourNotes/NoteComponent";
import BackupComponent from "@/components/Pages/YourNotes/BackupComponent";
import NoteSortSelect from "@/components/Pages/YourNotes/NoteSortSelect";

import { Box, VStack } from "@chakra-ui/react";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useNoteSorting } from "@/hooks/useNoteSorting";

const VerseNotes = () => {
  const { t } = useTranslation();

  const { getNotesIDsbyType, data: userNotes } = useNotesStore();
  const verseNotesIDs = getNotesIDsbyType("verse");

  const rankComparator = (a: string, b: string) => {
    // Note ID format: verse:chapter-verse
    const keyA = a.split(":")[1];
    const keyB = b.split(":")[1];

    const partsA = keyA.split("-");
    const partsB = keyB.split("-");

    const chapterA = parseInt(partsA[0] || "0");
    const verseA = parseInt(partsA[1] || "0");

    const chapterB = parseInt(partsB[0] || "0");
    const verseB = parseInt(partsB[1] || "0");
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
