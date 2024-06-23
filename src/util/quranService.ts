import { removeDiacritics, splitArabicLetters } from "@/util/util";

import { chapterProps, quranProps, rootProps, verseProps } from "@/types";

class quranClass {
  chapterNames: chapterProps[] = [];
  allQuranText: quranProps[] = [];
  quranRoots: rootProps[] = [];
  absoluteQuran: verseProps[] = [];

  setChapters(chaptersData: chapterProps[]) {
    this.chapterNames = chaptersData;
  }

  setQuran(quranData: quranProps[]) {
    this.allQuranText = quranData;

    if (!this.absoluteQuran.length) {
      quranData.forEach((sura) => {
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

  getLetterByKey = (letterKey: string) => {
    const verseIndexes = letterKey.split(":");
    const verseText = this.getVerseByKey(verseIndexes[0]).versetext;
    const verseWords = verseText.split(" ");
    const letterIndexes = verseIndexes[1].split("-");
    const letterSplit = splitArabicLetters(
      verseWords[Number(letterIndexes[0])]
    )[Number(letterIndexes[1])];
    return removeDiacritics(letterSplit);
  };
}

export default quranClass;
