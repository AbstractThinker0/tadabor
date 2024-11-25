import { Fragment, useEffect, useState, useTransition, memo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useQuran from "@/context/useQuran";

import { useAppSelector, useAppDispatch } from "@/store";
import {
  fetchLettersData,
  lettersPageActions,
} from "@/store/slices/pages/letters";

import { LetterDataType, verseProps } from "@/types";
import { LetterRole } from "@/util/consts";
import {
  normalizeAlif,
  removeDiacritics,
  splitArabicLetters,
} from "@/util/util";
import { dbFuncs } from "@/util/db";

import VerseContainer from "@/components/Custom/VerseContainer";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import {
  Box,
  Button,
  CardBody,
  Flex,
  Select,
  useBoolean,
  Collapse,
  Checkbox,
} from "@chakra-ui/react";
import { ButtonVerse } from "@/components/Generic/Buttons";

const ListVerses = () => {
  const quranService = useQuran();

  const dispatch = useAppDispatch();

  const currentChapter = useAppSelector(
    (state) => state.lettersPage.currentChapter
  );
  const dataLoading = useAppSelector((state) => state.lettersPage.dataLoading);

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    dispatch(fetchLettersData());
  }, []);

  useEffect(() => {
    startTransition(() => {
      setStateVerses(quranService.getVerses(currentChapter));
    });
  }, [currentChapter]);

  return (
    <CardBody pt={0} dir="rtl">
      {isPending || dataLoading ? (
        <LoadingSpinner />
      ) : (
        stateVerses.map((verse) => <VerseItem key={verse.key} verse={verse} />)
      )}
    </CardBody>
  );
};

interface VerseItemProps {
  verse: verseProps;
}

const VerseItem = memo(({ verse }: VerseItemProps) => {
  const scrollKey = useAppSelector((state) => state.lettersPage.scrollKey);

  return (
    <Box
      py={"9px"}
      borderBottom={"1.5px solid rgba(220, 220, 220, 0.893)"}
      bgColor={scrollKey === verse.key ? "beige" : undefined}
      data-id={verse.key}
    >
      <VerseWords verse={verse} />
    </Box>
  );
});

VerseItem.displayName = "VerseItem";

interface VerseWordsProps {
  verse: verseProps;
}

const VerseWords = ({ verse }: VerseWordsProps) => {
  const dispatch = useAppDispatch();

  const [isOpenWordBox, setOpenWordBox] = useBoolean();
  const [isSpace, setSpace] = useState(false);

  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedWord, setSelectedWord] = useState(-1);

  const verseLetterData = useAppSelector(
    (state) => state.lettersPage.lettersData[verse.key]?.[selectedLetter]
  ) ?? {
    letter_key: selectedLetter,
    letter_role: LetterRole.Unit,
    def_id: "",
  };

  const handleClickLetter = (letterKey: string) => {
    setOpenWordBox.on();

    if (letterKey) {
      const wordIndex = letterKey.split("-")[0];
      setSelectedWord(Number(wordIndex));
    }

    setSelectedLetter(selectedLetter === letterKey ? "" : letterKey);
  };

  const handleClickWord = (wordIndex: number) => {
    if (selectedWord === wordIndex) {
      setOpenWordBox.off();
    } else {
      setOpenWordBox.on();
    }

    setSelectedWord(selectedWord === wordIndex ? -1 : wordIndex);
    setSelectedLetter("");
  };

  const onClickVerseID = (verseKey: string) => {
    dispatch(lettersPageActions.setScrollKey(verseKey));
  };

  return (
    <>
      <VerseContainer>
        {verse.versetext.split(" ").map((word, wordIndex) => (
          <Fragment key={wordIndex}>
            <Box
              key={wordIndex}
              as="span"
              my={"1px"}
              me={isSpace === true ? "4px" : undefined}
              py={"5px"}
              px={"8px"}
              border={"none"}
              borderRadius={"5px"}
              cursor={"pointer"}
              aria-selected={wordIndex === selectedWord}
              _selected={{ bgColor: "rgb(159, 159, 205)" }}
              _hover={{ bgColor: "rgb(159, 159, 205)" }}
              onClick={() => handleClickWord(wordIndex)}
            >
              {splitArabicLetters(word).map((letter, letterIndex) => (
                <Fragment key={letterIndex}>
                  <SingleLetter
                    letter={letter}
                    letterKey={`${wordIndex}-${letterIndex}`}
                    selectedLetter={selectedLetter}
                    handleClickLetter={handleClickLetter}
                  />
                  {isSpace === true ? " " : ""}
                </Fragment>
              ))}
            </Box>{" "}
          </Fragment>
        ))}
        <ButtonVerse onClick={() => onClickVerseID(verse.key)}>
          ({verse.verseid})
        </ButtonVerse>
        <Flex ps={1} pt={2}>
          <Checkbox
            checked={isSpace}
            onChange={() => setSpace((prev) => !prev)}
          />
        </Flex>
      </VerseContainer>
      <InfoBox
        isOpen={isOpenWordBox}
        verseKey={verse.key}
        verseText={verse.versetext}
        selectedWord={selectedWord}
        selectedLetter={selectedLetter}
        verseLetterData={verseLetterData}
      />
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
    <Box
      as="span"
      bgColor={letterKey === selectedLetter ? "cornflowerblue" : undefined}
      _hover={{ bgColor: "cornflowerblue" }}
      onClick={onClickLetter}
    >
      {letter}
    </Box>
  );
};

interface InfoBoxProps {
  isOpen: boolean;
  verseKey: string;
  verseText: string;
  selectedWord: number;
  selectedLetter: string;
  verseLetterData: LetterDataType;
}

const InfoBox = ({
  isOpen,
  verseKey,
  verseText,
  selectedWord,
  selectedLetter,
  verseLetterData,
}: InfoBoxProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const quranService = useQuran();

  const letterPresets = useAppSelector(
    (state) => state.lettersPage.letterPresets
  );

  const [letterRole, setLetterRole] = useState<LetterRole>(
    verseLetterData.letter_role
  );

  const [letterDefinitionID, setLetterDefinitionID] = useState(
    verseLetterData.def_id
  );

  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const verseLettersData =
    useAppSelector((state) => state.lettersPage.lettersData[verseKey]) || {};

  const lettersDefinitions = useAppSelector(
    (state) => state.lettersPage.lettersDefinitions
  );

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
        <Box
          as="span"
          padding={"2px"}
          bgColor={index === selectedWord ? "rgb(159, 159, 205)" : undefined}
        >
          {data.map((def, index) => (
            <span key={index}>
              {index > 0 && def.isDef ? " " : ""}
              {def.definition}
              {data.length - 1 !== index && def.isDef ? " " : ""}
            </span>
          ))}
        </Box>{" "}
      </Fragment>
    );
  };

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
    <Collapse in={isOpen}>
      <Flex
        border={"1px solid rgba(0, 0, 0, .175)"}
        borderRadius={"0.375rem"}
        marginTop={"6px"}
        padding={2}
        bgColor={"white"}
        dir="rtl"
      >
        <span style={{ fontSize: `${notesFS}rem` }}>
          {verseText.split(" ").map((word, index) => renderWord(word, index))}
        </span>
      </Flex>
      <Collapse in={!!selectedLetter}>
        <Box
          marginTop={"6px"}
          border={"1px solid rgba(0, 0, 0, .175)"}
          borderRadius={"0.375rem"}
          padding={2}
          bgColor={"white"}
          dir="ltr"
        >
          <Flex flexDir={"column"} gap={"0.5rem"}>
            <Flex>
              <span>Type:</span>
              <Select
                aria-label="Select"
                value={letterRole}
                onChange={onChangeSelectRole}
              >
                <option value={LetterRole.Unit}>Unit</option>
                <option value={LetterRole.Suffix}>Suffix</option>
                <option value={LetterRole.Ignored}>Unused</option>
              </Select>
            </Flex>
            <Flex>
              <span>Definition:</span>
              <Select
                disabled={letterRole != LetterRole.Unit}
                aria-label="Select"
                value={letterDefinitionID}
                onChange={onChangeSelectDef}
              >
                <option value="">None</option>
                {renderLetterDefinitionOptions()}
              </Select>
            </Flex>
            <Button
              colorScheme="blue"
              alignSelf={"center"}
              width={"5rem"}
              fontWeight={"normal"}
              onClick={onClickSave}
            >
              Save
            </Button>
          </Flex>
        </Box>
      </Collapse>
    </Collapse>
  );
};

export default ListVerses;
