import {
  SEARCH_SCOPE,
  qbStateProps,
  searchIndexProps,
  searchResult,
} from "../components/QuranBrowser/consts";
import { chapterProps, rootProps, verseProps } from "../types";
import { onlySpaces, splitByArray } from "../util/util";

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
  chapterNames: chapterProps[],
  absoluteQuran: verseProps[],
  quranRoots: rootProps[]
): qbStateProps {
  const { searchString, searchMethod, searchScope, selectedChapters } = state;
  // initial search state
  let newState: qbStateProps = {
    ...state,
    searchError: false,
    selectedRootError: false,
    searchResult: [],
    searchIndexes: [],
    searchingString: searchString,
    searchingMethod: searchMethod,
    searchingChapters: Array.from(
      selectedChapters,
      (chapterID) => chapterNames[Number(chapterID) - 1].name
    ),
    scrollKey: "",
  };

  if (onlySpaces(searchString)) {
    return { ...newState, selectedRootError: true };
  }

  const rootTarget = quranRoots.find((root) => root.name === searchString);

  if (rootTarget === undefined) {
    return { ...newState, selectedRootError: true };
  }

  const occurencesArray = rootTarget.occurences;

  const matchVerses: searchResult[] = [];
  const derivations: searchIndexProps[] = [];

  if (searchScope === SEARCH_SCOPE.ALL_CHAPTERS) {
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
    if (selectedChapters.length > 1) {
      newState = {
        ...newState,
        searchScope: SEARCH_SCOPE.MULTIPLE_CHAPTERS,
        searchingScope: SEARCH_SCOPE.MULTIPLE_CHAPTERS,
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

      if (selectedChapters.includes(currentVerse.suraid)) {
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
