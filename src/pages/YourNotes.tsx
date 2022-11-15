import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

import { saveData, loadData } from "../util/db";

import { toast } from "react-toastify";
import useQuran from "../context/QuranContext";
import { useTranslation } from "react-i18next";
import { YourNoteForm, YourNoteText } from "../components/TextForm";

function YourNotes() {
  const [loadingState, setLoadingState] = useState(true);
  const { t } = useTranslation();
  const { chapterNames, allQuranText }: any = useQuran();
  const [editableNotes, setEditableNotes] = useState<any>({});
  const [areaDirection, setAreaDirection] = useState<any>({});
  const [myNotes, setMyNotes] = useState<any>({});

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userNotes = await loadData("notes");

      if (clientLeft) return;

      let extractNotes = {};
      userNotes.forEach((note: any) => {
        (extractNotes as any)[note.id] = note.text;
      });

      let userNotesDir = await loadData("notes_dir");

      if (clientLeft) return;

      let extractNotesDir = {};

      userNotesDir.forEach((note: { id: string | number; dir: string }) => {
        (extractNotesDir as any)[note.id] = note.dir;
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

  function handleEditOnClick(event: React.MouseEvent<HTMLButtonElement>) {
    let inputKey = event.currentTarget.name;
    setEditableNotes((state: any) => {
      return { ...state, [inputKey]: true };
    });
  }

  const memoHandleEditOnClick = useCallback(handleEditOnClick, []);

  function handleNoteSave(
    event: React.FormEvent<HTMLFormElement>,
    value: string
  ) {
    event.preventDefault();
    let note_key = event.currentTarget.name;

    setEditableNotes((state: any) => {
      return { ...state, [note_key]: false };
    });

    saveData("notes", {
      id: note_key,
      text: value,
      date_created: Date.now(),
      date_modified: Date.now(),
    })
      .then(function () {
        toast.success(t("save_success"));
      })
      .catch(function () {
        toast.success(t("save_failed"));
      });
  }

  function handleNoteChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setMyNotes((state: any) => {
      return { ...state, [name]: value };
    });
  }

  function handleSetDirection(verse_key: string, dir: string) {
    setAreaDirection((state: any) => {
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
