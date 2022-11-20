import { useState, useRef, useCallback } from "react";

import { findWord, normalize_text, onlySpaces } from "../util/util";

import useQuran, { verseProps } from "../context/QuranContext";

import SearchPanel from "../components/QuranBrowser/SearchPanel";
import DisplayPanel from "../components/QuranBrowser/DisplayPanel";

interface derivationProps {
  name: string;
  key: string;
  text: string;
  wordIndex: string;
}

function QuranBrowser() {
  const { allQuranText, absoluteQuran, chapterNames, quranRoots } = useQuran();

  const refListChapters = useRef<HTMLSelectElement>(null);
  const scrollKey = useRef<string | null>(null);

  const [selectChapter, setSelectChapter] = useState(1);
  const [selectedChapters, setSelectedChapters] = useState(["1"]);

  const [searchString, setSearchString] = useState("");
  const [searchingString, setSearchingString] = useState("");

  const [searchResult, setSearchResult] = useState<verseProps[]>([]);

  const [searchAllQuran, setSearchAllQuran] = useState(true);
  const [searchingAllQuran, setSearchingAllQuran] = useState(true);

  const [searchMultipleChapters, setSearchMultipleChapters] = useState(false);

  const [searchDiacritics, setSearchDiacritics] = useState(false);

  const [searchIdentical, setSearchIdentical] = useState(false);

  const [searchError, setSearchError] = useState(false);
  const [selectedRootError, setSelectedRootError] = useState(false);

  const [radioSearchMethod, setRadioSearchMethod] =
    useState("optionWordSearch");
  const [radioSearchingMethod, setRadioSearchingMethod] =
    useState("optionWordSearch");

  const [rootDerivations, setRootDerivations] = useState<derivationProps[]>([]);

  const clearPreviousSearch = () => {
    setSearchError(false);
    setSelectedRootError(false);
    setSearchMultipleChapters(false);
    setSearchResult([]);
    setRootDerivations([]);
  };

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    clearPreviousSearch();
    setSearchingString(searchString);
    setRadioSearchingMethod(radioSearchMethod);

    function handleSearchByWord() {
      if (onlySpaces(searchString)) {
        setSearchError(true);
        return;
      }

      let matchVerses: verseProps[] = [];
      let normal_search = "";

      if (!searchDiacritics) {
        normal_search = normalize_text(searchString).trim();
      } else {
        normal_search = searchString.trim();
      }

      const checkVerseMatch = (verse: verseProps) => {
        let normal_text = "";
        if (!searchDiacritics) {
          normal_text = normalize_text(verse.versetext);
        } else {
          normal_text = verse.versetext;
        }

        if (searchIdentical) {
          if (findWord(normal_search, normal_text)) {
            matchVerses.push(verse);
          }
        } else {
          if (normal_text.search(normal_search) !== -1) {
            matchVerses.push(verse);
          }
        }
      };

      if (searchAllQuran) {
        setSearchingAllQuran(true);
        allChaptersMatches();
      } else {
        setSearchingAllQuran(false);

        if (selectedChapters.length > 1) {
          multipleChaptersMatches();
        } else {
          oneChapterMatches();
        }
      }

      function allChaptersMatches() {
        allQuranText.forEach((sura) => {
          sura.verses.forEach((verse) => {
            checkVerseMatch(verse);
          });
        });
      }

      function oneChapterMatches() {
        let currentChapter = allQuranText[selectChapter - 1].verses;
        currentChapter.forEach((verse) => {
          checkVerseMatch(verse);
        });
      }

      function multipleChaptersMatches() {
        setSearchMultipleChapters(true);
        selectedChapters.forEach((chapter) => {
          allQuranText[Number(chapter) - 1].verses.forEach((verse) => {
            checkVerseMatch(verse);
          });
        });
      }

      if (matchVerses.length === 0) {
        setSearchError(true);
      } else {
        setSearchResult(matchVerses);
      }
    }

    function handleSearchByRoot() {
      if (onlySpaces(searchString)) {
        setSelectedRootError(true);
        return;
      }

      let rootTarget = quranRoots.find((root) => root.name === searchString);

      if (rootTarget === undefined) {
        setSelectedRootError(true);
        return;
      }

      let occurencesArray = rootTarget.occurences;

      let matchVerses: verseProps[] = [];
      let derivations: derivationProps[] = [];

      const fillDerivationsArray = (
        wordIndexes: string[],
        verseWords: string[],
        currentVerse: verseProps
      ) => {
        wordIndexes.forEach((word) => {
          derivations.push({
            name: verseWords[Number(word) - 1],
            key: currentVerse.key,
            text:
              chapterNames[Number(currentVerse.suraid) - 1].name +
              ":" +
              currentVerse.verseid,
            wordIndex: word,
          });
        });
      };

      if (searchAllQuran) {
        setSearchingAllQuran(true);
      } else {
        setSearchingAllQuran(false);

        if (selectedChapters.length > 1) {
          setSearchMultipleChapters(true);
        }
      }

      // ابى	13	40:9;288:17,74;1242:13;1266:7;1832:3;2117:10;2127:20;2216:9;2403:6;2463:9;2904:5;3604:8

      // occurences array have the verserank:index1,index2...etc format
      occurencesArray.forEach((item) => {
        let info = item.split(":");
        let currentVerse = absoluteQuran[Number(info[0])];

        if (selectedChapters.includes(currentVerse.suraid) || searchAllQuran) {
          let verseWords = currentVerse.versetext.split(" ");

          let wordIndexes = info[1].split(",");

          fillDerivationsArray(wordIndexes, verseWords, currentVerse);
          matchVerses.push(currentVerse);
        }
      });

      if (matchVerses.length === 0) {
        setSelectedRootError(true);
      } else {
        setSearchResult(matchVerses);
        setRootDerivations(derivations);
      }
    }

    if (radioSearchMethod === "optionWordSearch") {
      handleSearchByWord();
    } else if (radioSearchMethod === "optionRootSearch") {
      handleSearchByRoot();
    }
  }

  const memoHandleSearchSubmit = useCallback(handleSearchSubmit, [
    absoluteQuran,
    allQuranText,
    chapterNames,
    quranRoots,
    searchAllQuran,
    searchDiacritics,
    searchIdentical,
    selectChapter,
    selectedChapters,
    radioSearchMethod,
    searchString,
  ]);

  function gotoChapter(chapter: string) {
    clearPreviousSearch();
    setSelectChapter(Number(chapter));
    setSelectedChapters([chapter]);
  }

  const memoGotoChapter = useCallback(gotoChapter, []);

  function handleSelectionListChapters(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!event.target.value) return;

    scrollKey.current = null;

    let chapter = event.target.value;

    if (event.target.selectedOptions.length === 1) {
      memoGotoChapter(chapter);
    } else {
      setSelectedChapters(
        Array.from(event.target.selectedOptions, (option) => option.value)
      );
    }
  }

  const memoHandleSelectionListChapters = useCallback(
    handleSelectionListChapters,
    [memoGotoChapter]
  );

  return (
    <div className="browser">
      <SearchPanel
        refListChapters={refListChapters}
        selectedChapters={selectedChapters}
        searchResult={searchResult}
        searchString={searchString}
        searchDiacritics={searchDiacritics}
        searchIdentical={searchIdentical}
        radioSearchMethod={radioSearchMethod}
        searchAllQuran={searchAllQuran}
        setSearchAllQuran={setSearchAllQuran}
        setSearchIdentical={setSearchIdentical}
        setSearchString={setSearchString}
        setRadioSearchMethod={setRadioSearchMethod}
        setSearchDiacritics={setSearchDiacritics}
        memoHandleSearchSubmit={memoHandleSearchSubmit}
        memoHandleSelectionListChapters={memoHandleSelectionListChapters}
      />

      <DisplayPanel
        refListChapters={refListChapters}
        scrollKey={scrollKey}
        searchResult={searchResult}
        searchError={searchError}
        selectedRootError={selectedRootError}
        searchingString={searchingString}
        searchingAllQuran={searchingAllQuran}
        selectChapter={selectChapter}
        radioSearchingMethod={radioSearchingMethod}
        searchMultipleChapters={searchMultipleChapters}
        rootDerivations={rootDerivations}
        memoGotoChapter={memoGotoChapter}
      />
    </div>
  );
}

export default QuranBrowser;
