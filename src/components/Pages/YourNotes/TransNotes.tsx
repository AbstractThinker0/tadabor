import { useTranslation } from "react-i18next";

import { NoteComponent } from "@/components/Pages/YourNotes/NoteComponent";
import { BackupComponent } from "@/components/Pages/YourNotes/BackupComponent";
import { NoteSortSelect } from "@/components/Pages/YourNotes/NoteSortSelect";

import { Box, VStack } from "@chakra-ui/react";
import { useNotesStore } from "@/hooks/useNotesStore";
import { useNoteSorting } from "@/hooks/useNoteSorting";
import { parseNoteId, parseVerseAddressKey } from "@/util/noteIdentity";

const TransNotes = () => {
  const { t } = useTranslation();

  const { getNotesIdsByType, data: userNotes } = useNotesStore();
  const translationNoteIds = getNotesIdsByType("translation");

  const rankComparator = (a: string, b: string) => {
    // Note ID format: translation:chapter-verse
    const { key: keyA } = parseNoteId(a);
    const { key: keyB } = parseNoteId(b);
    const { chapter: chapterA, verse: verseA } = parseVerseAddressKey(keyA);
    const { chapter: chapterB, verse: verseB } = parseVerseAddressKey(keyB);

    if (chapterA !== chapterB) return chapterA - chapterB;
    return verseA - verseB;
  };

  const { sortBy, setSortBy, sortedNoteIds } = useNoteSorting({
    noteType: "translation",
    noteIds: translationNoteIds,
    userNotes,
    rankComparator,
  });

  return (
    <>
      {translationNoteIds.length ? (
        <>
          <BackupComponent noteType="translation" />

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

export { TransNotes };
