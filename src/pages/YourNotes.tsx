import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

import { saveData, loadData } from "../util/db";

import { toast } from "react-toastify";
import useQuran from "../context/QuranContext";
import { useTranslation } from "react-i18next";
import { FormComponent, TextComponent } from "../components/TextForm";

function YourNotes() {
  interface notesType {
    [key: string]: string;
  }

  interface notesDirType {
    [key: string]: string; // "rtl" | "ltr";
  }

  interface markedNotesType {
    [key: string]: boolean;
  }

  const [loadingState, setLoadingState] = useState(true);
  const { t } = useTranslation();
  const { chapterNames, allQuranText } = useQuran();
  const [editableNotes, setEditableNotes] = useState<markedNotesType>({});
  const [areaDirection, setAreaDirection] = useState<notesDirType>({});
  const [myNotes, setMyNotes] = useState<notesType>({});

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userNotes = await loadData("notes");

      if (clientLeft) return;

      let extractNotes: notesType = {};
      userNotes.forEach((note) => {
        extractNotes[note.id] = note.text;
      });

      let userNotesDir = await loadData("notes_dir");

      if (clientLeft) return;

      let extractNotesDir: notesDirType = {};

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
    let info = key.split("-");
    return chapterNames[+info[0] - 1].name + ":" + info[1];
  };

  const getVerse = (key: string) => {
    let info = key.split("-");
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

    saveData("notes", {
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
    saveData("notes_dir", { id: verse_key, dir: dir });
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
