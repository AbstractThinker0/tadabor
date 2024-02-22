import { useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";
import { getAllNotesKeys, useAppSelector } from "@/store";
import { dbFuncs } from "@/util/db";
import { downloadHtmlFile, downloadNotesFile, htmlNote } from "@/util/backup";

import VerseComponent from "./VerseComponent";

const VerseNotes = () => {
  const notesKeys = useAppSelector(getAllNotesKeys);
  const { t } = useTranslation();

  return (
    <>
      {notesKeys.length ? (
        <NotesList notesKeys={notesKeys} />
      ) : (
        <div className="fs-4 text-center">
          <div>{t("no_notes")}</div>
        </div>
      )}
    </>
  );
};

interface NotesListProps {
  notesKeys: string[];
}

const NotesList = ({ notesKeys }: NotesListProps) => {
  return (
    <>
      <BackupComponent />
      {notesKeys.map((key) => (
        <VerseComponent verseKey={key} key={key} />
      ))}
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

  function onChangeFormat(event: React.ChangeEvent<HTMLSelectElement>) {
    setFormat(event.target.value);
  }

  return (
    <div className="backup text-center p-2" dir="ltr">
      <div>Output format:</div>
      <div>
        <select
          value={currentFormat}
          onChange={onChangeFormat}
          className="form-select"
          aria-label="Default select example"
        >
          <option value="1">HTML</option>
          <option value="2">JSON</option>
        </select>
      </div>
      <button className="btn btn-success" onClick={notesBackup}>
        Download notes
      </button>
    </div>
  );
};

export default VerseNotes;
