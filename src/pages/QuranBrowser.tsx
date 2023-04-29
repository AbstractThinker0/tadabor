import { useReducer, useContext, createContext, Dispatch } from "react";

import SearchPanel from "../components/QuranBrowser/SearchPanel";
import DisplayPanel from "../components/QuranBrowser/DisplayPanel";

import {
  qbStateProps,
  SEARCH_METHOD,
  SEARCH_SCOPE,
  qbActionsProps,
} from "../components/QuranBrowser/consts";
import qbReducer from "../reducers/qbReducer";

const QuranBrowserContext = createContext({} as Dispatch<qbActionsProps>);

function QuranBrowser() {
  const initialState: qbStateProps = {
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
    searchMethod: SEARCH_METHOD.WORD,
    searchingMethod: SEARCH_METHOD.WORD,
    searchIndexes: [],
    searchScope: SEARCH_SCOPE.ALL_CHAPTERS,
    searchingScope: SEARCH_SCOPE.ALL_CHAPTERS,
  };

  const [state, dispatchAction] = useReducer(qbReducer, initialState);

  return (
    <QuranBrowserContext.Provider value={dispatchAction}>
      <div className="browser">
        <SearchPanel
          selectedChapters={state.selectedChapters}
          searchResult={state.searchResult}
          searchString={state.searchString}
          searchDiacritics={state.searchDiacritics}
          searchIdentical={state.searchIdentical}
          searchMethod={state.searchMethod}
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
          searchingMethod={state.searchingMethod}
          searchIndexes={state.searchIndexes}
        />
      </div>
    </QuranBrowserContext.Provider>
  );
}

export const useQuranBrowser = () => useContext(QuranBrowserContext);

export default QuranBrowser;
