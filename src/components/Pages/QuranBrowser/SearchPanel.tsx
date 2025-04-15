import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

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

  const searchMethod = useAppSelector((state) => state.qbPage.searchMethod);

  const searchString = useAppSelector((state) => state.qbPage.searchString);

  const dispatch = useAppDispatch();

  const isRootSearch = searchMethod === SEARCH_METHOD.ROOT ? true : false;

  const onSearchSubmit = () => {
    if (isRootSearch) {
      dispatch(qbPageActions.submitRootSearch({ quranInstance: quranService }));
    } else {
      dispatch(qbPageActions.submitWordSearch({ quranInstance: quranService }));
    }
  };

  const handleCurrentChapter = (chapterID: number) => {
    dispatch(qbPageActions.gotoChapter(chapterID.toString()));
  };

  return (
    <Flex
      flexDirection="column"
      fontSize="medium"
      pt={2}
      paddingLeft="min(0.5vw, 10px)"
      paddingRight="min(0.5vw, 10px)"
    >
      <SelectionListChapters handleCurrentChapter={handleCurrentChapter} />
      <SearchOptions />
      <FormWordSearch
        onSearchSubmit={onSearchSubmit}
        searchString={searchString}
      />
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
