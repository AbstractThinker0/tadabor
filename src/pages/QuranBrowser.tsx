import React, { useReducer, Reducer } from "react";

import { findArabicWord, normalizeArabic, onlySpaces } from "../util/util";

import SearchPanel from "../components/QuranBrowser/SearchPanel";
import DisplayPanel from "../components/QuranBrowser/DisplayPanel";
import { chapterProps, quranProps, rootProps, verseProps } from "../types";

export interface searchIndexProps {
  name: string;
  key: string;
  text: string;
  wordIndex: string;
}

export enum QB_ACTIONS {
  SET_CHAPTERS = "dispatchSetChapters",
  SET_SEARCH_STRING = "dispatchSetSearchString",
  SET_SEARCHING_STRING = "dispatchSetSearchingString",
  SET_SEARCHING_CHAPTERS = "dispatchSetSearchingChapters",
  SET_SEARCH_RESULT = "dispatchSetSearchResult",
  SET_SEARCH_DIACRITICS = "dispatchSetSearchDiacritics",
  SET_SEARCH_IDENTICAL = "dispatchSetSearchIdentical",
  SET_SEARCH_ERROR = "dispatchSetSearchError",
  SET_SELECTED_ROOT_ERROR = "dispatchSetSelectedRootError",
  SET_RADIO_SEARCH = "dispatchSetRadioSearchMethod",
  SET_RADIO_SEARCHING = "dispatchSetRadioSearchingMethod",
  SET_SEARCH_SCOPE = "dispatchSetSearchScope",
  SEARCH_WORD_SUBMIT = "dispatchSetSearchWordSubmit",
  SEARCH_ROOT_SUBMIT = "dispatchSetSearchRootSubmit",
  GOTO_CHAPTER = "dispatchGotoChapter",
}

export enum SEARCH_SCOPE {
  ALL_CHAPTERS = "searchAllChapters",
  MULTIPLE_CHAPTERS = "searchMultipleChapters",
  SINGLE_CHAPTER = "searchSingleChapter",
}

export enum SEARCH_METHOD {
  WORD = "optionWordSearch",
  ROOT = "optionRootSearch",
}

interface reducerAction {
  type: QB_ACTIONS;
  payload: any;
}

interface stateProps {
  selectChapter: number;
  selectedChapters: string[];
  searchString: string;
  searchingString: string;
  searchingChapters: string[];
  searchResult: verseProps[];
  searchDiacritics: boolean;
  searchIdentical: boolean;
  searchError: boolean;
  selectedRootError: boolean;
  radioSearchMethod: string;
  radioSearchingMethod: string;
  searchIndexes: searchIndexProps[];
  searchScope: SEARCH_SCOPE;
  searchingScope: SEARCH_SCOPE;
}

function reducer(state: stateProps, action: reducerAction): stateProps {
  // ...
  switch (action.type) {
    case QB_ACTIONS.SET_CHAPTERS: {
      return { ...state, selectedChapters: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_STRING: {
      return { ...state, searchString: action.payload };
    }
    case QB_ACTIONS.SET_SEARCHING_STRING: {
      return { ...state, searchingString: action.payload };
    }
    case QB_ACTIONS.SET_SEARCHING_CHAPTERS: {
      return { ...state, searchingChapters: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_RESULT: {
      return { ...state, searchResult: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_DIACRITICS: {
      return { ...state, searchDiacritics: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_IDENTICAL: {
      return { ...state, searchIdentical: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_ERROR: {
      return { ...state, searchError: action.payload };
    }
    case QB_ACTIONS.SET_SELECTED_ROOT_ERROR: {
      return { ...state, selectedRootError: action.payload };
    }
    case QB_ACTIONS.SET_RADIO_SEARCH: {
      return { ...state, radioSearchMethod: action.payload };
    }
    case QB_ACTIONS.SET_RADIO_SEARCHING: {
      return { ...state, radioSearchingMethod: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_SCOPE: {
      return { ...state, searchScope: action.payload };
    }
    case QB_ACTIONS.SEARCH_ROOT_SUBMIT: {
      // initial search state
      let newState: stateProps = {
        ...state,
        searchError: false,
        selectedRootError: false,
        searchResult: [],
        searchIndexes: [],
        searchingString: state.searchString,
        radioSearchingMethod: state.radioSearchMethod,
        searchingScope: state.searchingScope,
      };

      if (onlySpaces(state.searchString)) {
        return { ...newState, selectedRootError: true };
      }

      let absoluteQuran: verseProps[] = action.payload.absoluteQuran;
      let chapterNames: chapterProps[] = action.payload.chapterNames;
      let quranRoots: rootProps[] = action.payload.quranRoots;

      let rootTarget = quranRoots.find(
        (root) => root.name === state.searchString
      );

      if (rootTarget === undefined) {
        return { ...newState, selectedRootError: true };
      }

      let occurencesArray = rootTarget.occurences;

      const getDerivationsInVerse = (
        wordIndexes: string[],
        verse: verseProps
      ) => {
        let verseDerivations: searchIndexProps[] = [];
        let verseWords = verse.versetext.split(" ");
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

      let matchVerses: verseProps[] = [];

      let derivations: searchIndexProps[] = [];

      if (state.searchScope === SEARCH_SCOPE.ALL_CHAPTERS) {
        // occurences array have the verserank1:derivativeIndex1,derivativeIndex2...etc format
        occurencesArray.forEach((item) => {
          let info = item.split(":");
          let currentVerse = absoluteQuran[Number(info[0])];

          let wordIndexes = info[1].split(",");

          let verseDerivations = getDerivationsInVerse(
            wordIndexes,
            currentVerse
          );

          derivations = derivations.concat(verseDerivations);
          matchVerses.push(currentVerse);
        });
      } else {
        // Get selected chapters
        if (state.selectedChapters.length > 1) {
          let searchChapters: string[] = [];

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
          let info = item.split(":");
          let currentVerse = absoluteQuran[Number(info[0])];

          if (state.selectedChapters.includes(currentVerse.suraid)) {
            let wordIndexes = info[1].split(",");

            let verseDerivations = getDerivationsInVerse(
              wordIndexes,
              currentVerse
            );

            derivations = derivations.concat(verseDerivations);
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
      let newState: stateProps = {
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

      let QuranText: quranProps[];
      let chapterNames: chapterProps[];
      QuranText = action.payload.allQuranText;
      chapterNames = action.payload.chapterNames;

      const getSearchIndexes = (
        verseText: string,
        verseKey: string,
        searchToken: string
      ) => {
        let verseIndexes: searchIndexProps[] = [];
        let verseWords = verseText.split(" ");
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

        if (searchDiacritics === true) {
        } else {
          processedVerseText = normalizeArabic(verse.versetext);
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

      let matchVerses: verseProps[] = [];
      let searchIndexes: searchIndexProps[] = [];

      if (state.searchScope === SEARCH_SCOPE.ALL_CHAPTERS) {
        QuranText.forEach((sura) => {
          sura.verses.forEach((verse) => {
            let result = searchVerse(
              verse,
              processedSearchString,
              state.searchIdentical,
              state.searchDiacritics
            );

            if (result !== false) {
              matchVerses.push(result.verse);
              searchIndexes = searchIndexes.concat(result.verseIndexes);
            }
          });
        });
      } else {
        if (state.selectedChapters.length > 1) {
          let searchChapters: string[] = [];

          state.selectedChapters.forEach((chapter) => {
            searchChapters.push(chapterNames[Number(chapter) - 1].name);
            QuranText[Number(chapter) - 1].verses.forEach((verse) => {
              let result = searchVerse(
                verse,
                processedSearchString,
                state.searchIdentical,
                state.searchDiacritics
              );

              if (result !== false) {
                matchVerses.push(result.verse);
                searchIndexes = searchIndexes.concat(result.verseIndexes);
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
            let result = searchVerse(
              verse,
              processedSearchString,
              state.searchIdentical,
              state.searchDiacritics
            );

            if (result !== false) {
              matchVerses.push(result.verse);
              searchIndexes = searchIndexes.concat(result.verseIndexes);
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
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

type QuranBrowserContent = {
  dispatchAction(type: QB_ACTIONS, payload: any): void;
};

const QuranBrowserContext = React.createContext<QuranBrowserContent>({
  dispatchAction: () => {},
});

function QuranBrowser() {
  const initialState: stateProps = {
    selectChapter: 1,
    selectedChapters: ["1"],
    searchString: "",
    searchingString: "",
    searchingChapters: [],
    searchResult: [],
    searchDiacritics: false,
    searchIdentical: false,
    searchError: false,
    selectedRootError: false,
    radioSearchMethod: SEARCH_METHOD.WORD,
    radioSearchingMethod: SEARCH_METHOD.WORD,
    searchIndexes: [],
    searchScope: SEARCH_SCOPE.ALL_CHAPTERS,
    searchingScope: SEARCH_SCOPE.ALL_CHAPTERS,
  };

  const [state, dispatch] = useReducer<Reducer<stateProps, reducerAction>>(
    reducer,
    initialState
  );

  const dispatchAction = (type: QB_ACTIONS, payload: any) =>
    dispatch({ type, payload });

  return (
    <QuranBrowserContext.Provider value={{ dispatchAction: dispatchAction }}>
      <div className="browser">
        <SearchPanel
          selectedChapters={state.selectedChapters}
          searchResult={state.searchResult}
          searchString={state.searchString}
          searchDiacritics={state.searchDiacritics}
          searchIdentical={state.searchIdentical}
          radioSearchMethod={state.radioSearchMethod}
          searchAllQuran={state.searchScope === SEARCH_SCOPE.ALL_CHAPTERS}
        />

        <DisplayPanel
          searchingChapters={state.searchingChapters}
          searchResult={state.searchResult}
          searchError={state.searchError}
          selectedRootError={state.selectedRootError}
          searchingString={state.searchingString}
          searchingScope={state.searchingScope}
          selectChapter={state.selectChapter}
          radioSearchingMethod={state.radioSearchingMethod}
          searchIndexes={state.searchIndexes}
        />
      </div>
    </QuranBrowserContext.Provider>
  );
}

export const useQuranBrowser = () => React.useContext(QuranBrowserContext);

export default QuranBrowser;
