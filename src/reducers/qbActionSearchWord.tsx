import {
  SEARCH_SCOPE,
  qbStateProps,
  searchResult,
  versePart,
} from "../components/QuranBrowser/consts";
import { chapterProps, quranProps, verseProps } from "../types";
import {
  findSubstring,
  onlySpaces,
  removeDiacritics,
  splitArabicLetters,
} from "../util/util";

const getSearchIndexes = (
  processedVerseText: string,
  searchToken: string,
  verse: verseProps,
  searchDiacritics: boolean
) => {
  const regex = new RegExp(`(${searchToken})`);
  const parts = searchDiacritics
    ? verse.versetext.split(regex)
    : processedVerseText.split(regex);

  const arrayText = splitArabicLetters(verse.versetext);
  const verseParts: versePart[] = [];

  parts.forEach((part) => {
    const isMatch = part.includes(searchToken);

    const originalPart = searchDiacritics
      ? part
      : arrayText
          .slice(
            processedVerseText.indexOf(part),
            processedVerseText.indexOf(part) + part.length
          )
          .join("");

    verseParts.push({ text: originalPart, highlight: isMatch });
  });

  const verseResult: searchResult = {
    key: verse.key,
    suraid: verse.suraid,
    verseid: verse.verseid,
    verseParts,
  };

  return verseResult;
};

const searchVerse = (
  verse: verseProps,
  searchToken: string,
  searchIdentical: boolean,
  searchDiacritics: boolean
) => {
  let processedVerseText = "";

  if (searchDiacritics) {
    processedVerseText = verse.versetext;
  } else {
    processedVerseText = removeDiacritics(verse.versetext);
  }

  if (searchIdentical) {
    if (findSubstring(searchToken, processedVerseText)) {
      const verseResult = getSearchIndexes(
        processedVerseText,
        searchToken,
        verse,
        searchDiacritics
      );
      return verseResult;
    }
  } else {
    if (processedVerseText.search(searchToken) !== -1) {
      const verseResult = getSearchIndexes(
        processedVerseText,
        searchToken,
        verse,
        searchDiacritics
      );
      return verseResult;
    }
  }
  return false;
};

export function qbSearchWord(
  state: qbStateProps,
  chapterNames: chapterProps[],
  allQuranText: quranProps[]
): qbStateProps {
  const {
    searchString,
    searchMethod,
    searchScope,
    selectChapter,
    selectedChapters,
    searchDiacritics,
    searchIdentical,
  } = state;

  // initial search state
  let newState: qbStateProps = {
    ...state,
    searchError: false,
    selectedRootError: false,
    searchResult: [],
    searchIndexes: [],
    searchingString: searchString,
    searchingMethod: searchMethod,
    searchingScope: searchScope,
    searchingChapters: Array.from(
      selectedChapters,
      (chapterID) => chapterNames[Number(chapterID) - 1].name
    ),
    scrollKey: "",
  };

  if (onlySpaces(searchString)) {
    return { ...newState, searchError: true };
  }

  let processedSearchString = "";

  // Do not remove diacritics if not required.
  if (searchDiacritics) {
    processedSearchString = searchString;
  } else {
    processedSearchString = removeDiacritics(searchString);
  }

  if (onlySpaces(processedSearchString)) {
    return { ...newState, searchError: true };
  }

  // Remove extra spaces. (Note: in the future reconsider this step)
  processedSearchString = processedSearchString.trim();

  const matchVerses: searchResult[] = [];

  if (searchScope === SEARCH_SCOPE.ALL_CHAPTERS) {
    allQuranText.forEach((sura) => {
      sura.verses.forEach((verse) => {
        const result = searchVerse(
          verse,
          processedSearchString,
          searchIdentical,
          searchDiacritics
        );

        if (result !== false) {
          matchVerses.push(result);
        }
      });
    });
  } else {
    if (selectedChapters.length > 1) {
      selectedChapters.forEach((chapter) => {
        allQuranText[Number(chapter) - 1].verses.forEach((verse) => {
          const result = searchVerse(
            verse,
            processedSearchString,
            searchIdentical,
            searchDiacritics
          );

          if (result !== false) {
            matchVerses.push(result);
          }
        });
      });

      newState = {
        ...newState,
        searchScope: SEARCH_SCOPE.MULTIPLE_CHAPTERS,
        searchingScope: SEARCH_SCOPE.MULTIPLE_CHAPTERS,
      };
    } else {
      allQuranText[selectChapter - 1].verses.forEach((verse) => {
        const result = searchVerse(
          verse,
          processedSearchString,
          searchIdentical,
          searchDiacritics
        );

        if (result !== false) {
          matchVerses.push(result);
        }
      });

      newState = {
        ...newState,
        searchScope: SEARCH_SCOPE.SINGLE_CHAPTER,
        searchingScope: SEARCH_SCOPE.SINGLE_CHAPTER,
      };
    }
  }

  if (matchVerses.length === 0) {
    return { ...newState, searchError: true };
  } else {
    return {
      ...newState,
      searchResult: matchVerses,
    };
  }
}
