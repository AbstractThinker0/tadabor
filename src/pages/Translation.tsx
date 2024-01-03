import {
  useState,
  useCallback,
  memo,
  Fragment,
  useRef,
  useEffect,
  useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import useQuran from "@/context/QuranContext";
import { dbFuncs } from "@/util/db";
import { selectTranslation, useAppDispatch, useAppSelector } from "@/store";
import { transNotesActions } from "@/store/slices/transNotes";
import { verseProps } from "@/types";

import { TextAreaComponent } from "@/components/TextForm";
import LoadingSpinner from "@/components/LoadingSpinner";

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
  const quranService = useQuran();
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
    <div className="side border-start justify-content-center">
      <div className="side-chapters container mt-2">
        <h4 className="side-chapters-title">{t("roots_list")}</h4>
        <input
          className="side-chapters-input form-control"
          type="search"
          value={chapterSearch}
          onChange={onChangeInput}
          placeholder={quranService.getChapterName(selectChapter)}
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
          {quranService.chapterNames
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
  const quranService = useQuran();
  const refDisplay = useRef<HTMLDivElement>(null);

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!refDisplay.current) return;

    startTransition(() => {
      setStateVerses(quranService.getVerses(selectChapter));
    });

    refDisplay.current.scrollTop = 0;
  }, [selectChapter]);

  return (
    <div ref={refDisplay} className="translation-display">
      <div className="card translation-display-card">
        <div className="card-header">
          <h2 className="pb-2 text-primary text-center">
            {quranService.getChapterName(selectChapter)}
          </h2>
        </div>
        <div className="card-body p-1">
          {isPending ? (
            <LoadingSpinner />
          ) : (
            stateVerses.map((verse) => {
              return (
                <Fragment key={verse.key}>
                  <p className="fs-3 mb-0" dir="rtl">
                    {verse.versetext} ({verse.verseid})
                  </p>
                  <TransComponent verse_key={verse.key} />
                </Fragment>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

interface TransComponentProps {
  verse_key: string;
}

const TransComponent = memo(({ verse_key }: TransComponentProps) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const verse_trans = useAppSelector(selectTranslation(verse_key));

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

export default Translation;
