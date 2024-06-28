import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { selectNote, useAppDispatch, useAppSelector } from "@/store";
import { verseNotesActions } from "@/store/slices/global/verseNotes";
import { dbFuncs } from "@/util/db";

import { TextForm } from "@/components/Custom/TextForm";

interface NoteTextProps {
  verseKey: string;
  className?: string;
  targetID?: string;
}

const NoteText = memo(({ verseKey, className, targetID }: NoteTextProps) => {
  const { t } = useTranslation();
  const currentNote = useAppSelector(selectNote(verseKey));
  const dispatch = useAppDispatch();

  const noteText = currentNote?.text || "";
  const inputDirection = currentNote?.dir || "";

  const [stateEditable, setStateEditable] = useState(noteText ? false : true);

  const handleNoteChange = useCallback(
    (name: string, value: string) => {
      dispatch(verseNotesActions.changeNote({ name, value }));
    },
    [dispatch]
  );

  const handleInputSubmit = useCallback(
    (key: string, value: string) => {
      dbFuncs
        .saveNote(key, value, inputDirection)
        .then(() => {
          toast.success(t("save_success"));
        })
        .catch(() => {
          toast.error(t("save_failed"));
        });

      setStateEditable(false);
    },
    [inputDirection]
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
      targetID={targetID}
    />
  );
});

NoteText.displayName = "NoteText";

export default NoteText;
