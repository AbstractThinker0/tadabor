import {
  QB_ACTIONS,
  qbStateProps,
  SEARCH_SCOPE,
  qbActionsProps,
  searchIndexProps,
} from "../components/QuranBrowser/consts";
import { chapterProps, quranProps, rootProps, verseProps } from "../types";
import { findArabicWord, normalizeArabic, onlySpaces } from "../util/util";

function qbReducer(state: qbStateProps, action: qbActionsProps): qbStateProps {
  // ...
  switch (action.type) {
    case QB_ACTIONS.SET_CHAPTERS: {
      return { ...state, selectedChapters: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_STRING: {
      return { ...state, searchString: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_DIACRITICS: {
      return { ...state, searchDiacritics: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_IDENTICAL: {
      return { ...state, searchIdentical: action.payload };
    }
    case QB_ACTIONS.SET_RADIO_SEARCH: {
      return { ...state, radioSearchMethod: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_SCOPE: {
      return { ...state, searchScope: action.payload };
    }
    case QB_ACTIONS.SEARCH_ROOT_SUBMIT: {
      // initial search state
      let newState: qbStateProps = {
        ...state,
        searchError: false,
        selectedRootError: false,
        searchResult: [],
        searchIndexes: [],
        searchingString: state.searchString,
        radioSearchingMethod: state.radioSearchMethod,
      };

      if (onlySpaces(state.searchString)) {
        return { ...newState, selectedRootError: true };
      }

      const absoluteQuran: verseProps[] = action.payload.absoluteQuran;
      const chapterNames: chapterProps[] = action.payload.chapterNames;
      const quranRoots: rootProps[] = action.payload.quranRoots;

      const rootTarget = quranRoots.find(
        (root) => root.name === state.searchString
      );

      if (rootTarget === undefined) {
        return { ...newState, selectedRootError: true };
      }

      const occurencesArray = rootTarget.occurences;

      const getDerivationsInVerse = (
        wordIndexes: string[],
        verse: verseProps
      ) => {
        const verseDerivations: searchIndexProps[] = [];
        const verseWords = verse.versetext.split(" ");
        wordIndexes.forEach((word) => {
          verseDerivations.push({
            name: verseWords[Number(word) - 1],
            key: verse.key,
            text:
              chapterNames[Number(verse.suraid) - 1].name + ":" + verse.verseid,
            wordIndex: word,
          });
        });
        return verseDerivations;
      };

      const matchVerses: verseProps[] = [];

      const derivations: searchIndexProps[] = [];

      if (state.searchScope === SEARCH_SCOPE.ALL_CHAPTERS) {
        // occurences array have the verserank1:derivativeIndex1,derivativeIndex2...etc format
        occurencesArray.forEach((item) => {
          const info = item.split(":");
          const currentVerse = absoluteQuran[Number(info[0])];

          const wordIndexes = info[1].split(",");

          const verseDerivations = getDerivationsInVerse(
            wordIndexes,
            currentVerse
          );

          derivations.push(...verseDerivations);
          matchVerses.push(currentVerse);
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

            const verseDerivations = getDerivationsInVerse(
              wordIndexes,
              currentVerse
            );

            derivations.push(...verseDerivations);
            matchVerses.push(currentVerse);
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
    case QB_ACTIONS.SEARCH_WORD_SUBMIT: {
      // initial search state
      let newState: qbStateProps = {
        ...state,
        searchError: false,
        selectedRootError: false,
        searchResult: [],
        searchIndexes: [],
        searchingString: state.searchString,
        radioSearchingMethod: state.radioSearchMethod,
        searchingScope: state.searchScope,
      };

      if (onlySpaces(state.searchString)) {
        return { ...newState, searchError: true };
      }

      let processedSearchString = "";

      // Do not remove diacritics if not required.
      if (state.searchDiacritics === true) {
        processedSearchString = state.searchString;
      } else {
        processedSearchString = normalizeArabic(state.searchString);
      }

      // Remove extra spaces. (Note: in the future reconsider this step)
      processedSearchString = processedSearchString.trim();

      const QuranText: quranProps[] = action.payload.allQuranText;
      const chapterNames: chapterProps[] = action.payload.chapterNames;

      const getSearchIndexes = (
        verseText: string,
        verseKey: string,
        searchToken: string
      ) => {
        const verseIndexes: searchIndexProps[] = [];
        const verseWords = verseText.split(" ");
        verseWords.forEach((word, index) => {
          if (word.includes(searchToken)) {
            verseIndexes.push({
              name: searchToken,
              key: verseKey,
              text: verseWords[index],
              wordIndex: index.toString(),
            });
          }
        });

        return verseIndexes;
      };

      const searchVerse = (
        verse: verseProps,
        searchToken: string,
        searchIdentical: boolean,
        searchDiacritics: boolean
      ) => {
        let verseIndexes: searchIndexProps[] = [];
        let processedVerseText = "";

        if (searchDiacritics !== true) {
          processedVerseText = normalizeArabic(verse.versetext);
        } else {
          processedVerseText = verse.versetext;
        }

        if (searchIdentical === true) {
          if (findArabicWord(searchToken, processedVerseText)) {
            verseIndexes = getSearchIndexes(
              processedVerseText,
              verse.key,
              searchToken
            );
            return { verse, verseIndexes };
          }
        } else {
          if (processedVerseText.search(searchToken) !== -1) {
            verseIndexes = getSearchIndexes(
              processedVerseText,
              verse.key,
              searchToken
            );
            return { verse, verseIndexes };
          }
        }
        return false;
      };

      const matchVerses: verseProps[] = [];
      const searchIndexes: searchIndexProps[] = [];

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
              matchVerses.push(result.verse);
              searchIndexes.push(...result.verseIndexes);
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
                matchVerses.push(result.verse);
                searchIndexes.push(...result.verseIndexes);
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
              matchVerses.push(result.verse);
              searchIndexes.push(...result.verseIndexes);
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
          searchIndexes: searchIndexes,
        };
      }
    }
    case QB_ACTIONS.GOTO_CHAPTER: {
      return {
        ...state,
        searchError: false,
        selectedRootError: false,
        searchResult: [],
        searchIndexes: [],
        selectChapter: Number(action.payload),
        selectedChapters: [action.payload],
      };
    }
  }
}

export default qbReducer;
