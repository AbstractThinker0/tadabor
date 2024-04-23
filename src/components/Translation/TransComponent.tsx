import { memo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector, selectTransNote } from "@/store";
import { transNotesActions } from "@/store/slices/transNotes";
import { dbFuncs } from "@/util/db";

import { TextAreaComponent } from "@/components/Custom/TextForm";

interface TransComponentProps {
  verse_key: string;
}

const TransComponent = memo(({ verse_key }: TransComponentProps) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const verse_trans = useAppSelector(selectTransNote(verse_key));

  const [stateEditable, setStateEditable] = useState(
    verse_trans ? false : true
  );

  const handleEditClick = useCallback(() => {
    setStateEditable(true);
  }, []);

  const handleInputSubmit = useCallback(
    (inputKey: string, inputValue: string) => {
      setStateEditable(false);

      dbFuncs
        .saveTranslation(inputKey, inputValue)
        .then(function () {
          toast.success(t("save_success"));
        })
        .catch(function () {
          toast.error(t("save_failed"));
        });
    },
    [t]
  );

  const handleInputChange = useCallback(
    (key: string, value: string) => {
      dispatch(
        transNotesActions.changeTranslation({
          name: key,
          value: value,
        })
      );
    },
    [dispatch]
  );

  return (
    <>
      {stateEditable === false ? (
        <Versetext
          inputKey={verse_key}
          inputValue={verse_trans}
          handleEditClick={handleEditClick}
        />
      ) : (
        <Versearea
          inputKey={verse_key}
          inputValue={verse_trans}
          handleInputChange={handleInputChange}
          handleInputSubmit={handleInputSubmit}
        />
      )}
    </>
  );
});

interface VersetextProps {
  inputValue: string;
  inputKey: string;
  handleEditClick: () => void;
}

const Versetext = ({
  inputValue,
  inputKey,
  handleEditClick,
}: VersetextProps) => {
  const { t } = useTranslation();
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  function onClickEdit() {
    handleEditClick();
  }

  return (
    <div className="p-2">
      <div className="border p-1 translation-display-card-trans-text">
        <p
          style={{ whiteSpace: "pre-wrap", fontSize: `${notesFS}rem` }}
          dir="ltr"
        >
          {inputValue}
        </p>
      </div>
      <div className="text-center">
        <button
          name={inputKey}
          onClick={onClickEdit}
          className="mt-2 btn btn-primary btn-sm"
        >
          {t("text_edit")}
        </button>
      </div>
    </div>
  );
};

interface VerseareaProps {
  inputKey: string;
  inputValue: string;
  handleInputChange: (key: string, value: string) => void;
  handleInputSubmit: (inputKey: string, inputValue: string) => void;
}

const Versearea = ({
  inputValue,
  inputKey,
  handleInputChange,
  handleInputSubmit,
}: VerseareaProps) => {
  const { t } = useTranslation();

  function onClickSave() {
    handleInputSubmit(inputKey, inputValue);
  }

  return (
    <div className="p-2" dir="ltr">
      <TextAreaComponent
        inputKey={inputKey}
        inputValue={inputValue}
        placeholder="Enter your text."
        handleInputChange={handleInputChange}
      />
      <div className="text-center">
        <button
          name={inputKey}
          onClick={onClickSave}
          className="mt-2 btn btn-success btn-sm"
        >
          {t("text_save")}
        </button>
      </div>
    </div>
  );
};

export default TransComponent;
