import {
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

/*
  This function allows us to get a text that has diacritics based on a text that doesn't, we basically want the original string since we used a diacriticless string for our search
*/
const getOriginalPart = (
  versetext: string,
  processedVerseText: string,
  part: string,
  traversedLength: number
) => {
  const arrayText = splitArabicLetters(versetext);

  return arrayText
    .slice(
      processedVerseText.indexOf(part, traversedLength),
      processedVerseText.indexOf(part, traversedLength) + part.length
    )
    .join("");
};

/* Return the indexes of a search if there is a match
  Result structure:
  {
    key,
    suraid,
    verseid,
    verseParts: [{text, highlight}, {text, highlight}, ...]
  }
*/
const getSearchIndexes = (
  processedVerseText: string,
  searchToken: string,
  verse: verseProps,
  searchDiacritics: boolean
) => {
  // using RegExp here because we want to include the searchToken as a separate part in the resulting array.
  const regex = new RegExp(`(${searchToken})`);
  const parts = processedVerseText.split(regex).filter((part) => part !== "");
  let traversedLength = 0;
  const verseParts: versePart[] = parts.map((part) => {
    const currentPart: versePart = {
      text: searchDiacritics
        ? part
        : getOriginalPart(
            verse.versetext,
            processedVerseText,
            part,
            traversedLength
          ),
      highlight: part.includes(searchToken),
    };

    traversedLength += part.length;

    return currentPart;
  });

  return {
    key: verse.key,
    suraid: verse.suraid,
    verseid: verse.verseid,
    verseParts,
  };
};

const searchVerse = (
  verse: verseProps,
  searchToken: string,
  searchIdentical: boolean,
  searchDiacritics: boolean
) => {
  const processedVerseText = searchDiacritics
    ? verse.versetext
    : removeDiacritics(verse.versetext);

  if (
    (searchIdentical && findSubstring(searchToken, processedVerseText)) ||
    (!searchIdentical && processedVerseText.includes(searchToken))
  ) {
    return getSearchIndexes(
      processedVerseText,
      searchToken,
      verse,
      searchDiacritics
    );
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
    selectChapter,
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

  if (onlySpaces(searchString)) {
    return { ...newState, searchError: true };
  }

  // (Note: in the future reconsider Removing the extra spaces with trim)
  const processedSearchString = searchDiacritics
    ? searchString
    : removeDiacritics(searchString).trim();

  if (onlySpaces(processedSearchString)) {
    return { ...newState, searchError: true };
  }

  const matchVerses: searchResult[] = [];

  if (selectedChapters.length === 114) {
    allQuranText.forEach((sura) => {
      sura.verses.forEach((verse) => {
        const result = searchVerse(
          verse,
          processedSearchString,
          searchIdentical,
          searchDiacritics
        );

        if (result) {
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

          if (result) {
            matchVerses.push(result);
          }
        });
      });
    } else {
      allQuranText[selectChapter - 1].verses.forEach((verse) => {
        const result = searchVerse(
          verse,
          processedSearchString,
          searchIdentical,
          searchDiacritics
        );

        if (result) {
          matchVerses.push(result);
        }
      });
    }
  }

  if (matchVerses.length === 0) {
    return { ...newState, searchError: true };
  }

  return {
    ...newState,
    searchResult: matchVerses,
  };
}
