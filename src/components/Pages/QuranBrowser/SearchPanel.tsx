import { useQuranBrowserPageStore } from "@/store/pages/quranBrowserPage";

import useQuran from "@/context/useQuran";

import SelectionListChapters from "@/components/Pages/QuranBrowser/SelectionListChapters";
import SelectionListRoots from "@/components/Pages/QuranBrowser/SelectionListRoots";

import {
  SearchOptions,
  FormWordSearch,
  SearchSuccessComponent,
} from "@/components/Pages/QuranBrowser/SearchPanelComponents";

import { SEARCH_METHOD } from "@/components/Pages/QuranBrowser/consts";

import { Flex } from "@chakra-ui/react";

const SearchPanel = () => {
  const quranService = useQuran();

  const searchMethod = useQuranBrowserPageStore((state) => state.searchMethod);

  const searchString = useQuranBrowserPageStore((state) => state.searchString);

  const submitRootSearch = useQuranBrowserPageStore(
    (state) => state.submitRootSearch
  );
  const submitWordSearch = useQuranBrowserPageStore(
    (state) => state.submitWordSearch
  );
  const gotoChapter = useQuranBrowserPageStore((state) => state.gotoChapter);

  const isRootSearch = searchMethod === SEARCH_METHOD.ROOT ? true : false;

  const onSearchSubmit = () => {
    if (isRootSearch) {
      submitRootSearch(quranService);
    } else {
      submitWordSearch(quranService);
    }
  };

  const handleCurrentChapter = (chapterID: number) => {
    gotoChapter(chapterID.toString());
  };

  return (
    <Flex
      flexDirection="column"
      fontSize="medium"
      pt={2}
      paddingStart="min(0.5vw, 10px)"
    >
      <SelectionListChapters handleCurrentChapter={handleCurrentChapter} />

      <Flex
        flexDir={"column"}
        borderStyle={"solid"}
        borderWidth={"1px"}
        borderRadius={"md"}
        boxShadow={"sm"}
        padding={"5px"}
        marginBottom={"8px"}
      >
        <SearchOptions />
        <FormWordSearch
          onSearchSubmit={onSearchSubmit}
          searchString={searchString}
        />
      </Flex>
      <SelectionListRoots
        isDisabled={!isRootSearch}
        searchString={searchString}
      />
      <SearchSuccessComponent />
    </Flex>
  );
};

SearchPanel.displayName = "SearchPanel";

export default SearchPanel;
