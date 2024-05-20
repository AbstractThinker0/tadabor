import { useReducer } from "react";

import useQuran from "@/context/useQuran";

import qbReducer from "@/components/Pages/QuranBrowser/qbReducer";
import {
  qbStateProps,
  SEARCH_METHOD,
} from "@/components/Pages/QuranBrowser/consts";
import SearchPanel from "@/components/Pages/QuranBrowser/SearchPanel";
import DisplayPanel from "@/components/Pages/QuranBrowser/DisplayPanel";

function QuranBrowser() {
  const quranService = useQuran();

  const initialState: qbStateProps = {
    selectChapter: 1,
    selectedChapters: Array.from(quranService.chapterNames, (chapter) =>
      chapter.id.toString()
    ),
    searchString: "",
    searchingString: "",
    searchingChapters: [],
    searchResult: [],
    searchDiacritics: false,
    searchIdentical: false,
    searchStart: false,
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
        searchStart={state.searchStart}
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
