import { useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";
import { getAllNotesKeys, useAppSelector } from "@/store";
import { dbFuncs } from "@/util/db";
import { downloadNotesFile } from "@/util/util";

import VerseComponent from "./VerseComponent";

const VerseNotes = () => {
  const myNotes = useAppSelector(getAllNotesKeys);
  const { t } = useTranslation();

  return (
    <>
      {myNotes.length ? (
        <NotesList notesKeys={myNotes} />
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
  const [loadingNotes, setLoadingNotes] = useState(false);
  const quranService = useQuran();

  const notesBackup = () => {
    if (loadingNotes) return;

    setLoadingNotes(true);
    dbFuncs.loadNotes().then((allNotes) => {
      const backupData: {
        verse: string;
        id: string;
        text: string;
      }[] = [];
      allNotes.forEach((note) => {
        const noteVerse = quranService.getVerseByKey(note.id);
        backupData.push({
          id: note.id,
          text: note.text,
          verse: noteVerse.versetext,
        });
      });
      downloadNotesFile(backupData, "notesBackup");
      setLoadingNotes(false);
    });
  };

  return (
    <>
      <div className="backup text-center p-2" dir="ltr">
        <div>
          <div>Output format:</div>
          <label className="form-check-label pe-1" htmlFor="jsonInput">
            JSON
          </label>
          <input className="" id="jsonInput" type="radio" defaultChecked />
        </div>
        <button className="btn btn-success" onClick={notesBackup}>
          Download notes
        </button>
      </div>
      {notesKeys.map((key) => (
        <VerseComponent verseKey={key} key={key} />
      ))}
    </>
  );
};

export default VerseNotes;
