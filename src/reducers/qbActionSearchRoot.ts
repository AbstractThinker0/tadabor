import { qbStateProps } from "@/components/QuranBrowser/consts";
import {
  chapterProps,
  rootProps,
  verseProps,
  searchIndexProps,
  verseMatchResult,
} from "@/types";
import { onlySpaces, getDerivationsInVerse } from "@/util/util";

export function qbSearchRoot(
  state: qbStateProps,
  chapterNames: chapterProps[],
  absoluteQuran: verseProps[],
  quranRoots: rootProps[]
): qbStateProps {
  // Deconstruct current state
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

  const matchVerses: verseMatchResult[] = [];
  const derivations: searchIndexProps[] = [];

  if (selectedChapters.length) {
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
