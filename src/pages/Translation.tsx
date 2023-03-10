import React, { useState, useEffect, useCallback, memo } from "react";
import useQuran from "../context/QuranContext";

import { loadData, saveData } from "../util/db";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../components/LoadingSpinner";

const Translation = () => {
  const [selectChapter, setSelectChapter] = useState(1);

  const handleChapterChange = (chapter: number) => {
    setSelectChapter(chapter);
  };

  return (
    <div className="translation">
      <SelectionListChapters
        handleChapterChange={handleChapterChange}
        selectChapter={selectChapter}
      />
      <DisplayPanel selectChapter={selectChapter} />
    </div>
  );
};

interface SelectionListChaptersProps {
  handleChapterChange: (chapter: number) => void;
  selectChapter: number;
}

const SelectionListChapters = ({
  handleChapterChange,
  selectChapter,
}: SelectionListChaptersProps) => {
  const { t } = useTranslation();
  const { chapterNames } = useQuran();
  const [chapterSearch, setChapterSearch] = useState("");

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChapterSearch(event.target.value);
  };

  function onFocusSelect(event: React.FocusEvent<HTMLSelectElement, Element>) {
    handleChapterChange(Number(event.target.value));
  }

  function onChangeSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    handleChapterChange(Number(event.target.value));
  }

  return (
    <div className="col-sm-3 border-start justify-content-center">
      <div className="container mt-2 w-75">
        <h4 className="text-info">{t("roots_list")}</h4>
        <input
          className="form-control"
          type="search"
          value={chapterSearch}
          onChange={onChangeInput}
          placeholder=""
          aria-label="Search"
          dir="rtl"
        />
        <select
          className="form-select"
          size={7}
          aria-label="size 7 select"
          onChange={onChangeSelect}
          onFocus={onFocusSelect}
          value={selectChapter}
        >
          {chapterNames
            .filter((chapter) => chapter.name.startsWith(chapterSearch))
            .map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.id}. {chapter.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

interface DisplayPanelProps {
  selectChapter: number;
}

const DisplayPanel = ({ selectChapter }: DisplayPanelProps) => {
  const { allQuranText, chapterNames } = useQuran();
  const { t } = useTranslation();
  const [loadingState, setLoadingState] = useState(true);
  const [versesTranslation, setVersesTranslation] = useState<any>({});
  const [editableTranslations, setEditableTranslations] = useState<any>({});

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let userTranslations = await loadData("translations");

      if (clientLeft) return;

      let extractTranslations = {} as any;
      let markedTranslations = {} as any;
      userTranslations.forEach((trans: any) => {
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

  const handleInputChange = (inputKey: string, value: string) => {
    setVersesTranslation((state: any) => {
      return { ...state, [inputKey]: value };
    });
  };

  const memoHandleInputChange = useCallback(handleInputChange, []);

  const handleEditClick = (inputKey: string) => {
    setEditableTranslations((state: any) => {
      return { ...state, [inputKey]: true };
    });
  };

  const memoHandleEditClick = useCallback(handleEditClick, []);

  function handleInputSubmit(inputKey: string, inputValue: string) {
    setEditableTranslations((state: any) => {
      return { ...state, [inputKey]: false };
    });

    saveData("translations", {
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
  }

  const memoHandleInputSubmit = useCallback(handleInputSubmit, [t]);

  if (loadingState) return <LoadingSpinner />;

  return (
    <div className="translation-display">
      <div className="card translation-display-card">
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
  }: any) => {
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

const Versetext = ({ inputValue, inputKey, handleEditClick }: any) => {
  const { t } = useTranslation();

  function onClickEdit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    handleEditClick(inputKey);
  }

  return (
    <div className="p-2">
      <div className="border p-1">
        <p dir="ltr">{inputValue}</p>
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

const Versearea = ({
  inputValue,
  inputKey,
  handleInputChange,
  handleInputSubmit,
}: any) => {
  const { t } = useTranslation();

  function onChangeTextarea(event: React.ChangeEvent<HTMLTextAreaElement>) {
    handleInputChange(inputKey, event.target.value);
  }

  function onClickSave(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    handleInputSubmit(inputKey, inputValue);
  }

  return (
    <div className="p-2" dir="ltr">
      <textarea
        className="form-control"
        id="textInput"
        name={inputKey}
        value={inputValue}
        onChange={onChangeTextarea}
        required
      />
      <div className="text-center">
        <button
          name={inputKey}
          onClick={onClickSave}
          className="mt-2 btn btn-primary btn-sm"
        >
          {t("text_save")}
        </button>
      </div>
    </div>
  );
};

export default Translation;
