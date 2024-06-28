import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { selectTransNote, useAppDispatch, useAppSelector } from "@/store";
import { transNotesActions } from "@/store/slices/global/transNotes";
import { dbFuncs } from "@/util/db";

import { TextAreaComponent } from "@/components/Custom/TextForm";

interface UserTranslationProps {
  verseKey: string;
}

const UserTranslation = ({ verseKey }: UserTranslationProps) => {
  const { t } = useTranslation();
  const verseTrans = useAppSelector(selectTransNote(verseKey));
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);
  const [stateEditable, setStateEditable] = useState(false);
  const dispatch = useAppDispatch();

  const onClickAdd = () => {
    setStateEditable(true);
  };

  const handleInputChange = (key: string, value: string) => {
    dispatch(
      transNotesActions.changeTranslation({
        name: key,
        value: value,
      })
    );
  };

  const onClickSave = () => {
    setStateEditable(false);

    dbFuncs
      .saveTranslation(verseKey, verseTrans)
      .then(() => {
        toast.success(t("save_success"));
      })
      .catch(() => {
        toast.error(t("save_failed"));
      });
  };

  return (
    <div className="py-2" dir="ltr">
      <div className="text-secondary">Your translation</div>
      {stateEditable ? (
        <>
          <TextAreaComponent
            inputKey={verseKey}
            inputValue={verseTrans}
            placeholder="Enter your text"
            handleInputChange={handleInputChange}
          />
          <button onClick={onClickSave} className="btn btn-success btn-sm">
            Save
          </button>
        </>
      ) : verseTrans ? (
        <div style={{ whiteSpace: "pre-wrap" }}>
          <div style={{ fontSize: `${notesFS}rem` }}>{verseTrans}</div>
          <button onClick={onClickAdd} className="btn btn-primary btn-sm mt-1">
            Edit
          </button>
        </div>
      ) : (
        <div>
          <div>Empty.</div>
          <button onClick={onClickAdd} className="btn btn-success btn-sm mt-1">
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTranslation;
