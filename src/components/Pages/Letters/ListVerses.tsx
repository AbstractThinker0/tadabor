import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useTransition,
  memo,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useQuran from "@/context/useQuran";

import { useAppSelector, useAppDispatch } from "@/store";
import {
  fetchLettersData,
  lettersPageActions,
} from "@/store/slices/pages/letters";

import { LetterDataType, RankedVerseProps } from "@/types";
import { LetterRole } from "@/util/consts";
import {
  normalizeAlif,
  removeDiacritics,
  splitArabicLetters,
} from "@/util/util";
import { dbFuncs } from "@/util/db";

import VerseContainer from "@/components/Custom/VerseContainer";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { CollapseContent } from "@/components/Generic/Collapse";
import { Collapse } from "bootstrap";

const ListVerses = () => {
  const quranService = useQuran();

  const dispatch = useAppDispatch();

  const currentChapter = useAppSelector(
    (state) => state.lettersPage.currentChapter
  );
  const dataLoading = useAppSelector((state) => state.lettersPage.dataLoading);

  const [stateVerses, setStateVerses] = useState<RankedVerseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    dispatch(fetchLettersData());
  }, []);

  useEffect(() => {
    //
    const chapterVerses: RankedVerseProps[] = [];

    quranService.absoluteQuran.forEach((verse, index) => {
      if (verse.suraid !== currentChapter.toString()) return;

      chapterVerses.push({ ...verse, rank: index });
    });

    startTransition(() => {
      setStateVerses(chapterVerses);
    });
  }, [currentChapter]);

  return (
    <div className="card-body" dir="rtl">
      {isPending || dataLoading ? (
        <LoadingSpinner />
      ) : (
        stateVerses.map((verse) => <VerseItem key={verse.key} verse={verse} />)
      )}
    </div>
  );
};

interface VerseItemProps {
  verse: RankedVerseProps;
}

const VerseItem = memo(({ verse }: VerseItemProps) => {
  const refCollapsibleLetterBox = useRef<HTMLDivElement>(null);
  const refCollapseLetterBox = useRef<Collapse>();

  const refCollapsibleWordBox = useRef<HTMLDivElement>(null);
  const refCollapseWordBox = useRef<Collapse>();

  const scrollKey = useAppSelector((state) => state.lettersPage.scrollKey);

  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedWord, setSelectedWord] = useState("");

  const verseLetterData = useAppSelector(
    (state) => state.lettersPage.lettersData[verse.key]?.[selectedLetter]
  ) ?? {
    letter_key: selectedLetter,
    letter_role: LetterRole.Unit,
    def_id: "",
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (refCollapsibleLetterBox.current) {
      refCollapseLetterBox.current = new Collapse(
        refCollapsibleLetterBox.current,
        {
          toggle: false,
        }
      );
    }

    if (refCollapsibleWordBox.current) {
      refCollapseWordBox.current = new Collapse(refCollapsibleWordBox.current, {
        toggle: false,
      });
    }
  }, []);

  const handleClickLetter = (letterKey: string) => {
    if (refCollapseLetterBox.current) {
      if (selectedLetter === letterKey) {
        refCollapseLetterBox.current.hide();
      } else {
        refCollapseLetterBox.current.show();
      }
    }

    setSelectedLetter(selectedLetter === letterKey ? "" : letterKey);
  };

  const handleClickWord = (wordKey: string) => {
    if (refCollapseWordBox.current) {
      if (selectedWord === wordKey) {
        refCollapseWordBox.current.hide();
      } else {
        refCollapseWordBox.current.show();
      }
    }

    setSelectedWord(selectedWord === wordKey ? "" : wordKey);
  };

  const onClickVerseID = (verseKey: string) => {
    dispatch(lettersPageActions.setScrollKey(verseKey));
  };

  return (
    <div
      className={`display-verses-item${
        scrollKey === verse.key ? " display-verses-item-selected" : ""
      }`}
      data-id={verse.key}
    >
      <VerseContainer>
        <VerseWords
          verseText={verse.versetext.split(" ")}
          verseKey={verse.key}
          selectedLetter={selectedLetter}
          selectedWord={selectedWord}
          handleClickLetter={handleClickLetter}
          handleClickWord={handleClickWord}
        />
        <span
          className="display-verses-item-verseid"
          onClick={() => onClickVerseID(verse.key)}
        >
          ({verse.verseid})
        </span>
      </VerseContainer>
      <WordBox
        refCollapse={refCollapsibleWordBox}
        verseKey={verse.key}
        verseText={verse.versetext}
        selectedWord={selectedWord}
      ></WordBox>
      <LetterBox
        refCollapse={refCollapsibleLetterBox}
        verseKey={verse.key}
        selectedLetter={selectedLetter}
        verseLetterData={verseLetterData}
      />
    </div>
  );
});

VerseItem.displayName = "VerseItem";

interface LetterBoxProps {
  refCollapse?: React.RefObject<HTMLDivElement>;
  verseKey: string;
  selectedLetter: string;
  verseLetterData: LetterDataType;
}

const LetterBox = ({
  refCollapse,
  verseKey,
  selectedLetter,
  verseLetterData,
}: LetterBoxProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const quranService = useQuran();

  const lettersDefinitions = useAppSelector(
    (state) => state.lettersPage.lettersDefinitions
  );

  const letterPresets = useAppSelector(
    (state) => state.lettersPage.letterPresets
  );

  const [letterRole, setLetterRole] = useState<LetterRole>(
    verseLetterData.letter_role
  );

  const [letterDefinitionID, setLetterDefinitionID] = useState(
    verseLetterData.def_id
  );

  const onChangeSelectRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLetterRole(Number(event.target.value));
  };

  const onChangeSelectDef = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLetterDefinitionID(event.target.value);
  };

  const onClickSave = () => {
    dbFuncs
      .saveLetterData({
        letter_key: `${verseKey}:${selectedLetter}`,
        letter_role: letterRole,
        def_id: letterDefinitionID,
      })
      .then(() => {
        toast.success(t("save_success"));
      })
      .catch(() => {
        toast.error(t("save_failed"));
      });

    dispatch(
      lettersPageActions.setLetterData({
        letter: `${verseKey}:${selectedLetter}`,
        role: letterRole,
        def_id: letterDefinitionID,
      })
    );
  };

  useEffect(() => {
    setLetterRole(verseLetterData.letter_role);
  }, [selectedLetter, verseLetterData.letter_role]);

  useEffect(() => {
    setLetterDefinitionID(verseLetterData.def_id);
  }, [selectedLetter, verseLetterData.def_id]);

  const renderLetterDefinitionOptions = () => {
    const letter = selectedLetter
      ? quranService.getLetterByKey(verseKey, selectedLetter)
      : "";

    const normalizedLetter = normalizeAlif(letter, false, true);

    const letterDefinition = lettersDefinitions[normalizedLetter];

    return (
      <>
        {letterDefinition ? (
          <option value="-1">{letterDefinition.definition}</option>
        ) : (
          <></>
        )}
        <>
          {Object.keys(letterPresets).map((presetID) => {
            const defKey = `${normalizedLetter}:${presetID}`;

            const letterDef = lettersDefinitions[defKey];
            return (
              <Fragment key={defKey}>
                {letterDef ? (
                  <option value={defKey}>{letterDef.definition}</option>
                ) : (
                  <></>
                )}
              </Fragment>
            );
          })}
        </>
      </>
    );
  };

  return (
    <CollapseContent
      refCollapse={refCollapse}
      identifier={`collapseExample${verseKey}`}
      extraClass="display-verses-item-collapse"
    >
      <div className="card card-body" dir="ltr">
        <div className="display-verses-item-letterbox">
          <div className="d-flex">
            <label htmlFor="typeSelect" className="form-label">
              Type:
            </label>
            <select
              id="typeSelect"
              className="form-select"
              aria-label="Select"
              value={letterRole}
              onChange={onChangeSelectRole}
            >
              <option value={LetterRole.Unit}>Unit</option>
              <option value={LetterRole.Suffix}>Suffix</option>
              <option value={LetterRole.Ignored}>Unused</option>
            </select>
          </div>
          <div className="d-flex">
            <label htmlFor="defSelect" className="form-label">
              Definition:
            </label>
            <select
              id="defSelect"
              className="form-select"
              aria-label="Select"
              value={letterDefinitionID}
              onChange={onChangeSelectDef}
            >
              <option value="">None</option>
              {renderLetterDefinitionOptions()}
            </select>
          </div>
          <button
            className="btn btn-primary display-verses-item-box-btn"
            onClick={onClickSave}
          >
            Save
          </button>
        </div>
      </div>
    </CollapseContent>
  );
};

LetterBox.displayName = "LetterBox";

interface VerseWordsProps {
  verseText: string[];
  verseKey: string;
  selectedLetter: string;
  selectedWord: string;
  handleClickLetter: (letterKey: string) => void;
  handleClickWord: (wordKey: string) => void;
}

const VerseWords = ({
  verseText,
  verseKey,
  selectedLetter,
  selectedWord,
  handleClickLetter,
  handleClickWord,
}: VerseWordsProps) => {
  return (
    <>
      {verseText.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          <span
            className={`display-verses-item-word${
              `${verseKey}:${wordIndex}` === selectedWord
                ? " display-verses-item-word-selected"
                : ""
            }`}
            onClick={() => handleClickWord(`${verseKey}:${wordIndex}`)}
          >
            {splitArabicLetters(word).map((letter, letterIndex) => (
              <SingleLetter
                key={letterIndex}
                letter={letter}
                letterKey={`${wordIndex}-${letterIndex}`}
                selectedLetter={selectedLetter}
                handleClickLetter={handleClickLetter}
              />
            ))}
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
};

interface SingleLetterProps {
  letter: string;
  letterKey: string;
  selectedLetter: string;
  handleClickLetter: (letterKey: string) => void;
}

const SingleLetter = ({
  letter,
  letterKey,
  selectedLetter,
  handleClickLetter,
}: SingleLetterProps) => {
  const onClickLetter = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    handleClickLetter(letterKey);
  };

  return (
    <span
      className={`display-verses-item-letter${
        letterKey === selectedLetter
          ? " display-verses-item-letter-selected"
          : ""
      }`}
      onClick={onClickLetter}
    >
      {letter}
    </span>
  );
};

interface WordBoxProps {
  refCollapse?: React.RefObject<HTMLDivElement>;
  verseKey: string;
  verseText: string;
  selectedWord: string;
}

const WordBox = ({
  refCollapse,
  verseKey,
  verseText,
  selectedWord,
}: WordBoxProps) => {
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const verseLettersData =
    useAppSelector((state) => state.lettersPage.lettersData[verseKey]) || {};

  const lettersDefinitions = useAppSelector(
    (state) => state.lettersPage.lettersDefinitions
  );

  const wordIndex = Number(selectedWord.split(":")[1]);

  const getLetter = (
    letter: string,
    wordIndex: number,
    letterIndex: number
  ) => {
    const letterKey = `${wordIndex}-${letterIndex}`;

    const currentLetter = removeDiacritics(letter);

    const letterDef = Object.keys(lettersDefinitions).find(
      (key) =>
        lettersDefinitions[key].preset_id &&
        verseLettersData[letterKey]?.def_id &&
        normalizeAlif(lettersDefinitions[key].name) ===
          normalizeAlif(currentLetter) &&
        (lettersDefinitions[key].preset_id ===
          verseLettersData[letterKey].def_id ||
          `${normalizeAlif(currentLetter, false, true)}:${
            lettersDefinitions[key].preset_id
          }` === verseLettersData[letterKey].def_id)
    );

    const letterRole =
      verseLettersData[letterKey]?.letter_role || LetterRole.Unit;

    if (letterRole !== LetterRole.Unit) {
      return null;
    }

    const isDef = !!(letterDef && lettersDefinitions[letterDef]);

    return {
      isDef,
      definition: isDef ? lettersDefinitions[letterDef].definition : letter,
    };
  };

  const renderWord = (word: string, index: number) => {
    type DataType = { isDef: boolean; definition: string }[];

    const data: DataType = [];
    splitArabicLetters(word).forEach((letter, letterIndex) => {
      const currData = getLetter(letter, index, letterIndex);
      if (currData) data.push(currData);
    });

    return (
      <Fragment key={index}>
        <span
          className={`display-verses-item-wordbox-item${
            index === wordIndex
              ? " display-verses-item-wordbox-item-selected"
              : ""
          }`}
        >
          {data.map((def, index) => (
            <span key={index}>
              {index > 0 && def.isDef ? " " : ""}
              {def.definition}
              {data.length - 1 !== index && def.isDef ? " " : ""}
            </span>
          ))}
        </span>{" "}
      </Fragment>
    );
  };

  return (
    <CollapseContent
      refCollapse={refCollapse}
      identifier={`collapseWordBox${verseKey}`}
      extraClass=""
    >
      <div className="card card-body" dir="rtl">
        <span
          className="display-verses-item-wordbox"
          style={{ fontSize: `${notesFS}rem` }}
        >
          {verseText.split(" ").map((word, index) => renderWord(word, index))}
        </span>
      </div>
    </CollapseContent>
  );
};

WordBox.displayName = "WordBox";

export default ListVerses;
