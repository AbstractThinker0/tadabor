import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import useQuran from "@/context/useQuran";
import { useAppDispatch, useAppSelector, selectNote } from "@/store";
import { verseNotesActions } from "@/store/slices/verseNotes";
import { dbFuncs } from "@/util/db";

import { FormComponent, TextComponent } from "@/components/Generic/TextForm";

interface VerseComponentProps {
  verseKey: string;
}

function VerseComponent({ verseKey }: VerseComponentProps) {
  const quranService = useQuran();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const verseNote = useAppSelector(selectNote(verseKey));

  const { text, dir = "" } = verseNote;

  const [stateEditable, setStateEditable] = useState(text ? false : true);

  const handleNoteChange = useCallback(
    (name: string, value: string) => {
      dispatch(verseNotesActions.changeNote({ name, value }));
    },
    [dispatch]
  );

  const handleInputSubmit = useCallback(
    (key: string, value: string) => {
      dbFuncs
        .saveNote(key, value, dir)
        .then(function () {
          toast.success(t("save_success"));
        })
        .catch(function () {
          toast.error(t("save_failed"));
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

  const handleEditClick = useCallback(() => {
    setStateEditable(true);
  }, []);

  return (
    <div className="card mb-3">
      <div className="card-header fs-3" dir="rtl">
        ({quranService.convertKeyToSuffix(verseKey)}) <br />{" "}
        {quranService.getVerseTextByKey(verseKey)}{" "}
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

export default VerseComponent;
