import React, { useReducer, Reducer } from "react";

import { findArabicWord, normalizeArabic, onlySpaces } from "../util/util";

import {
  verseProps,
  quranProps,
  rootProps,
  chapterProps,
} from "../context/QuranContext";

import SearchPanel from "../components/QuranBrowser/SearchPanel";
import DisplayPanel from "../components/QuranBrowser/DisplayPanel";

export interface searchIndexProps {
  name: string;
  key: string;
  text: string;
  wordIndex: string;
}

export enum QB_ACTIONS {
  SET_CHAPTER = "dispatchSetChapter",
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
  SEARCH_SUBMIT = "dispatchSetSearchSubmit",
  GOTO_CHAPTER = "dispatchGotoChapter",
}

export enum SEARCH_SCOPE {
  ALL_CHAPTERS = "searchAllChapters",
  MULTIPLE_CHAPTERS = "searchMultipleChapters",
  SINGLE_CHAPTER = "searchSingleChapter",
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
    case QB_ACTIONS.SET_CHAPTER: {
      return { ...state, selectChapter: action.payload };
    }
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
    case QB_ACTIONS.SEARCH_SUBMIT: {
      let newState: stateProps = {
        ...state,
        searchError: false,
        selectedRootError: false,
        searchResult: [],
        searchIndexes: [],
        searchingString: state.searchString,
        radioSearchingMethod: state.radioSearchMethod,
      };

      const handleSearchByWord = (
        allQuranText: quranProps[],
        chapterNames: chapterProps[]
      ) => {
        if (onlySpaces(state.searchString)) {
          newState = { ...newState, searchError: true };
          return;
        }

        let matchVerses: verseProps[] = [];

        let normal_search = (
          state.searchDiacritics
            ? state.searchString
            : normalizeArabic(state.searchString)
        ).trim();

        let searchIndexes: searchIndexProps[] = [];

        const fillMatches = (
          verseText: string,
          verseKey: string,
          searchToken: string
        ) => {
          let verseWords = verseText.split(" ");
          verseWords.forEach((word, index) => {
            if (word.includes(searchToken)) {
              searchIndexes.push({
                name: searchToken,
                key: verseKey,
                text: verseWords[index],
                wordIndex: index.toString(),
              });
            }
          });
        };

        const checkVerseMatch = (verse: verseProps) => {
          let normal_text = state.searchDiacritics
            ? verse.versetext
            : normalizeArabic(verse.versetext);

          if (state.searchIdentical) {
            if (findArabicWord(normal_search, normal_text)) {
              matchVerses.push(verse);
              fillMatches(normal_text, verse.key, normal_search);
            }
          } else {
            if (normal_text.search(normal_search) !== -1) {
              matchVerses.push(verse);
              fillMatches(normal_text, verse.key, normal_search);
            }
          }
        };

        if (state.searchScope === SEARCH_SCOPE.ALL_CHAPTERS) {
          newState = { ...newState, searchingScope: SEARCH_SCOPE.ALL_CHAPTERS };
          allChaptersMatches();
        } else {
          if (state.selectedChapters.length > 1) {
            multipleChaptersMatches();
          } else {
            oneChapterMatches();
          }
        }

        function allChaptersMatches() {
          allQuranText.forEach((sura) => {
            sura.verses.forEach((verse) => {
              checkVerseMatch(verse);
            });
          });
        }

        function oneChapterMatches() {
          let currentChapter = allQuranText[state.selectChapter - 1].verses;
          currentChapter.forEach((verse) => {
            checkVerseMatch(verse);
          });

          newState = {
            ...newState,
            searchScope: SEARCH_SCOPE.SINGLE_CHAPTER,
            searchingScope: SEARCH_SCOPE.SINGLE_CHAPTER,
          };
        }

        function multipleChaptersMatches() {
          let searchChapters: string[] = [];

          state.selectedChapters.forEach((chapter) => {
            searchChapters.push(chapterNames[Number(chapter) - 1].name);
            allQuranText[Number(chapter) - 1].verses.forEach((verse) => {
              checkVerseMatch(verse);
            });
          });

          newState = {
            ...newState,
            searchScope: SEARCH_SCOPE.MULTIPLE_CHAPTERS,
            searchingScope: SEARCH_SCOPE.MULTIPLE_CHAPTERS,
            searchingChapters: searchChapters,
          };
        }

        if (matchVerses.length === 0) {
          newState = { ...newState, searchError: true };
        } else {
          newState = {
            ...newState,
            searchResult: matchVerses,
            searchIndexes: searchIndexes,
          };
        }
      };

      const handleSearchByRoot = (
        quranRoots: rootProps[],
        chapterNames: chapterProps[],
        absoluteQuran: verseProps[]
      ) => {
        if (onlySpaces(state.searchString)) {
          newState = { ...newState, selectedRootError: true };
          return;
        }

        let rootTarget = quranRoots.find(
          (root) => root.name === state.searchString
        );

        if (rootTarget === undefined) {
          newState = { ...newState, selectedRootError: true };
          return;
        }

        let occurencesArray = rootTarget.occurences;

        let matchVerses: verseProps[] = [];
        let derivations: searchIndexProps[] = [];

        const fillDerivationsArray = (
          wordIndexes: string[],
          verseWords: string[],
          currentVerse: verseProps
        ) => {
          wordIndexes.forEach((word) => {
            derivations.push({
              name: verseWords[Number(word) - 1],
              key: currentVerse.key,
              text:
                chapterNames[Number(currentVerse.suraid) - 1].name +
                ":" +
                currentVerse.verseid,
              wordIndex: word,
            });
          });
        };

        if (state.searchScope === SEARCH_SCOPE.ALL_CHAPTERS) {
          newState = { ...newState, searchingScope: SEARCH_SCOPE.ALL_CHAPTERS };
        } else {
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
        }

        // ابى	13	40:9;288:17,74;1242:13;1266:7;1832:3;2117:10;2127:20;2216:9;2403:6;2463:9;2904:5;3604:8
        // occurences array have the verserank:index1,index2...etc format
        occurencesArray.forEach((item) => {
          let info = item.split(":");
          let currentVerse = absoluteQuran[Number(info[0])];

          if (
            state.selectedChapters.includes(currentVerse.suraid) ||
            state.searchScope === SEARCH_SCOPE.ALL_CHAPTERS
          ) {
            let verseWords = currentVerse.versetext.split(" ");

            let wordIndexes = info[1].split(",");

            fillDerivationsArray(wordIndexes, verseWords, currentVerse);
            matchVerses.push(currentVerse);
          }
        });

        if (matchVerses.length === 0) {
          newState = { ...newState, selectedRootError: true };
        } else {
          newState = { ...newState, searchResult: matchVerses };
          newState = { ...newState, searchIndexes: derivations };
        }
      };

      if (state.radioSearchMethod === "optionWordSearch") {
        handleSearchByWord(
          action.payload.allQuranText,
          action.payload.chapterNames
        );
      } else if (state.radioSearchMethod === "optionRootSearch") {
        handleSearchByRoot(
          action.payload.quranRoots,
          action.payload.chapterNames,
          action.payload.absoluteQuran
        );
      }

      return { ...newState };
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
    radioSearchMethod: "optionWordSearch",
    radioSearchingMethod: "optionWordSearch",
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
