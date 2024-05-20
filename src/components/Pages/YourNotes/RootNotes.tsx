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
          {myNotes.map((key) => (
            <RootComponent rootID={key} key={key} />
          ))}
        </>
      ) : (
        <div className="fs-4 text-center">
          <div>{t("no_notes")}</div>
        </div>
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

export default RootNotes;
