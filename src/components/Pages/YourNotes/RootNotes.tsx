import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  isRootNotesLoading,
  useAppDispatch,
  getAllRootNotesKeys,
  useAppSelector,
} from "@/store";

import { fetchRootNotes } from "@/store/slices/global/rootNotes";

import useQuran from "@/context/useQuran";
import { dbFuncs } from "@/util/db";
import { downloadHtmlFile, downloadNotesFile, htmlNote } from "@/util/backup";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import RootComponent from "@/components/Pages/YourNotes/RootComponent";
import BackupForm from "@/components/Pages/YourNotes/BackupForm";

import { Box, VStack } from "@chakra-ui/react";

const RootNotes = () => {
  const dispatch = useAppDispatch();
  const isRNotesLoading = useAppSelector(isRootNotesLoading());

  useEffect(() => {
    dispatch(fetchRootNotes());
  }, []);

  return <>{isRNotesLoading ? <LoadingSpinner /> : <NotesList />}</>;
};

const NotesList = () => {
  const myNotes = useAppSelector(getAllRootNotesKeys);
  const { t } = useTranslation();

  return (
    <>
      {myNotes.length ? (
        <>
          <BackupComponent />
          <VStack>
            {myNotes.map((key) => (
              <RootComponent inputKey={key} key={key} />
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

    dbFuncs.loadRootNotes().then((allNotes) => {
      if (currentFormat === "1") {
        let backupHTML = ``;

        allNotes.forEach((note) => {
          const noteRoot = quranService.getRootByID(note.id);

          if (!noteRoot) return;

          const verseData = htmlNote(noteRoot.name, "", note.text, note.dir);

          backupHTML = backupHTML.concat(verseData);
        });

        downloadHtmlFile(backupHTML, "rootNotesBackup");
      } else {
        const backupData: {
          root: string;
          id: string;
          text: string;
        }[] = [];

        allNotes.forEach((note) => {
          const noteRoot = quranService.getRootByID(note.id);

          if (!noteRoot) return;

          backupData.push({
            id: note.id,
            root: noteRoot.name,
            text: note.text,
          });
        });

        downloadNotesFile(backupData, "rootNotesBackup");
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

export default RootNotes;
