import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

import { saveData, loadData } from "../util/db";

import { toast } from "react-toastify";
import useQuran from "../context/QuranContext";
import { useTranslation } from "react-i18next";
import { YourNoteForm, YourNoteText } from "./TextForm";

function YourNotes() {
  const [loadingState, setLoadingState] = useState(true);
  const { t } = useTranslation();
  const { chapterNames, allQuranText } = useQuran();
  const [editableNotes, setEditableNotes] = useState({});
  const [areaDirection, setAreaDirection] = useState({});
  const [myNotes, setMyNotes] = useState({});

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userNotes = await loadData("notes");

      if (clientLeft) return;

      let extractNotes = {};
      userNotes.forEach((note) => {
        extractNotes[note.id] = note.text;
      });

      let userNotesDir = await loadData("notes_dir");

      if (clientLeft) return;

      let extractNotesDir = {};

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

  const convertKey = (key) => {
    let info = key.split("-");
    return chapterNames[info[0] - 1].name + ":" + info[1];
  };

  const getVerse = (key) => {
    let info = key.split("-");
    return allQuranText[info[0] - 1].verses[info[1] - 1].versetext;
  };

  function handleEditOnClick(event) {
    let inputKey = event.target.name;
    setEditableNotes((state) => {
      return { ...state, [inputKey]: true };
    });
  }

  const memoHandleEditOnClick = useCallback(handleEditOnClick, []);

  function handleNoteSave(event, value) {
    event.preventDefault();
    let note_key = event.target.name;

    setEditableNotes((state) => {
      return { ...state, [note_key]: false };
    });

    saveData("notes", {
      id: note_key,
      text: value,
      date_created: Date.now(),
      date_modified: Date.now(),
    })
      .then(function (result) {
        toast.success(t("save_success"));
      })
      .catch(function (error) {
        toast.success(t("save_failed"));
      });
  }

  function handleNoteChange(event) {
    const { name, value } = event.target;

    setMyNotes((state) => {
      return { ...state, [name]: value };
    });
  }

  function handleSetDirection(verse_key, dir) {
    setAreaDirection((state) => {
      return { ...state, [verse_key]: dir };
    });
    saveData("notes_dir", { id: verse_key, dir: dir });
  }

  const memoHandleSetDirection = useCallback(handleSetDirection, []);

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="p-2">
      {Object.keys(myNotes).map((key) => (
        <div key={key} className="card mb-3">
          <div className="card-header" dir="rtl">
            {convertKey(key)} <br /> {getVerse(key)}{" "}
          </div>
          {editableNotes[key] ? (
            <YourNoteForm
              inputValue={myNotes[key]}
              inputKey={key}
              inputDirection={areaDirection[key] || ""}
              handleInputChange={handleNoteChange}
              handleInputSubmit={handleNoteSave}
              handleSetDirection={memoHandleSetDirection}
            />
          ) : (
            <YourNoteText
              inputKey={key}
              inputValue={myNotes[key]}
              inputDirection={areaDirection[key] || ""}
              handleEditClick={memoHandleEditOnClick}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default YourNotes;
