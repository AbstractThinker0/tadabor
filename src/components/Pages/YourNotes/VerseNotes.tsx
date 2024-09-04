import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";
import {
  isVerseNotesLoading,
  useAppDispatch,
  getAllNotesKeys,
  useAppSelector,
} from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { dbFuncs } from "@/util/db";
import { downloadHtmlFile, downloadNotesFile, htmlNote } from "@/util/backup";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseComponent from "@/components/Pages/YourNotes/VerseComponent";
import BackupForm from "@/components/Pages/YourNotes/BackupForm";

import { Box, VStack } from "@chakra-ui/react";

const VerseNotes = () => {
  const dispatch = useAppDispatch();
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  useEffect(() => {
    dispatch(fetchVerseNotes());
  }, []);

  return <>{isVNotesLoading ? <LoadingSpinner /> : <NotesList />}</>;
};

const NotesList = () => {
  const notesKeys = useAppSelector(getAllNotesKeys);
  const { t } = useTranslation();

  return (
    <>
      {notesKeys.length ? (
        <>
          <BackupComponent />
          <VStack>
            {notesKeys.map((key) => (
              <VerseComponent inputKey={key} key={key} />
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

    dbFuncs.loadNotes().then((allNotes) => {
      if (currentFormat === "1") {
        let backupHTML = ``;

        allNotes.forEach((note) => {
          const noteVerse = quranService.getVerseByKey(note.id);

          const verseData = htmlNote(
            quranService.convertKeyToSuffix(note.id),
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

        allNotes.forEach((note) => {
          const noteVerse = quranService.getVerseByKey(note.id);

          backupData.push({
            id: note.id,
            verse: noteVerse.versetext,
            text: note.text,
          });
        });

        downloadNotesFile(backupData, "verseNotesBackup");
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

export default VerseNotes;
