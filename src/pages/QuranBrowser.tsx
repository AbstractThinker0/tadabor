import { useReducer } from "react";

import SearchPanel from "../components/QuranBrowser/SearchPanel";
import DisplayPanel from "../components/QuranBrowser/DisplayPanel";

import {
  qbStateProps,
  SEARCH_METHOD,
  SEARCH_SCOPE,
} from "../components/QuranBrowser/consts";
import qbReducer from "../reducers/qbReducer";

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
    scrollKey: "",
  };

  const [state, dispatchQbAction] = useReducer(qbReducer, initialState);

  return (
    <div className="browser">
      <SearchPanel
        selectedChapters={state.selectedChapters}
        searchResult={state.searchResult}
        searchString={state.searchString}
        searchDiacritics={state.searchDiacritics}
        searchIdentical={state.searchIdentical}
        searchMethod={state.searchMethod}
        searchAllQuran={state.searchScope === SEARCH_SCOPE.ALL_CHAPTERS}
        dispatchQbAction={dispatchQbAction}
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
        scrollKey={state.scrollKey}
        dispatchQbAction={dispatchQbAction}
      />
    </div>
  );
}

export default QuranBrowser;
