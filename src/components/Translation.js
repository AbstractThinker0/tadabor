import { useState, useEffect, useCallback, memo } from "react";
import useQuran from "../context/QuranContext";

import { loadData, saveData } from "../util/db";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "./LoadingSpinner";

const Translation = () => {
  const [selectChapter, setSelectChapter] = useState(1);

  const onSelectChange = (event) => {
    setSelectChapter(event.target.value);
  };

  return (
    <div className="row m-auto p-0" style={{ height: "90%" }}>
      <SelectionListChapters
        onSelectChange={onSelectChange}
        selectChapter={selectChapter}
      />
      <DisplayPanel selectChapter={selectChapter} />
    </div>
  );
};

const SelectionListChapters = ({ onSelectChange, selectChapter }) => {
  const { t } = useTranslation();
  const { chapterNames } = useQuran();

  return (
    <div className="col-sm-3 border-start justify-content-center">
      <div className="container mt-2 w-75">
        <h4 className="text-info">{t("roots_list")}</h4>
        <select
          className="form-select"
          size="7"
          aria-label="size 7 select"
          onChange={onSelectChange}
          value={selectChapter}
        >
          {chapterNames.map((chapter, index) => (
            <option key={chapter.id} value={chapter.id}>
              {index + 1}. {chapter.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const DisplayPanel = ({ selectChapter }) => {
  const { allQuranText, chapterNames } = useQuran();
  const { t } = useTranslation();
  const [loadingState, setLoadingState] = useState(true);
  const [versesTranslation, setVersesTranslation] = useState({});
  const [editableTranslations, setEditableTranslations] = useState({});

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userTranslations = await loadData("translations");

      if (clientLeft) return;

      let extractTranslations = {};
      let markedTranslations = {};
      userTranslations.forEach((trans) => {
        extractTranslations[trans.id] = trans.text;
        markedTranslations[trans.id] = false;
      });

      setVersesTranslation(extractTranslations);
      setEditableTranslations(markedTranslations);

      setLoadingState(false);
    }

    return () => {
      clientLeft = true;
    };
  }, []);

  const displayVerses = allQuranText[selectChapter - 1].verses;

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setVersesTranslation((state) => {
      return { ...state, [name]: value };
    });
  };

  const memoHandleInputChange = useCallback(handleInputChange, []);

  const handleEditClick = (event) => {
    let inputKey = event.target.name;
    setEditableTranslations((state) => {
      return { ...state, [inputKey]: true };
    });
  };

  const memoHandleEditClick = useCallback(handleEditClick, []);

  function handleInputSubmit(event, inputValue) {
    let note_key = event.target.name;

    setEditableTranslations((state) => {
      return { ...state, [note_key]: false };
    });

    saveData("translations", {
      id: note_key,
      text: inputValue,
      date_created: Date.now(),
      date_modified: Date.now(),
    })
      .then(function (result) {
        toast.success(t("save_success"));
      })
      .catch(function (error) {
        toast.success(t("save_failed"));
      });
  }

  const memoHandleInputSubmit = useCallback(handleInputSubmit, [t]);

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="col h-100 p-0">
      <div
        className="container justify-content-center py-2 h-100"
        style={{ overflowY: "scroll" }}
      >
        <div className="card">
          <div className="card-header">
            <h2 className="pb-2 text-primary text-center">
              {chapterNames[selectChapter - 1].name}
            </h2>
          </div>
          <div className="card-body p-1">
            {displayVerses.map((verse) => {
              return (
                <VerseComponent
                  key={verse.key}
                  isEditable={editableTranslations[verse.key]}
                  verse_key={verse.key}
                  verse_text={verse.versetext}
                  verse_id={verse.verseid}
                  verse_trans={versesTranslation[verse.key]}
                  handleEditClick={memoHandleEditClick}
                  handleInputChange={memoHandleInputChange}
                  handleInputSubmit={memoHandleInputSubmit}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const VerseComponent = memo(
  ({
    isEditable,
    verse_key,
    verse_text,
    verse_id,
    verse_trans,
    handleEditClick,
    handleInputChange,
    handleInputSubmit,
  }) => {
    return (
      <>
        <p className="fs-4 mb-0" dir="rtl">
          {verse_text} ({verse_id})
        </p>
        {isEditable === false ? (
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
  }
);

const Versetext = ({ inputValue, inputKey, handleEditClick }) => {
  const { t } = useTranslation();

  return (
    <div className="p-2">
      <div className="border p-1">
        <p dir="ltr">{inputValue}</p>
      </div>
      <div className="text-center">
        <button
          name={inputKey}
          onClick={handleEditClick}
          className="mt-2 btn btn-primary btn-sm"
        >
          {t("text_edit")}
        </button>
      </div>
    </div>
  );
};

const Versearea = ({
  inputValue,
  inputKey,
  handleInputChange,
  handleInputSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-2" dir="ltr">
      <textarea
        className="form-control"
        id="textInput"
        name={inputKey}
        value={inputValue}
        onChange={handleInputChange}
      />
      <div className="text-center">
        <button
          name={inputKey}
          onClick={(event) => handleInputSubmit(event, inputValue)}
          className="mt-2 btn btn-primary btn-sm"
        >
          {t("text_save")}
        </button>
      </div>
    </div>
  );
};

export default Translation;
