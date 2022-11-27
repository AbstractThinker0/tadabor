import React, { useReducer, Reducer } from "react";

import { findWord, normalize_text, onlySpaces } from "../util/util";

import {
  verseProps,
  derivationProps,
  quranProps,
  rootProps,
  chapterProps,
} from "../context/QuranContext";

import SearchPanel from "../components/QuranBrowser/SearchPanel";
import DisplayPanel from "../components/QuranBrowser/DisplayPanel";

export enum QB_ACTIONS {
  SET_CHAPTER = "dispatchSetChapter",
  SET_CHAPTERS = "dispatchSetChapters",
  SET_SEARCH_STRING = "dispatchSetSearchString",
  SET_SEARCHING_STRING = "dispatchSetSearchingString",
  SET_SEARCHING_CHAPTERS = "dispatchSetSearchingChapters",
  SET_SEARCH_RESULT = "dispatchSetSearchResult",
  SET_SEARCH_ALLQURAN = "dispatchSetSearchAllQuran",
  SET_SEARCHING_ALLQURAN = "dispatchSetSearchingAllQuran",
  SET_SEARCH_MULTIPLE = "dispatchSetSearchMultipleChapters",
  SET_SEARCH_DIACRITICS = "dispatchSetSearchDiacritics",
  SET_SEARCH_IDENTICAL = "dispatchSetSearchIdentical",
  SET_SEARCH_ERROR = "dispatchSetSearchError",
  SET_SELECTED_ROOT_ERROR = "dispatchSetSelectedRootError",
  SET_RADIO_SEARCH = "dispatchSetRadioSearchMethod",
  SET_RADIO_SEARCHING = "dispatchSetRadioSearchingMethod",
  SET_ROOT_DERIVATIONS = "dispatchSetRootDerivations",
  SET_SCROLL_KEY = "dispatchSetScrollKey",
  SEARCH_SUBMIT = "dispatchSetSearchSubmit",
  GOTO_CHAPTER = "dispatchGotoChapter",
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
  searchAllQuran: boolean;
  searchingAllQuran: boolean;
  searchMultipleChapters: boolean;
  searchDiacritics: boolean;
  searchIdentical: boolean;
  searchError: boolean;
  selectedRootError: boolean;
  radioSearchMethod: string;
  radioSearchingMethod: string;
  rootDerivations: derivationProps[];
  scrollKey: null | string;
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
    case QB_ACTIONS.SET_SEARCH_ALLQURAN: {
      return { ...state, searchAllQuran: action.payload };
    }
    case QB_ACTIONS.SET_SEARCHING_ALLQURAN: {
      return { ...state, searchingAllQuran: action.payload };
    }
    case QB_ACTIONS.SET_SEARCH_MULTIPLE: {
      return { ...state, searchMultipleChapters: action.payload };
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
    case QB_ACTIONS.SET_ROOT_DERIVATIONS: {
      return { ...state, rootDerivations: action.payload };
    }
    case QB_ACTIONS.SET_SCROLL_KEY: {
      return { ...state, scrollKey: action.payload };
    }
    case QB_ACTIONS.SEARCH_SUBMIT: {
      let newState: stateProps = {
        ...state,
        searchError: false,
        selectedRootError: false,
        searchMultipleChapters: false,
        searchResult: [],
        rootDerivations: [],
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
            : normalize_text(state.searchString)
        ).trim();

        const checkVerseMatch = (verse: verseProps) => {
          let normal_text = state.searchDiacritics
            ? verse.versetext
            : normalize_text(verse.versetext);

          if (state.searchIdentical) {
            if (findWord(normal_search, normal_text)) {
              matchVerses.push(verse);
            }
          } else {
            if (normal_text.search(normal_search) !== -1) {
              matchVerses.push(verse);
            }
          }
        };

        if (state.searchAllQuran) {
          newState = { ...newState, searchingAllQuran: true };
          allChaptersMatches();
        } else {
          newState = { ...newState, searchingAllQuran: false };

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
            searchMultipleChapters: true,
            searchingChapters: searchChapters,
          };
        }

        if (matchVerses.length === 0) {
          newState = { ...newState, searchError: true };
        } else {
          newState = { ...newState, searchResult: matchVerses };
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
        let derivations: derivationProps[] = [];

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

        if (state.searchAllQuran) {
          newState = { ...newState, searchingAllQuran: true };
        } else {
          newState = { ...newState, searchingAllQuran: false };

          if (state.selectedChapters.length > 1) {
            let searchChapters: string[] = [];

            state.selectedChapters.forEach((chapter) => {
              searchChapters.push(chapterNames[Number(chapter) - 1].name);
            });

            newState = {
              ...newState,
              searchMultipleChapters: true,
              searchingChapters: searchChapters,
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
            state.searchAllQuran
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
          newState = { ...newState, rootDerivations: derivations };
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
        searchMultipleChapters: false,
        searchResult: [],
        rootDerivations: [],
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
    searchAllQuran: true,
    searchingAllQuran: true,
    searchMultipleChapters: false,
    searchDiacritics: false,
    searchIdentical: false,
    searchError: false,
    selectedRootError: false,
    radioSearchMethod: "optionWordSearch",
    radioSearchingMethod: "optionWordSearch",
    rootDerivations: [],
    scrollKey: null,
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
          searchAllQuran={state.searchAllQuran}
        />

        <DisplayPanel
          scrollKey={state.scrollKey}
          searchingChapters={state.searchingChapters}
          searchResult={state.searchResult}
          searchError={state.searchError}
          selectedRootError={state.selectedRootError}
          searchingString={state.searchingString}
          searchingAllQuran={state.searchingAllQuran}
          selectChapter={state.selectChapter}
          radioSearchingMethod={state.radioSearchingMethod}
          searchMultipleChapters={state.searchMultipleChapters}
          rootDerivations={state.rootDerivations}
        />
      </div>
    </QuranBrowserContext.Provider>
  );
}

export const useQuranBrowser = () => React.useContext(QuranBrowserContext);

export default QuranBrowser;
