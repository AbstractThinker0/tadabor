import {
  SEARCH_SCOPE,
  qbStateProps,
  searchIndexProps,
  searchResult,
  versePart,
} from "../components/QuranBrowser/consts";
import { chapterProps, quranProps, rootProps, verseProps } from "../types";
import {
  findSubstring,
  onlySpaces,
  removeDiacritics,
  splitArabicLetters,
  splitByArray,
} from "../util/util";

const getDerivationsInVerse = (
  wordIndexes: string[],
  verse: verseProps,
  chapterName: string
) => {
  const { versetext, key, suraid, verseid } = verse;
  const verseWords = versetext.split(" ");
  const derivationsArray = wordIndexes.map(
    (index) => verseWords[Number(index) - 1]
  );

  const rootParts = splitByArray(versetext, derivationsArray);

  const verseParts = rootParts.filter(Boolean).map((part) => ({
    text: part,
    highlight: derivationsArray.includes(part),
  }));

  const verseDerivations = derivationsArray.map((name, index) => ({
    name,
    key,
    text: `${chapterName}:${verseid}`,
    wordIndex: wordIndexes[index],
  }));

  const verseResult = { key, suraid, verseid, verseParts };

  return { verseDerivations, verseResult };
};

export function qbSearchRoot(
  state: qbStateProps,
  payload: {
    absoluteQuran: verseProps[];
    chapterNames: chapterProps[];
    quranRoots: rootProps[];
  }
): qbStateProps {
  // initial search state
  let newState: qbStateProps = {
    ...state,
    searchError: false,
    selectedRootError: false,
    searchResult: [],
    searchIndexes: [],
    searchingString: state.searchString,
    searchingMethod: state.searchMethod,
    scrollKey: "",
  };

  if (onlySpaces(state.searchString)) {
    return { ...newState, selectedRootError: true };
  }

  const absoluteQuran: verseProps[] = payload.absoluteQuran;
  const chapterNames: chapterProps[] = payload.chapterNames;
  const quranRoots: rootProps[] = payload.quranRoots;

  const rootTarget = quranRoots.find(
    (root) => root.name === state.searchString
  );

  if (rootTarget === undefined) {
    return { ...newState, selectedRootError: true };
  }

  const occurencesArray = rootTarget.occurences;

  const matchVerses: searchResult[] = [];
  const derivations: searchIndexProps[] = [];

  if (state.searchScope === SEARCH_SCOPE.ALL_CHAPTERS) {
    // occurences array have the verserank1:derivativeIndex1,derivativeIndex2...etc format
    occurencesArray.forEach((item) => {
      const info = item.split(":");
      const currentVerse = absoluteQuran[Number(info[0])];

      const chapterName = chapterNames[Number(currentVerse.suraid) - 1].name;

      const wordIndexes = info[1].split(",");

      const { verseDerivations, verseResult } = getDerivationsInVerse(
        wordIndexes,
        currentVerse,
        chapterName
      );

      derivations.push(...verseDerivations);
      matchVerses.push(verseResult);
    });

    newState = { ...newState, searchingScope: SEARCH_SCOPE.ALL_CHAPTERS };
  } else {
    // Get selected chapters
    if (state.selectedChapters.length > 1) {
      const searchChapters: string[] = [];

      state.selectedChapters.forEach((chapter) => {
        searchChapters.push(chapterNames[Number(chapter) - 1].name);
      });

      newState = {
        ...newState,
        searchScope: SEARCH_SCOPE.MULTIPLE_CHAPTERS,
        searchingScope: SEARCH_SCOPE.MULTIPLE_CHAPTERS,
        searchingChapters: searchChapters,
      };
    } else {
      newState = {
        ...newState,
        searchScope: SEARCH_SCOPE.SINGLE_CHAPTER,
        searchingScope: SEARCH_SCOPE.SINGLE_CHAPTER,
      };
    }

    occurencesArray.forEach((item) => {
      const info = item.split(":");
      const currentVerse = absoluteQuran[Number(info[0])];

      if (state.selectedChapters.includes(currentVerse.suraid)) {
        const wordIndexes = info[1].split(",");

        const chapterName = chapterNames[Number(currentVerse.suraid) - 1].name;

        const { verseDerivations, verseResult } = getDerivationsInVerse(
          wordIndexes,
          currentVerse,
          chapterName
        );

        derivations.push(...verseDerivations);
        matchVerses.push(verseResult);
      }
    });
  }

  if (matchVerses.length === 0) {
    return { ...newState, selectedRootError: true };
  } else {
    return {
      ...newState,
      searchResult: matchVerses,
      searchIndexes: derivations,
    };
  }
}

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

  if (searchDiacritics !== true) {
    processedVerseText = removeDiacritics(verse.versetext);
  } else {
    processedVerseText = verse.versetext;
  }

  if (searchIdentical === true) {
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
  payload: {
    allQuranText: quranProps[];
    chapterNames: chapterProps[];
  }
): qbStateProps {
  // initial search state
  let newState: qbStateProps = {
    ...state,
    searchError: false,
    selectedRootError: false,
    searchResult: [],
    searchIndexes: [],
    searchingString: state.searchString,
    searchingMethod: state.searchMethod,
    searchingScope: state.searchScope,
    scrollKey: "",
  };

  if (onlySpaces(state.searchString)) {
    return { ...newState, searchError: true };
  }

  let processedSearchString = "";

  // Do not remove diacritics if not required.
  if (state.searchDiacritics === true) {
    processedSearchString = state.searchString;
  } else {
    processedSearchString = removeDiacritics(state.searchString);
  }

  // Remove extra spaces. (Note: in the future reconsider this step)
  processedSearchString = processedSearchString.trim();

  const QuranText: quranProps[] = payload.allQuranText;
  const chapterNames: chapterProps[] = payload.chapterNames;

  const matchVerses: searchResult[] = [];

  if (state.searchScope === SEARCH_SCOPE.ALL_CHAPTERS) {
    QuranText.forEach((sura) => {
      sura.verses.forEach((verse) => {
        const result = searchVerse(
          verse,
          processedSearchString,
          state.searchIdentical,
          state.searchDiacritics
        );

        if (result !== false) {
          matchVerses.push(result);
        }
      });
    });
  } else {
    if (state.selectedChapters.length > 1) {
      const searchChapters: string[] = [];

      state.selectedChapters.forEach((chapter) => {
        searchChapters.push(chapterNames[Number(chapter) - 1].name);
        QuranText[Number(chapter) - 1].verses.forEach((verse) => {
          const result = searchVerse(
            verse,
            processedSearchString,
            state.searchIdentical,
            state.searchDiacritics
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
        searchingChapters: searchChapters,
      };
    } else {
      QuranText[state.selectChapter - 1].verses.forEach((verse) => {
        const result = searchVerse(
          verse,
          processedSearchString,
          state.searchIdentical,
          state.searchDiacritics
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
