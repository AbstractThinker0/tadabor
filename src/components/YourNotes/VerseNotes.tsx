import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getAllNotesKeys, useAppSelector } from "@/store";
import { dbFuncs } from "@/util/db";
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
      const blob = new Blob([JSON.stringify(allNotes)], {
        type: "application/json;charset=utf-8",
      });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "notesBackup.json";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      URL.revokeObjectURL(downloadLink.href);
      document.body.removeChild(downloadLink);
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
