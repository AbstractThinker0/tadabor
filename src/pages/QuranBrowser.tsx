import React, { useRef, useCallback, useReducer, Reducer } from "react";

import { findWord, normalize_text, onlySpaces } from "../util/util";

import useQuran, { verseProps, derivationProps } from "../context/QuranContext";

import SearchPanel from "../components/QuranBrowser/SearchPanel";
import DisplayPanel from "../components/QuranBrowser/DisplayPanel";

export enum ACTIONS {
  SET_CHAPTER = "dispatchSetChapter",
  SET_CHAPTERS = "dispatchSetChapters",
  SET_SEARCH_STRING = "dispatchSetSearchString",
  SET_SEARCHING_STRING = "dispatchSetSearchingString",
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
}

interface reducerAction {
  type: ACTIONS | string;
  payload: any;
}

interface stateProps {
  selectChapter: number;
  selectedChapters: string[];
  searchString: string;
  searchingString: string;
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
}

function reducer(state: stateProps, action: reducerAction): stateProps {
  // ...
  switch (action.type) {
    case ACTIONS.SET_CHAPTER: {
      return { ...state, selectChapter: action.payload };
    }
    case ACTIONS.SET_CHAPTERS: {
      return { ...state, selectedChapters: action.payload };
    }
    case ACTIONS.SET_SEARCH_STRING: {
      return { ...state, searchString: action.payload };
    }
    case ACTIONS.SET_SEARCHING_STRING: {
      return { ...state, searchingString: action.payload };
    }
    case ACTIONS.SET_SEARCH_RESULT: {
      return { ...state, searchResult: action.payload };
    }
    case ACTIONS.SET_SEARCH_ALLQURAN: {
      return { ...state, searchAllQuran: action.payload };
    }
    case ACTIONS.SET_SEARCHING_ALLQURAN: {
      return { ...state, searchingAllQuran: action.payload };
    }
    case ACTIONS.SET_SEARCH_MULTIPLE: {
      return { ...state, searchMultipleChapters: action.payload };
    }
    case ACTIONS.SET_SEARCH_DIACRITICS: {
      return { ...state, searchDiacritics: action.payload };
    }
    case ACTIONS.SET_SEARCH_IDENTICAL: {
      return { ...state, searchIdentical: action.payload };
    }
    case ACTIONS.SET_SEARCH_ERROR: {
      return { ...state, searchError: action.payload };
    }
    case ACTIONS.SET_SELECTED_ROOT_ERROR: {
      return { ...state, selectedRootError: action.payload };
    }
    case ACTIONS.SET_RADIO_SEARCH: {
      return { ...state, radioSearchMethod: action.payload };
    }
    case ACTIONS.SET_RADIO_SEARCHING: {
      return { ...state, radioSearchingMethod: action.payload };
    }
    case ACTIONS.SET_ROOT_DERIVATIONS: {
      return { ...state, rootDerivations: action.payload };
    }
  }
  throw Error("Unknown action: " + action.type);
}

type QuranBrowserContent = {
  dispatch: React.Dispatch<reducerAction>;
  dispatchAction(type: ACTIONS, payload: any): void;
};

const QuranBrowserContext = React.createContext<QuranBrowserContent>({
  dispatch: () => {},
  dispatchAction: () => {},
});

function QuranBrowser() {
  const { allQuranText, absoluteQuran, chapterNames, quranRoots } = useQuran();

  const refListChapters = useRef<HTMLSelectElement>(null);
  const scrollKey = useRef<string | null>(null);

  const initialState: stateProps = {
    selectChapter: 1,
    selectedChapters: ["1"],
    searchString: "",
    searchingString: "",
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
  };

  const [state, dispatch] = useReducer<Reducer<stateProps, reducerAction>>(
    reducer,
    initialState
  );

  const dispatchAction = (type: ACTIONS, payload: any) =>
    dispatch({ type, payload });

  const clearPreviousSearch = useCallback(() => {
    dispatchAction(ACTIONS.SET_SEARCH_ERROR, false);
    dispatchAction(ACTIONS.SET_SELECTED_ROOT_ERROR, false);
    dispatchAction(ACTIONS.SET_SEARCH_MULTIPLE, false);
    dispatchAction(ACTIONS.SET_SEARCH_RESULT, []);
    dispatchAction(ACTIONS.SET_ROOT_DERIVATIONS, []);
  }, []);

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    clearPreviousSearch();

    dispatchAction(ACTIONS.SET_SEARCHING_STRING, state.searchString);

    dispatchAction(ACTIONS.SET_RADIO_SEARCHING, state.radioSearchMethod);

    function handleSearchByWord() {
      if (onlySpaces(state.searchString)) {
        dispatchAction(ACTIONS.SET_SEARCH_ERROR, true);
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
        dispatchAction(ACTIONS.SET_SEARCHING_ALLQURAN, true);
        allChaptersMatches();
      } else {
        dispatchAction(ACTIONS.SET_SEARCHING_ALLQURAN, false);

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
        dispatchAction(ACTIONS.SET_SEARCH_MULTIPLE, true);
        state.selectedChapters.forEach((chapter) => {
          allQuranText[Number(chapter) - 1].verses.forEach((verse) => {
            checkVerseMatch(verse);
          });
        });
      }

      if (matchVerses.length === 0) {
        dispatchAction(ACTIONS.SET_SEARCH_ERROR, true);
      } else {
        dispatchAction(ACTIONS.SET_SEARCH_RESULT, matchVerses);
      }
    }

    function handleSearchByRoot() {
      if (onlySpaces(state.searchString)) {
        dispatchAction(ACTIONS.SET_SELECTED_ROOT_ERROR, true);
        return;
      }

      let rootTarget = quranRoots.find(
        (root) => root.name === state.searchString
      );

      if (rootTarget === undefined) {
        dispatchAction(ACTIONS.SET_SELECTED_ROOT_ERROR, true);
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
        dispatchAction(ACTIONS.SET_SEARCHING_ALLQURAN, true);
      } else {
        dispatchAction(ACTIONS.SET_SEARCHING_ALLQURAN, false);

        if (state.selectedChapters.length > 1) {
          dispatchAction(ACTIONS.SET_SEARCH_MULTIPLE, true);
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
        dispatchAction(ACTIONS.SET_SELECTED_ROOT_ERROR, true);
      } else {
        dispatchAction(ACTIONS.SET_SEARCH_RESULT, matchVerses);
        dispatchAction(ACTIONS.SET_ROOT_DERIVATIONS, derivations);
      }
    }

    if (state.radioSearchMethod === "optionWordSearch") {
      handleSearchByWord();
    } else if (state.radioSearchMethod === "optionRootSearch") {
      handleSearchByRoot();
    }
  }

  const memoHandleSearchSubmit = useCallback(handleSearchSubmit, [
    absoluteQuran,
    allQuranText,
    chapterNames,
    quranRoots,
    state.searchAllQuran,
    state.searchDiacritics,
    state.searchIdentical,
    state.selectChapter,
    state.selectedChapters,
    state.radioSearchMethod,
    state.searchString,
    clearPreviousSearch,
  ]);

  function gotoChapter(chapter: string) {
    clearPreviousSearch();

    dispatchAction(ACTIONS.SET_CHAPTER, Number(chapter));
    dispatchAction(ACTIONS.SET_CHAPTERS, [chapter]);
  }

  const memoGotoChapter = useCallback(gotoChapter, [clearPreviousSearch]);

  function handleSelectionListChapters(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!event.target.value) return;

    scrollKey.current = null;

    let chapter = event.target.value;

    if (event.target.selectedOptions.length === 1) {
      memoGotoChapter(chapter);
    } else {
      dispatchAction(
        ACTIONS.SET_CHAPTERS,
        Array.from(event.target.selectedOptions, (option) => option.value)
      );
    }
  }

  const memoHandleSelectionListChapters = useCallback(
    handleSelectionListChapters,
    [memoGotoChapter]
  );

  return (
    <QuranBrowserContext.Provider
      value={{ dispatch: dispatch, dispatchAction: dispatchAction }}
    >
      <div className="browser">
        <SearchPanel
          refListChapters={refListChapters}
          selectedChapters={state.selectedChapters}
          searchResult={state.searchResult}
          searchString={state.searchString}
          searchDiacritics={state.searchDiacritics}
          searchIdentical={state.searchIdentical}
          radioSearchMethod={state.radioSearchMethod}
          searchAllQuran={state.searchAllQuran}
          memoHandleSearchSubmit={memoHandleSearchSubmit}
          memoHandleSelectionListChapters={memoHandleSelectionListChapters}
        />

        <DisplayPanel
          refListChapters={refListChapters}
          scrollKey={scrollKey}
          searchResult={state.searchResult}
          searchError={state.searchError}
          selectedRootError={state.selectedRootError}
          searchingString={state.searchingString}
          searchingAllQuran={state.searchingAllQuran}
          selectChapter={state.selectChapter}
          radioSearchingMethod={state.radioSearchingMethod}
          searchMultipleChapters={state.searchMultipleChapters}
          rootDerivations={state.rootDerivations}
          memoGotoChapter={memoGotoChapter}
        />
      </div>
    </QuranBrowserContext.Provider>
  );
}

export const useQuranBrowser = () => React.useContext(QuranBrowserContext);

export default QuranBrowser;
