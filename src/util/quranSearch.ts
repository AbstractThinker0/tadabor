import quranClass from "@/util/quranService";
import {
  normalizeAlif,
  removeDiacritics,
  onlySpaces,
  searchVerse,
  getDerivationsInVerse,
} from "@/util/util";

import { searchIndexProps, verseMatchResult, verseProps } from "@/types";

interface ISearchOptions {
  searchDiacritics: boolean;
  searchIdentical: boolean;
  searchStart: boolean;
}

const byWord = (
  word: string,
  quranInstance: quranClass,
  searchChapters: string[] | "all",
  searchOptions: ISearchOptions
) => {
  // Check if we are search with diacrtics or they should be stripped off
  const normalizedToken = searchOptions.searchDiacritics
    ? word
    : normalizeAlif(removeDiacritics(word));

  // If an empty search token don't initiate a search
  if (onlySpaces(normalizedToken)) {
    return false;
  }

  const matchVerses: verseMatchResult[] = [];

  const searchVerseInList = (verses: verseProps[]) => {
    verses.forEach((verse) => {
      const result = searchVerse(
        verse,
        normalizedToken,
        searchOptions.searchIdentical,
        searchOptions.searchDiacritics,
        searchOptions.searchStart
      );

      if (result) {
        matchVerses.push(result);
      }
    });
  };

  if (searchChapters === "all" || searchChapters.length === 114) {
    searchVerseInList(quranInstance.absoluteQuran);
  } else {
    searchChapters.forEach((chapter) => {
      searchVerseInList(quranInstance.getVerses(chapter));
    });
  }

  if (matchVerses.length === 0) {
    return false;
  }

  return matchVerses;
};

const byRoot = (
  root: string,
  quranInstance: quranClass,
  searchChapters: string[]
) => {
  if (onlySpaces(root)) {
    return false;
  }

  const rootTarget = quranInstance.getRootByName(root);

  if (rootTarget === undefined) {
    return false;
  }

  const occurencesArray = rootTarget.occurences;

  const matchVerses: verseMatchResult[] = [];
  const derivations: searchIndexProps[] = [];

  if (searchChapters) {
    occurencesArray.forEach((item) => {
      const info = item.split(":");
      const currentVerse = quranInstance.getVerseByRank(info[0]);

      if (searchChapters.includes(currentVerse.suraid)) {
        const wordIndexes = info[1].split(",");

        const chapterName = quranInstance.getChapterName(currentVerse.suraid);

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
    return false;
  } else {
    return { matchVerses, derivations };
  }
};

export const quranSearcher = { byWord, byRoot };
