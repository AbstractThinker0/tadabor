import { qbStateProps } from "@/components/QuranBrowser/consts";
import { chapterProps, quranProps, verseMatchResult } from "@/types";
import { searchVerse, onlySpaces, removeDiacritics } from "@/util/util";

export function qbSearchWord(
  state: qbStateProps,
  chapterNames: chapterProps[],
  allQuranText: quranProps[]
): qbStateProps {
  // Destruct current state
  const {
    searchString,
    searchMethod,
    selectedChapters,
    searchDiacritics,
    searchIdentical,
  } = state;

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

  // If an empty search token don't initiate a search
  if (onlySpaces(searchString)) {
    return { ...newState, searchError: true };
  }

  // Check if we are search with diacrtics or they should be stripped off
  const normalizedToken = searchDiacritics
    ? searchString
    : removeDiacritics(searchString);

  // If the token only had diacrtics this will return true
  if (onlySpaces(normalizedToken)) {
    return { ...newState, searchError: true };
  }

  const matchVerses: verseMatchResult[] = [];

  selectedChapters.forEach((chapter) => {
    allQuranText[Number(chapter) - 1].verses.forEach((verse) => {
      const result = searchVerse(
        verse,
        normalizedToken,
        searchIdentical,
        searchDiacritics
      );

      if (result) {
        matchVerses.push(result);
      }
    });
  });

  if (matchVerses.length === 0) {
    return { ...newState, searchError: true };
  }

  return {
    ...newState,
    searchResult: matchVerses,
  };
}
