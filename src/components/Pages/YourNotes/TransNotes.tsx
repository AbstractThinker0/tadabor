import { useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import { downloadHtmlFile, downloadNotesFile, htmlNote } from "@/util/backup";

import TransComponent from "@/components/Pages/YourNotes/TransComponent";
import BackupForm from "@/components/Pages/YourNotes/BackupForm";

import { Box, VStack } from "@chakra-ui/react";
import { useSavedNotes } from "@/hooks/useSavedNote";

const TransNotes = () => {
  const { t } = useTranslation();

  const { getNotesIDsbyType } = useSavedNotes();
  const translationNotesIDs = getNotesIDsbyType("translation");

  return (
    <>
      {translationNotesIDs.length ? (
        <>
          <BackupComponent />
          <VStack>
            {translationNotesIDs.map((noteID) => (
              <TransComponent noteID={noteID} key={noteID} />
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
  const translationNotesIDs = getNotesIDsbyType("translation");

  const notesBackup = () => {
    if (loadingNotes) return;

    setLoadingNotes(true);

    if (currentFormat === "1") {
      let backupHTML = ``;

      translationNotesIDs.forEach((noteID) => {
        const note = userNotes[noteID];
        const noteVerse = quranService.getVerseByKey(note.key)!;

        const verseData = htmlNote(
          quranService.convertKeyToSuffix(note.key),
          noteVerse.versetext,
          note.text,
          "ltr"
        );

        backupHTML = backupHTML.concat(verseData);
      });

      downloadHtmlFile(backupHTML, "translationBackup");
    } else {
      const backupData: {
        verse: string;
        id: string;
        text: string;
      }[] = [];

      translationNotesIDs.forEach((noteID) => {
        const note = userNotes[noteID];
        const noteVerse = quranService.getVerseByKey(note.key)!;

        backupData.push({
          id: note.key,
          verse: noteVerse.versetext,
          text: note.text,
        });
      });

      downloadNotesFile(backupData, "translationBackup");
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

export default TransNotes;
