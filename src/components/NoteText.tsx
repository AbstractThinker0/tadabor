import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store";
import { notesActions } from "../store/notesReducer";
import { dbFuncs } from "../util/db";
import { toast } from "react-toastify";
import { TextForm } from "./TextForm";

interface NoteTextProps {
  verseKey: string;
  className?: string;
}

const NoteText = memo(({ verseKey, className }: NoteTextProps) => {
  const { t } = useTranslation();
  const currentNote = useAppSelector((state) => state.notes[verseKey]);
  const dispatch = useAppDispatch();

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

  const noteText = currentNote ? currentNote.text : "";
  const inputDirection = currentNote ? currentNote.dir : "";

  const [stateEditable, setStateEditable] = useState(noteText ? false : true);

  return (
    <TextForm
      inputKey={verseKey}
      inputValue={noteText}
      isEditable={stateEditable}
      inputDirection={inputDirection}
      handleInputChange={handleNoteChange}
      handleEditClick={handleEditClick}
      handleSetDirection={handleSetDirection}
      handleInputSubmit={handleInputSubmit}
      className={className}
    />
  );
});

NoteText.displayName = "NoteText";

export default NoteText;
