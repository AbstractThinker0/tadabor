import { qbStateProps } from "@/components/QuranBrowser/consts";
import { verseMatchResult } from "@/types";
import quranClass from "@/util/quranService";
import {
  searchVerse,
  onlySpaces,
  removeDiacritics,
  normalizeAlif,
} from "@/util/util";

export function qbSearchWord(
  state: qbStateProps,
  quranService: quranClass
): qbStateProps {
  // Deconstruct current state
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
    searchingChapters: selectedChapters.map((chapterID) =>
      quranService.getChapterName(chapterID)
    ),
    scrollKey: "",
  };

  // Check if we are search with diacrtics or they should be stripped off
  const normalizedToken = searchDiacritics
    ? searchString
    : normalizeAlif(removeDiacritics(searchString));

  // If an empty search token don't initiate a search
  if (onlySpaces(normalizedToken)) {
    return { ...newState, searchError: true };
  }

  const matchVerses: verseMatchResult[] = [];

  selectedChapters.forEach((chapter) => {
    quranService.getVerses(chapter).forEach((verse) => {
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
