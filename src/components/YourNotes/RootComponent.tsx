import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import useQuran from "@/context/useQuran";

import { selecRootNote, useAppDispatch, useAppSelector } from "@/store";
import { rootNotesActions } from "@/store/slices/global/rootNotes";

import { dbFuncs } from "@/util/db";

import { FormComponent, TextComponent } from "@/components/Custom/TextForm";

interface RootComponentProps {
  rootID: string;
}

const RootComponent = ({ rootID }: RootComponentProps) => {
  const quranService = useQuran();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const rootNote = useAppSelector(selecRootNote(rootID));

  const { text, dir = "" } = rootNote;

  const [stateEditable, setStateEditable] = useState(text ? false : true);

  const handleNoteChange = useCallback(
    (name: string, value: string) => {
      dispatch(rootNotesActions.changeRootNote({ name, value }));
    },
    [dispatch]
  );

  const handleInputSubmit = useCallback(
    (key: string, value: string) => {
      dbFuncs
        .saveRootNote(key, value, dir)
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
        rootNotesActions.changeRootNoteDir({
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
        {quranService.getRootNameByID(rootID)}
      </div>
      {stateEditable ? (
        <FormComponent
          inputValue={text}
          inputKey={rootID}
          inputDirection={dir}
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
          inputDirection={dir}
          handleEditButtonClick={handleEditClick}
          textClassname="card-body yournotes-note-text"
          editClassname="card-footer"
        />
      )}
    </div>
  );
};

export default RootComponent;
