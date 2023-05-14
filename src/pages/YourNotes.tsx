import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

import { dbFuncs } from "../util/db";

import { toast } from "react-toastify";
import useQuran from "../context/QuranContext";
import { useTranslation } from "react-i18next";
import { FormComponent, TextComponent } from "../components/TextForm";
import { markedNotesType, notesDirectionType, notesType } from "../types";

function YourNotes() {
  const [loadingState, setLoadingState] = useState(true);
  const { t } = useTranslation();
  const { chapterNames, allQuranText } = useQuran();
  const [editableNotes, setEditableNotes] = useState<markedNotesType>({});
  const [areaDirection, setAreaDirection] = useState<notesDirectionType>({});
  const [myNotes, setMyNotes] = useState<notesType>({});

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      const userNotes = await dbFuncs.loadNotes();

      if (clientLeft) return;

      const extractNotes: notesType = {};
      userNotes.forEach((note) => {
        extractNotes[note.id] = note.text;
      });

      const userNotesDir = await dbFuncs.loadNotesDir();

      if (clientLeft) return;

      const extractNotesDir: notesDirectionType = {};

      userNotesDir.forEach((note) => {
        extractNotesDir[note.id] = note.dir;
      });

      setMyNotes(extractNotes);
      setAreaDirection(extractNotesDir);

      setLoadingState(false);
    }

    return () => {
      clientLeft = true;
    };
  }, []);

  const convertKey = (key: string) => {
    const info = key.split("-");
    return chapterNames[+info[0] - 1].name + ":" + info[1];
  };

  const getVerse = (key: string) => {
    const info = key.split("-");
    return allQuranText[+info[0] - 1].verses[+info[1] - 1].versetext;
  };

  function handleEditOnClick(inputKey: string) {
    setEditableNotes((state) => {
      return { ...state, [inputKey]: true };
    });
  }

  const memoHandleEditOnClick = useCallback(handleEditOnClick, []);

  function handleNoteSave(noteKey: string, value: string) {
    setEditableNotes((state) => {
      return { ...state, [noteKey]: false };
    });

    dbFuncs
      .saveNote({
        id: noteKey,
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
  }

  function handleNoteChange(noteKey: string, value: string) {
    setMyNotes((state) => {
      return { ...state, [noteKey]: value };
    });
  }

  function handleSetDirection(verse_key: string, dir: string) {
    setAreaDirection((state) => {
      return { ...state, [verse_key]: dir };
    });
    dbFuncs.saveNoteDir({ id: verse_key, dir: dir });
  }

  const memoHandleSetDirection = useCallback(handleSetDirection, []);

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="yournotes p-2">
      {Object.keys(myNotes).map((key) => (
        <div key={key} className="card mb-3">
          <div className="card-header" dir="rtl">
            {convertKey(key)} <br /> {getVerse(key)}{" "}
          </div>
          {editableNotes[key] ? (
            <FormComponent
              inputValue={myNotes[key]}
              inputKey={key}
              inputDirection={areaDirection[key] || ""}
              handleInputChange={handleNoteChange}
              handleInputSubmit={handleNoteSave}
              handleSetDirection={memoHandleSetDirection}
              bodyClassname="card-body"
              saveClassname="card-footer"
            />
          ) : (
            <TextComponent
              inputKey={key}
              inputValue={myNotes[key]}
              inputDirection={areaDirection[key] || ""}
              handleEditButtonClick={memoHandleEditOnClick}
              textClassname="card-body"
              editClassname="card-footer"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default YourNotes;
