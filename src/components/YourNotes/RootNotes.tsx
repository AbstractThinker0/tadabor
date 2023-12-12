import { useTranslation } from "react-i18next";
import { getAllRootNotes, useAppDispatch, useAppSelector } from "@/store";
import useQuran from "@/context/QuranContext";
import { NoteProp } from "@/types";
import { useCallback, useState } from "react";
import { dbFuncs } from "@/util/db";
import { toast } from "react-toastify";
import { rootNotesActions } from "@/store/slices/rootNotes";
import { FormComponent, TextComponent } from "@/components/TextForm";

const RootNotes = () => {
  const myNotes = useAppSelector(getAllRootNotes());
  const { t } = useTranslation();

  return (
    <>
      {Object.keys(myNotes).length ? (
        <>
          {Object.keys(myNotes).map((key) => (
            <NoteComponent rootNote={myNotes[key]} rootID={key} key={key} />
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
  rootID: string;
  rootNote: NoteProp;
}

function NoteComponent({ rootID, rootNote }: NoteComponentProps) {
  const { quranRoots } = useQuran();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { text, dir } = rootNote;

  const [stateEditable, setStateEditable] = useState(text ? false : true);

  const getRootByID = (key: string) => {
    const root = quranRoots.find((root) => root.id === +key);
    return root;
  };

  const handleNoteChange = useCallback(
    (name: string, value: string) => {
      dispatch(rootNotesActions.changeRootNote({ name, value }));
    },
    [dispatch]
  );

  const handleInputSubmit = useCallback(
    (key: string, value: string) => {
      dbFuncs
        .saveRootNote(key, value, dir || "")
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
        rootNotesActions.changeRootNoteDir({
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
        {getRootByID(rootID)?.name}
      </div>
      {stateEditable ? (
        <FormComponent
          inputValue={text}
          inputKey={rootID}
          inputDirection={dir || ""}
          handleInputChange={handleNoteChange}
          handleInputSubmit={handleInputSubmit}
          handleSetDirection={handleSetDirection}
          bodyClassname="card-body"
          saveClassname="card-footer"
        />
      ) : (
        <TextComponent
          inputKey={rootID}
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

export default RootNotes;
