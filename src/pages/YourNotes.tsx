import { useCallback, useState } from "react";

import { dbFuncs } from "../util/db";

import { toast } from "react-toastify";
import useQuran from "../context/QuranContext";
import { useTranslation } from "react-i18next";
import { FormComponent, TextComponent } from "../components/TextForm";
import { getAllNotes, useAppDispatch, useAppSelector } from "../store";
import { notesActions } from "../store/notesReducer";
import { NoteProp } from "../types";

function YourNotes() {
  const { t } = useTranslation();
  const myNotes = useAppSelector(getAllNotes());

  return (
    <div className="yournotes p-2">
      {Object.keys(myNotes).length ? (
        <>
          {Object.keys(myNotes).map((key) => (
            <NoteComponent verseNote={myNotes[key]} verseKey={key} key={key} />
          ))}
        </>
      ) : (
        <div className="fs-4 text-center">
          <div>{t("no_notes")}</div>
        </div>
      )}
    </div>
  );
}

interface NoteComponentProps {
  verseKey: string;
  verseNote: NoteProp;
}

function NoteComponent({ verseKey, verseNote }: NoteComponentProps) {
  const { chapterNames, allQuranText } = useQuran();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { text, dir } = verseNote;

  const [stateEditable, setStateEditable] = useState(text ? false : true);

  const convertKey = (key: string) => {
    const info = key.split("-");
    return chapterNames[+info[0] - 1].name + ":" + info[1];
  };

  const getVerse = (key: string) => {
    const info = key.split("-");
    return allQuranText[+info[0] - 1].verses[+info[1] - 1].versetext;
  };

  const handleNoteChange = useCallback(
    (name: string, value: string) => {
      dispatch(notesActions.changeNote({ name, value }));
    },
    [dispatch]
  );

  const handleInputSubmit = useCallback(
    (key: string, value: string) => {
      dbFuncs
        .saveNote({
          id: key,
          text: value,
          date_created: Date.now(),
          date_modified: Date.now(),
        })
        .then(function () {
          toast.success(t("save_success") as string);
        })
        .catch(function () {
          toast.success(t("save_failed") as string);
        });

      setStateEditable(false);
    },
    [t]
  );

  const handleSetDirection = useCallback(
    (verse_key: string, dir: string) => {
      dispatch(
        notesActions.changeNoteDir({
          name: verse_key,
          value: dir,
        })
      );

      dbFuncs.saveNoteDir({ id: verse_key, dir: dir });
    },
    [dispatch]
  );

  const handleEditClick = useCallback((inputKey: string) => {
    setStateEditable(true);
  }, []);

  return (
    <div className="card mb-3">
      <div className="card-header" dir="rtl">
        {convertKey(verseKey)} <br /> {getVerse(verseKey)}{" "}
      </div>
      {stateEditable ? (
        <FormComponent
          inputValue={text}
          inputKey={verseKey}
          inputDirection={dir}
          handleInputChange={handleNoteChange}
          handleInputSubmit={handleInputSubmit}
          handleSetDirection={handleSetDirection}
          bodyClassname="card-body"
          saveClassname="card-footer"
        />
      ) : (
        <TextComponent
          inputKey={verseKey}
          inputValue={text}
          inputDirection={dir}
          handleEditButtonClick={handleEditClick}
          textClassname="card-body yournotes-note-text"
          editClassname="card-footer"
        />
      )}
    </div>
  );
}

export default YourNotes;
