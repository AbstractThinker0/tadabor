import { useReducer } from "react";

import SearchPanel from "../components/QuranBrowser/SearchPanel";
import DisplayPanel from "../components/QuranBrowser/DisplayPanel";

import { qbStateProps, SEARCH_METHOD } from "../components/QuranBrowser/consts";
import qbReducer from "../reducers/qbReducer";
import useQuran from "../context/QuranContext";

function QuranBrowser() {
  const { chapterNames } = useQuran();

  const initialState: qbStateProps = {
    selectChapter: 1,
    selectedChapters: Array.from(chapterNames, (chapter) =>
      chapter.id.toString()
    ),
    searchString: "",
    searchingString: "",
    searchingChapters: [],
    searchResult: [],
    searchDiacritics: false,
    searchIdentical: false,
    searchError: false,
    searchMethod: SEARCH_METHOD.WORD,
    searchingMethod: SEARCH_METHOD.WORD,
    searchIndexes: [],
    scrollKey: "",
  };

  const [state, dispatchQbAction] = useReducer(qbReducer, initialState);

  return (
    <div className="browser">
      <SearchPanel
        currentChapter={state.selectChapter}
        searchResult={state.searchResult}
        searchString={state.searchString}
        searchDiacritics={state.searchDiacritics}
        searchIdentical={state.searchIdentical}
        searchMethod={state.searchMethod}
        dispatchQbAction={dispatchQbAction}
      />

      <DisplayPanel
        searchingChapters={state.searchingChapters}
        searchResult={state.searchResult}
        searchError={state.searchError}
        searchingString={state.searchingString}
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
