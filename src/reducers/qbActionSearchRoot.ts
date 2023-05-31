import {
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
  const { searchString, searchMethod, selectedChapters } = state;
  // initial search state
  const newState: qbStateProps = {
    ...state,
    searchError: false,
    searchResult: [],
    searchIndexes: [],
    searchingString: searchString,
    searchingMethod: searchMethod,
    searchingChapters: selectedChapters.map(
      (chapterID) => chapterNames[Number(chapterID) - 1].name
    ),
    scrollKey: "",
  };

  if (onlySpaces(searchString)) {
    return { ...newState, searchError: true };
  }

  const rootTarget = quranRoots.find((root) => root.name === searchString);

  if (rootTarget === undefined) {
    return { ...newState, searchError: true };
  }

  const occurencesArray = rootTarget.occurences;

  const matchVerses: searchResult[] = [];
  const derivations: searchIndexProps[] = [];

  if (selectedChapters.length === 114) {
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
  } else {
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
    return { ...newState, searchError: true };
  }

  return {
    ...newState,
    searchResult: matchVerses,
    searchIndexes: derivations,
  };
}
