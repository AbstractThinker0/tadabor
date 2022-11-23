import React, {
  useState,
  useRef,
  useCallback,
  useReducer,
  Reducer,
} from "react";

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
  }
  throw Error("Unknown action: " + action.type);
}

type QuranBrowserContent = {
  dispatch: React.Dispatch<reducerAction>;
};

const QuranBrowserContext = React.createContext<QuranBrowserContent>({
  dispatch: () => {},
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
  };

  const [state, dispatch] = useReducer<Reducer<stateProps, reducerAction>>(
    reducer,
    initialState
  );

  const [radioSearchMethod, setRadioSearchMethod] =
    useState("optionWordSearch");
  const [radioSearchingMethod, setRadioSearchingMethod] =
    useState("optionWordSearch");

  const [rootDerivations, setRootDerivations] = useState<derivationProps[]>([]);

  const clearPreviousSearch = () => {
    dispatch({ type: ACTIONS.SET_SEARCH_ERROR, payload: false });
    dispatch({ type: ACTIONS.SET_SELECTED_ROOT_ERROR, payload: false });
    dispatch({ type: ACTIONS.SET_SEARCH_MULTIPLE, payload: false });
    dispatch({ type: ACTIONS.SET_SEARCH_RESULT, payload: [] });
    setRootDerivations([]);
  };

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    clearPreviousSearch();
    dispatch({
      type: ACTIONS.SET_SEARCHING_STRING,
      payload: state.searchString,
    });
    setRadioSearchingMethod(radioSearchMethod);

    function handleSearchByWord() {
      if (onlySpaces(state.searchString)) {
        dispatch({ type: ACTIONS.SET_SEARCH_ERROR, payload: true });
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
        dispatch({ type: ACTIONS.SET_SEARCHING_ALLQURAN, payload: true });
        allChaptersMatches();
      } else {
        dispatch({ type: ACTIONS.SET_SEARCHING_ALLQURAN, payload: false });

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
        dispatch({ type: ACTIONS.SET_SEARCH_MULTIPLE, payload: true });
        state.selectedChapters.forEach((chapter) => {
          allQuranText[Number(chapter) - 1].verses.forEach((verse) => {
            checkVerseMatch(verse);
          });
        });
      }

      if (matchVerses.length === 0) {
        dispatch({ type: ACTIONS.SET_SEARCH_ERROR, payload: true });
      } else {
        dispatch({ type: ACTIONS.SET_SEARCH_RESULT, payload: matchVerses });
      }
    }

    function handleSearchByRoot() {
      if (onlySpaces(state.searchString)) {
        dispatch({ type: ACTIONS.SET_SELECTED_ROOT_ERROR, payload: true });
        return;
      }

      let rootTarget = quranRoots.find(
        (root) => root.name === state.searchString
      );

      if (rootTarget === undefined) {
        dispatch({ type: ACTIONS.SET_SELECTED_ROOT_ERROR, payload: true });
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
        dispatch({ type: ACTIONS.SET_SEARCHING_ALLQURAN, payload: true });
      } else {
        dispatch({ type: ACTIONS.SET_SEARCHING_ALLQURAN, payload: false });

        if (state.selectedChapters.length > 1) {
          dispatch({ type: ACTIONS.SET_SEARCH_MULTIPLE, payload: true });
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
        dispatch({ type: ACTIONS.SET_SELECTED_ROOT_ERROR, payload: true });
      } else {
        dispatch({ type: ACTIONS.SET_SEARCH_RESULT, payload: matchVerses });
        setRootDerivations(derivations);
      }
    }

    if (radioSearchMethod === "optionWordSearch") {
      handleSearchByWord();
    } else if (radioSearchMethod === "optionRootSearch") {
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
    radioSearchMethod,
    state.searchString,
  ]);

  function gotoChapter(chapter: string) {
    clearPreviousSearch();

    dispatch({ type: ACTIONS.SET_CHAPTER, payload: Number(chapter) });
    dispatch({ type: ACTIONS.SET_CHAPTERS, payload: [chapter] });
  }

  const memoGotoChapter = useCallback(gotoChapter, []);

  function handleSelectionListChapters(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!event.target.value) return;

    scrollKey.current = null;

    let chapter = event.target.value;

    if (event.target.selectedOptions.length === 1) {
      memoGotoChapter(chapter);
    } else {
      dispatch({
        type: ACTIONS.SET_CHAPTERS,
        payload: Array.from(
          event.target.selectedOptions,
          (option) => option.value
        ),
      });
    }
  }

  const memoHandleSelectionListChapters = useCallback(
    handleSelectionListChapters,
    [memoGotoChapter]
  );

  return (
    <QuranBrowserContext.Provider value={{ dispatch: dispatch }}>
      <div className="browser">
        <SearchPanel
          refListChapters={refListChapters}
          selectedChapters={state.selectedChapters}
          searchResult={state.searchResult}
          searchString={state.searchString}
          searchDiacritics={state.searchDiacritics}
          searchIdentical={state.searchIdentical}
          radioSearchMethod={radioSearchMethod}
          searchAllQuran={state.searchAllQuran}
          setRadioSearchMethod={setRadioSearchMethod}
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
          radioSearchingMethod={radioSearchingMethod}
          searchMultipleChapters={state.searchMultipleChapters}
          rootDerivations={rootDerivations}
          memoGotoChapter={memoGotoChapter}
        />
      </div>
    </QuranBrowserContext.Provider>
  );
}

export const useQuranBrowser = () => React.useContext(QuranBrowserContext);

export default QuranBrowser;
