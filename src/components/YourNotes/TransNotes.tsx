import { useTranslation } from "react-i18next";

import {
  useAppDispatch,
  useAppSelector,
  selectTransNote,
  getAllTransNotesKeys,
} from "@/store";
import useQuran from "@/context/useQuran";
import { memo, useCallback, useState } from "react";
import { dbFuncs } from "@/util/db";
import { toast } from "react-toastify";
import { transNotesActions } from "@/store/slices/transNotes";
import { TextAreaComponent } from "@/components/TextForm";

const TransNotes = () => {
  const notesKeys = useAppSelector(getAllTransNotesKeys);
  const { t } = useTranslation();

  return (
    <>
      {notesKeys.length ? (
        <>
          {notesKeys.map((key) => (
            <NoteComponent verseKey={key} key={key} />
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
  verseKey: string;
}

const NoteComponent = ({ verseKey }: NoteComponentProps) => {
  const quranService = useQuran();

  return (
    <div className="card mb-3">
      <div className="card-header fs-3" dir="rtl">
        ({quranService.convertKeyToSuffix(verseKey)}) <br />{" "}
        {quranService.getVerseTextByKey(verseKey)}{" "}
      </div>
      <TransComponent verse_key={verseKey} />
    </div>
  );
};

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
        .saveTranslation({
          id: inputKey,
          text: inputValue,
          date_created: Date.now(),
          date_modified: Date.now(),
        })
        .then(function () {
          toast.success(t("save_success") as string);
        })
        .catch(function () {
          toast.success(t("save_failed") as string);
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

  function onClickEdit() {
    handleEditClick();
  }

  return (
    <div className="p-2">
      <div className="border p-1 translation-display-card-trans-text">
        <p style={{ whiteSpace: "pre-wrap" }} dir="ltr">
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

export default TransNotes;
