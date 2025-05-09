import { useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import { downloadHtmlFile, downloadNotesFile, htmlNote } from "@/util/backup";

import VerseComponent from "@/components/Pages/YourNotes/VerseComponent";
import BackupForm from "@/components/Pages/YourNotes/BackupForm";

import { Box, VStack } from "@chakra-ui/react";
import { useSavedNotes } from "@/hooks/useSavedNote";

const VerseNotes = () => {
  const { t } = useTranslation();

  const { getNotesIDsbyType } = useSavedNotes();
  const verseNotesIDs = getNotesIDsbyType("verse");

  return (
    <>
      {verseNotesIDs.length ? (
        <>
          <BackupComponent />
          <VStack gap={"2rem"} px={"1rem"} mdDown={{ px: "0.2rem" }}>
            {verseNotesIDs.map((noteID) => (
              <VerseComponent noteID={noteID} key={noteID} />
            ))}
          </VStack>
        </>
      ) : (
        <Box textAlign={"center"} fontSize={"larger"}>
          {t("no_notes")}
        </Box>
      )}
    </>
  );
};

const BackupComponent = () => {
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [currentFormat, setFormat] = useState("1");

  const quranService = useQuran();

  const { getNotesIDsbyType, userNotes } = useSavedNotes();
  const verseNotesIDs = getNotesIDsbyType("verse");

  const notesBackup = () => {
    if (loadingNotes) return;

    setLoadingNotes(true);

    if (currentFormat === "1") {
      let backupHTML = ``;

      verseNotesIDs.forEach((noteID) => {
        const note = userNotes[noteID];
        const noteVerse = quranService.getVerseByKey(note.key)!;

        const verseData = htmlNote(
          quranService.convertKeyToSuffix(note.key),
          noteVerse.versetext,
          note.text,
          note.dir
        );

        backupHTML = backupHTML.concat(verseData);
      });

      downloadHtmlFile(backupHTML, "verseNotesBackup");
    } else {
      const backupData: {
        verse: string;
        id: string;
        text: string;
      }[] = [];

      verseNotesIDs.forEach((noteID) => {
        const note = userNotes[noteID];
        const noteVerse = quranService.getVerseByKey(note.key)!;

        backupData.push({
          id: note.key,
          verse: noteVerse.versetext,
          text: note.text,
        });
      });

      downloadNotesFile(backupData, "verseNotesBackup");
    }

    setLoadingNotes(false);
  };

  const handleFormat = (format: string) => {
    setFormat(format);
  };

  return (
    <BackupForm
      currentFormat={currentFormat}
      handleFormat={handleFormat}
      notesBackup={notesBackup}
    />
  );
};

export default VerseNotes;
