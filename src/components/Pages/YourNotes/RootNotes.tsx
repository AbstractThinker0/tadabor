import { useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import { downloadHtmlFile, downloadNotesFile, htmlNote } from "@/util/backup";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import RootComponent from "@/components/Pages/YourNotes/RootComponent";
import BackupForm from "@/components/Pages/YourNotes/BackupForm";

import { Box, VStack } from "@chakra-ui/react";
import { useRootsLoaded } from "@/hooks/useRootsLoaded";
import { useSavedNotes } from "@/hooks/useSavedNote";

const RootNotes = () => {
  const rootsLoaded = useRootsLoaded();

  if (!rootsLoaded) return <LoadingSpinner text="Loading roots data.." />;

  return <NotesList />;
};

const NotesList = () => {
  const { t } = useTranslation();

  const { getNotesIDsbyType } = useSavedNotes();
  const rootNotesIDs = getNotesIDsbyType("root");

  return (
    <>
      {rootNotesIDs.length ? (
        <>
          <BackupComponent />
          <VStack gap={"2rem"} px={"1rem"} mdDown={{ px: "0.2rem" }}>
            {rootNotesIDs.map((noteID) => (
              <RootComponent noteID={noteID} key={noteID} />
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
  const rootNotesIDs = getNotesIDsbyType("root");

  const notesBackup = () => {
    if (loadingNotes) return;

    setLoadingNotes(true);

    if (currentFormat === "1") {
      let backupHTML = ``;

      rootNotesIDs.forEach((noteID) => {
        const note = userNotes[noteID];
        const noteRoot = quranService.getRootByID(note.key);

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

      rootNotesIDs.forEach((noteID) => {
        const note = userNotes[noteID];
        const noteRoot = quranService.getRootByID(note.key);

        if (!noteRoot) return;

        backupData.push({
          id: note.key,
          root: noteRoot.name,
          text: note.text,
        });
      });

      downloadNotesFile(backupData, "rootNotesBackup");
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

export default RootNotes;
