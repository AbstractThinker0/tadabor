import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import useQuran from "@/context/useQuran";

import SelectionListChapters from "@/components/Pages/QuranBrowser/SelectionListChapters";
import SelectionListRoots from "@/components/Pages/QuranBrowser/SelectionListRoots";

import { SEARCH_METHOD } from "@/components/Pages/QuranBrowser/consts";

import {
  Box,
  Flex,
  HStack,
  Radio,
  RadioGroup,
  Checkbox,
  Wrap,
  FormControl,
  Button,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";
import { IconSearch } from "@/components/Generic/Icons";

const SearchPanel = () => {
  const quranService = useQuran();
  const { t } = useTranslation();

  const searchMethod = useAppSelector((state) => state.qbPage.searchMethod);

  const searchDiacritics = useAppSelector(
    (state) => state.qbPage.searchDiacritics
  );

  const searchIdentical = useAppSelector(
    (state) => state.qbPage.searchIdentical
  );

  const searchStart = useAppSelector((state) => state.qbPage.searchStart);

  const searchString = useAppSelector((state) => state.qbPage.searchString);

  const dispatch = useAppDispatch();

  const isRootSearch = searchMethod === SEARCH_METHOD.ROOT ? true : false;

  const setSearchDiacritics = (status: boolean) => {
    dispatch(qbPageActions.setSearchDiacritics(status));
  };

  const setSearchIdentical = (status: boolean) => {
    dispatch(qbPageActions.setSearchIdentical(status));
  };

  const setSearchStart = (status: boolean) => {
    dispatch(qbPageActions.setSearchStart(status));
  };

  const setSearchMethod = (method: SEARCH_METHOD) => {
    dispatch(qbPageActions.setSearchMethod(method));
  };

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

  const onChangeDiacritics = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDiacritics(e.target.checked);
  };

  const onChangeIdentical = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchIdentical(e.target.checked);
  };

  const onChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStart(e.target.checked);
  };

  return (
    <Flex
      flexDirection="column"
      fontSize="medium"
      paddingTop="5px"
      paddingLeft="min(0.5vw, 10px)"
      paddingRight="min(0.5vw, 10px)"
    >
      <SelectionListChapters handleCurrentChapter={handleCurrentChapter} />
      <Box paddingInlineStart="6px">
        <RadioSearchMethod
          searchMethod={searchMethod}
          setSearchMethod={setSearchMethod}
        />
        <div>
          <Checkbox
            isChecked={searchDiacritics}
            onChange={onChangeDiacritics}
            isDisabled={isRootSearch}
          >
            {t("search_diacritics")}
          </Checkbox>
          <Wrap>
            <Checkbox
              isChecked={searchIdentical}
              onChange={onChangeIdentical}
              isDisabled={isRootSearch}
            >
              {t("search_identical")}
            </Checkbox>
            <Checkbox
              isChecked={searchStart}
              onChange={onChangeStart}
              isDisabled={isRootSearch}
            >
              {t("search_start")}
            </Checkbox>
          </Wrap>
        </div>
      </Box>
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

interface RadioSearchMethodProps {
  searchMethod: string;
  setSearchMethod: (method: SEARCH_METHOD) => void;
}

const RadioSearchMethod = ({
  searchMethod,
  setSearchMethod,
}: RadioSearchMethodProps) => {
  const { t } = useTranslation();

  const onChangeRadio = (value: string) => {
    setSearchMethod(value as SEARCH_METHOD);
  };

  return (
    <Flex flexWrap="wrap">
      <Box fontWeight="bold" paddingInlineEnd="5px">
        {t("search_method")}
      </Box>
      <RadioGroup onChange={onChangeRadio} value={searchMethod}>
        <HStack>
          <Radio value={SEARCH_METHOD.ROOT}>{t("search_root")}</Radio>
          <Radio value={SEARCH_METHOD.WORD}>{t("search_word")}</Radio>
        </HStack>
      </RadioGroup>
    </Flex>
  );
};

interface FormWordSearchProps {
  onSearchSubmit: () => void;
  searchString: string;
}

const FormWordSearch = ({
  onSearchSubmit,
  searchString,
}: FormWordSearchProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const searchStringHandle = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(qbPageActions.setSearchString(event.target.value));
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    onSearchSubmit();
  };

  return (
    <FormControl as="form" role="search" onSubmit={handleSearchSubmit}>
      <VStack>
        <Textarea
          required
          dir="rtl"
          aria-label="Search"
          onChange={searchStringHandle}
          rows={1}
          value={searchString}
          bgColor="white"
        />
        <Button
          leftIcon={<IconSearch />}
          colorScheme="green"
          variant="outline"
          type="submit"
        >
          {t("search_button")}
        </Button>
      </VStack>
    </FormControl>
  );
};

const SearchSuccessComponent = () => {
  const { t } = useTranslation();
  const searchResult = useAppSelector((state) => state.qbPage.searchResult);

  if (searchResult.length === 0) return null;

  return (
    <Text fontWeight="bold" color="green">{`${t("search_count")} ${
      searchResult.length
    }`}</Text>
  );
};

export default SearchPanel;
