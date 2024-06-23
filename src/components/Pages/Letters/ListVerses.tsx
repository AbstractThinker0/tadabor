import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useTransition,
  memo,
} from "react";

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

  const letterData = useAppSelector(
    (state) => state.lettersPage.lettersData[selectedLetter]
  ) ?? {
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
        letterData={letterData}
      />
    </div>
  );
});

VerseItem.displayName = "VerseItem";

interface LetterBoxProps {
  refCollapse?: React.RefObject<HTMLDivElement>;
  verseKey: string;
  selectedLetter: string;
  letterData: LetterDataType;
}

const LetterBox = ({
  refCollapse,
  verseKey,
  selectedLetter,
  letterData,
}: LetterBoxProps) => {
  const dispatch = useAppDispatch();

  const quranService = useQuran();

  const lettersDefinitions = useAppSelector(
    (state) => state.lettersPage.lettersDefinitions
  );

  const [letterRole, setLetterRole] = useState<LetterRole>(
    letterData.letter_role
  );

  const [letterDefinitionID, setLetterDefinitionID] = useState(
    letterData.def_id
  );

  const onChangeSelectRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLetterRole(Number(event.target.value));
  };

  const onChangeSelectDef = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLetterDefinitionID(event.target.value);
  };

  const onClickSave = () => {
    dbFuncs.saveLetterData({
      letter_key: selectedLetter,
      letter_role: letterRole,
      def_id: letterDefinitionID,
    });

    dispatch(
      lettersPageActions.setLetterData({
        letter: selectedLetter,
        role: letterRole,
        def_id: letterDefinitionID,
      })
    );
  };

  useEffect(() => {
    setLetterRole(letterData.letter_role);
  }, [selectedLetter, letterData.letter_role]);

  useEffect(() => {
    setLetterDefinitionID(letterData.def_id);
  }, [selectedLetter, letterData.def_id]);

  const renderLetterDefinitionOptions = () => {
    const letter = selectedLetter
      ? quranService.getLetterByKey(selectedLetter)
      : "";
    const definition =
      lettersDefinitions[normalizeAlif(letter, false, true)]?.definition;

    return definition ? <option value="-1">{definition}</option> : <></>;
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
                letterKey={`${verseKey}:${wordIndex}-${letterIndex}`}
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

  const lettersData = useAppSelector((state) => state.lettersPage.lettersData);
  const lettersDefinitions = useAppSelector(
    (state) => state.lettersPage.lettersDefinitions
  );

  const wordIndex = Number(selectedWord.split(":")[1]);

  const renderLetter = (
    letter: string,
    verseKey: string,
    wordIndex: number,
    letterIndex: number
  ) => {
    const letterKey = `${verseKey}:${wordIndex}-${letterIndex}`;
    const currentLetter = removeDiacritics(letter);
    const letterDef = Object.keys(lettersDefinitions).find(
      (key) =>
        normalizeAlif(key) === normalizeAlif(currentLetter) &&
        lettersDefinitions[key].preset_id &&
        lettersData[letterKey]?.def_id &&
        lettersDefinitions[key].preset_id === lettersData[letterKey].def_id
    );
    const letterRole = lettersData[letterKey]?.letter_role || LetterRole.Unit;

    if (letterRole !== LetterRole.Unit) {
      return null;
    }

    return (
      <span key={letterIndex}>
        {letterDef && lettersDefinitions[letterDef]
          ? lettersDefinitions[letterDef].definition
          : letter}
      </span>
    );
  };

  const renderWord = (word: string, index: number) => (
    <Fragment key={index}>
      <span
        className={`display-verses-item-wordbox-item${
          index === wordIndex
            ? " display-verses-item-wordbox-item-selected"
            : ""
        }`}
      >
        {splitArabicLetters(word).map((letter, letterIndex) =>
          renderLetter(letter, verseKey, index, letterIndex)
        )}
      </span>{" "}
    </Fragment>
  );

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
