import {
  removeDiacritics,
  splitArabicLetters,
  normalizeAlif,
  onlySpaces,
  searchVerse,
  getDerivationsInVerse,
} from "@/util/util";

import {
  chapterProps,
  quranProps,
  rootProps,
  verseProps,
  verseMatchResult,
  searchIndexProps,
} from "@/types";

interface ISearchOptions {
  searchDiacritics: boolean;
  searchIdentical: boolean;
  searchStart: boolean;
}

class quranClass {
  chapterNames: chapterProps[] = [];
  allQuranText: quranProps[] = [];
  quranRoots: rootProps[] = [];
  absoluteQuran: verseProps[] = [];

  setChapters(chaptersData: chapterProps[]) {
    this.chapterNames = chaptersData;
  }

  setQuran(quranData: quranProps[]) {
    if (!this.allQuranText.length) {
      let rank = 0;
      quranData.forEach((sura, index) => {
        const rankedVerses: verseProps[] = [];
        sura.verses.forEach((verse) => {
          rankedVerses.push({ ...verse, rank });
          rank++;
        });

        this.allQuranText.push({ id: index, verses: rankedVerses });
      });
    }

    if (!this.absoluteQuran.length) {
      this.allQuranText.forEach((sura) => {
        sura.verses.forEach((verse) => {
          this.absoluteQuran.push(verse);
        });
      });
    }
  }

  setRoots(rootsData: rootProps[]) {
    this.quranRoots = rootsData;
  }

  getChapterName(suraid: string | number): string {
    return this.chapterNames[Number(suraid) - 1].name;
  }

  getVerses(suraid: number | string) {
    return this.allQuranText[Number(suraid) - 1].verses;
  }

  getVerseByKey(key: string) {
    const info = key.split("-");
    return this.getVerses(info[0])[Number(info[1]) - 1];
  }

  getVerseTextByKey(key: string) {
    return this.getVerseByKey(key).versetext;
  }

  getVerseByRank(rank: string | number) {
    return this.absoluteQuran[Number(rank)];
  }

  convertKeyToSuffix(key: string): string {
    const info = key.split("-");
    return `${this.getChapterName(info[0])}:${info[1]}`;
  }

  getRootByID = (rootID: string | number) => {
    const root = this.quranRoots.find((root) => root.id === Number(rootID));
    return root;
  };

  getRootNameByID = (rootID: string | number) => {
    return this.getRootByID(rootID)?.name;
  };

  getRootByName = (rootName: string) => {
    const root = this.quranRoots.find((root) => root.name === rootName);
    return root;
  };

  getLetterByKey = (verseKey: string, letterKey: string) => {
    const verseText = this.getVerseByKey(verseKey).versetext;
    const verseWords = verseText.split(" ");
    const letterIndexes = letterKey.split("-");
    const letterSplit = splitArabicLetters(
      verseWords[Number(letterIndexes[0])]
    )[Number(letterIndexes[1])];
    return removeDiacritics(letterSplit);
  };

  searchByWord = (
    word: string,
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
      searchVerseInList(this.absoluteQuran);
    } else {
      searchChapters.forEach((chapter) => {
        searchVerseInList(this.getVerses(chapter));
      });
    }

    if (matchVerses.length === 0) {
      return false;
    }

    return matchVerses;
  };

  searchByRoot = (root: string, searchChapters: string[]) => {
    if (onlySpaces(root)) {
      return false;
    }

    const rootTarget = this.getRootByName(root);

    if (rootTarget === undefined) {
      return false;
    }

    const occurencesArray = rootTarget.occurences;

    const matchVerses: verseMatchResult[] = [];
    const derivations: searchIndexProps[] = [];

    if (searchChapters) {
      occurencesArray.forEach((item) => {
        const info = item.split(":");
        const currentVerse = this.getVerseByRank(info[0]);

        if (searchChapters.includes(currentVerse.suraid)) {
          const wordIndexes = info[1].split(",");

          const chapterName = this.getChapterName(currentVerse.suraid);

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
}

export default quranClass;
