import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextAreaComponent } from "../TextForm";

import { selectTranslation, useAppDispatch, useAppSelector } from "../../store";
import { translationsActions } from "../../store/translationsReducer";
import { dbFuncs } from "../../util/db";
import { toast } from "react-toastify";

interface UserTranslationProps {
  verseKey: string;
}

const UserTranslation = ({ verseKey }: UserTranslationProps) => {
  const { t } = useTranslation();
  const verseTrans = useAppSelector(selectTranslation(verseKey));
  const [stateEditable, setStateEditable] = useState(false);
  const dispatch = useAppDispatch();

  const onClickAdd = () => {
    setStateEditable(true);
  };

  const handleInputChange = (key: string, value: string) => {
    dispatch(
      translationsActions.changeTranslation({
        name: key,
        value: value,
      })
    );
  };

  const onClickSave = () => {
    setStateEditable(false);

    dbFuncs
      .saveTranslation({
        id: verseKey,
        text: verseTrans,
        date_created: Date.now(),
        date_modified: Date.now(),
      })
      .then(function () {
        toast.success(t("save_success") as string);
      })
      .catch(function () {
        toast.success(t("save_failed") as string);
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
      ) : (
        <div style={{ whiteSpace: "pre-wrap" }}>
          {verseTrans ? (
            <>
              <div>{verseTrans}</div>
              <button
                onClick={onClickAdd}
                className="btn btn-primary btn-sm mt-1"
              >
                Edit
              </button>
            </>
          ) : (
            <>
              <div>Empty.</div>
              <button
                onClick={onClickAdd}
                className="btn btn-success btn-sm mt-1"
              >
                Add
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserTranslation;
