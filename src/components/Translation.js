import { Fragment, useState, useEffect } from "react";
import useQuran from "../context/QuranContext";

import { db } from "../util/db";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "./LoadingSpinner";

const Translation = () => {
  const { allQuranText, chapterNames } = useQuran();
  const { t } = useTranslation();
  const [loadingState, setLoadingState] = useState(true);
  const [versesTranslation, setVersesTranslation] = useState({});
  const [editableTranslations, setEditableTranslations] = useState({});
  const [selectChapter, setSelectChapter] = useState(1);
  const [displayVerses, setDisplayVerses] = useState(
    allQuranText[selectChapter - 1].verses
  );

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userTranslations = await db.translations.toArray();

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

  const onSelectChange = (event) => {
    setSelectChapter(event.target.value);
    setDisplayVerses(allQuranText[event.target.value - 1].verses);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setVersesTranslation((state) => {
      return { ...state, [name]: value };
    });
  };

  const handleEditClick = (event) => {
    let inputKey = event.target.name;
    setEditableTranslations((state) => {
      return { ...state, [inputKey]: true };
    });
  };

  function handleInputSubmit(event, inputValue) {
    let note_key = event.target.name;
    db.translations
      .put({
        id: note_key,
        text: inputValue,
        date_created: Date.now(),
        date_modified: Date.now(),
      })
      .then(function (result) {
        //
        toast.success(t("save_success"));
        setEditableTranslations((state) => {
          return { ...state, [note_key]: false };
        });
      })
      .catch(function (error) {
        //
        toast.success(t("save_failed"));
      });
  }

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="row m-auto p-0" style={{ height: "90%" }}>
      <div className="col-sm-3 border-start justify-content-center">
        <div className="container mt-2 w-75">
          <h4 className="text-info">قائمة السور:</h4>
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
                  <Fragment key={verse.key}>
                    <p className="fs-4 mb-0" dir="rtl">
                      {verse.versetext} ({verse.verseid})
                    </p>
                    {editableTranslations[verse.key] === false ? (
                      <Versetext
                        inputKey={verse.key}
                        inputValue={versesTranslation[verse.key]}
                        handleEditClick={handleEditClick}
                      />
                    ) : (
                      <Versearea
                        inputKey={verse.key}
                        inputValue={versesTranslation[verse.key]}
                        handleInputChange={handleInputChange}
                        handleInputSubmit={handleInputSubmit}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
