import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  isTransNotesLoading,
  useAppSelector,
  getAllTransNotesKeys,
} from "@/store";

import useQuran from "@/context/useQuran";
import { dbFuncs } from "@/util/db";
import { downloadHtmlFile, downloadNotesFile, htmlNote } from "@/util/backup";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import TransComponent from "@/components/Pages/YourNotes/TransComponent";
import BackupForm from "@/components/Pages/YourNotes/BackupForm";

import { Box, VStack } from "@chakra-ui/react";

const TransNotes = () => {
  const isTNotesLoading = useAppSelector(isTransNotesLoading());

  return (
    <>
      {isTNotesLoading ? (
        <LoadingSpinner text="Loading translation data.." />
      ) : (
        <NotesList />
      )}
    </>
  );
};

const NotesList = () => {
  const notesKeys = useAppSelector(getAllTransNotesKeys);
  const { t } = useTranslation();

  return (
    <>
      {notesKeys.length ? (
        <>
          <BackupComponent />
          <VStack>
            {notesKeys.map((key) => (
              <TransComponent verseKey={key} key={key} />
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

  const notesBackup = () => {
    if (loadingNotes) return;

    setLoadingNotes(true);

    dbFuncs.loadTranslations().then((allNotes) => {
      if (currentFormat === "1") {
        let backupHTML = ``;

        allNotes.forEach((note) => {
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

        allNotes.forEach((note) => {
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
    });
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
