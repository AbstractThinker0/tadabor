import { useState } from "react";
import { useTranslation } from "react-i18next";

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

  const notesBackup = () => {
    if (loadingNotes) return;

    setLoadingNotes(true);
    dbFuncs.loadNotes().then((allNotes) => {
      downloadNotesFile(allNotes, "notesBackup");
      setLoadingNotes(false);
    });
  };

  return (
    <>
      <div className="text-center p-2">
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
