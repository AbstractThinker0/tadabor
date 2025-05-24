import { useState } from "react";

import useQuran from "@/context/useQuran";

import { downloadHtmlFile, downloadNotesFile, htmlNote } from "@/util/backup";

import BackupForm from "@/components/Pages/YourNotes/BackupForm";

import { useSavedNotes } from "@/hooks/useSavedNote";

interface BackupComponentProps {
  noteType: "verse" | "translation" | "root";
}

const BackupComponent: React.FC<BackupComponentProps> = ({ noteType }) => {
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [currentFormat, setFormat] = useState("1");

  const quranService = useQuran();
  const { getNotesIDsbyType, userNotes } = useSavedNotes();
  const noteIDs = getNotesIDsbyType(noteType);

  const notesBackup = () => {
    if (loadingNotes) return;
    setLoadingNotes(true);

    if (currentFormat === "1") {
      let backupHTML = ``;

      noteIDs.forEach((noteID) => {
        const note = userNotes[noteID];

        if (noteType === "verse" || noteType === "translation") {
          const noteVerse = quranService.getVerseByKey(note.key);
          if (!noteVerse) return;

          const verseData = htmlNote(
            quranService.convertKeyToSuffix(note.key),
            noteVerse.versetext,
            note.text,
            noteType === "translation" ? "ltr" : note.dir
          );

          backupHTML = backupHTML.concat(verseData);
        }

        if (noteType === "root") {
          const noteRoot = quranService.getRootByID(note.key);
          if (!noteRoot) return;

          const verseData = htmlNote(noteRoot.name, "", note.text, note.dir);
          backupHTML = backupHTML.concat(verseData);
        }
      });

      downloadHtmlFile(backupHTML, `${noteType}NotesBackup`);
    } else {
      const backupData: any[] = [];

      noteIDs.forEach((noteID) => {
        const note = userNotes[noteID];

        if (noteType === "verse" || noteType === "translation") {
          const noteVerse = quranService.getVerseByKey(note.key);
          if (!noteVerse) return;

          backupData.push({
            id: note.key,
            verse: noteVerse.versetext,
            text: note.text,
          });
        } else if (noteType === "root") {
          const noteRoot = quranService.getRootByID(note.key);
          if (!noteRoot) return;

          backupData.push({
            id: note.key,
            root: noteRoot.name,
            text: note.text,
          });
        }
      });

      downloadNotesFile(backupData, `${noteType}NotesBackup`);
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

export default BackupComponent;
