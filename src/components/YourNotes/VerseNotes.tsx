import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import useQuran from "@/context/QuranContext";
import { useAppDispatch, getAllNotes, useAppSelector } from "@/store";
import { verseNotesActions } from "@/store/slices/verseNotes";
import { NoteProp } from "@/types";
import { dbFuncs } from "@/util/db";

import { FormComponent, TextComponent } from "@/components/TextForm";

const VerseNotes = () => {
  const myNotes = useAppSelector(getAllNotes());
  const { t } = useTranslation();

  return (
    <>
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
    </>
  );
};

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
      dispatch(verseNotesActions.changeNote({ name, value }));
    },
    [dispatch]
  );

  const handleInputSubmit = useCallback(
    (key: string, value: string) => {
      dbFuncs
        .saveNote(key, value, dir || "")
        .then(function () {
          toast.success(t("save_success") as string);
        })
        .catch(function () {
          toast.success(t("save_failed") as string);
        });

      setStateEditable(false);
    },
    [dir]
  );

  const handleSetDirection = useCallback(
    (verse_key: string, dir: string) => {
      dispatch(
        verseNotesActions.changeNoteDir({
          name: verse_key,
          value: dir,
        })
      );
    },
    [dispatch]
  );

  const handleEditClick = useCallback((inputKey: string) => {
    setStateEditable(true);
  }, []);

  return (
    <div className="card mb-3">
      <div className="card-header fs-3" dir="rtl">
        ({convertKey(verseKey)}) <br /> {getVerse(verseKey)}{" "}
      </div>
      {stateEditable ? (
        <FormComponent
          inputValue={text}
          inputKey={verseKey}
          inputDirection={dir || ""}
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
          inputDirection={dir || ""}
          handleEditButtonClick={handleEditClick}
          textClassname="card-body yournotes-note-text"
          editClassname="card-footer"
        />
      )}
    </div>
  );
}

export default VerseNotes;
