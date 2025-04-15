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
  Wrap,
  Button,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";

import { Radio, RadioGroup } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox";

import { MdSearch } from "react-icons/md";

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

const SearchOptions = () => {
  const { t } = useTranslation();

  const searchMethod = useAppSelector((state) => state.qbPage.searchMethod);

  const searchDiacritics = useAppSelector(
    (state) => state.qbPage.searchDiacritics
  );

  const searchIdentical = useAppSelector(
    (state) => state.qbPage.searchIdentical
  );

  const searchStart = useAppSelector((state) => state.qbPage.searchStart);

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

  const onChangeDiacritics = (checked: boolean) => {
    setSearchDiacritics(checked);
  };

  const onChangeIdentical = (checked: boolean) => {
    setSearchIdentical(checked);
  };

  const onChangeStart = (checked: boolean) => {
    setSearchStart(checked);
  };

  return (
    <Box paddingInlineStart="6px">
      <RadioSearchMethod
        searchMethod={searchMethod}
        setSearchMethod={setSearchMethod}
      />
      <Box>
        <Checkbox
          colorPalette={"blue"}
          variant={"subtle"}
          checked={searchDiacritics}
          onCheckedChange={(e) => onChangeDiacritics(!!e.checked)}
          disabled={isRootSearch}
        >
          {t("search_diacritics")}
        </Checkbox>
        <Wrap>
          <Checkbox
            colorPalette={"blue"}
            variant={"subtle"}
            checked={searchIdentical}
            onCheckedChange={(e) => onChangeIdentical(!!e.checked)}
            disabled={isRootSearch}
          >
            {t("search_identical")}
          </Checkbox>
          <Checkbox
            colorPalette={"blue"}
            variant={"subtle"}
            checked={searchStart}
            onCheckedChange={(e) => onChangeStart(!!e.checked)}
            disabled={isRootSearch}
          >
            {t("search_start")}
          </Checkbox>
        </Wrap>
      </Box>
    </Box>
  );
};

interface RadioSearchMethodProps {
  searchMethod: string;
  setSearchMethod: (method: SEARCH_METHOD) => void;
}

const RadioSearchMethod = ({
  searchMethod,
  setSearchMethod,
}: RadioSearchMethodProps) => {
  const { t } = useTranslation();

  const onChangeRadio = (value: string | null) => {
    if (value) {
      setSearchMethod(value as SEARCH_METHOD);
    }
  };

  return (
    <Flex flexWrap="wrap" py={1}>
      <Box fontWeight="bold" paddingInlineEnd="5px">
        {t("search_method")}
      </Box>
      <RadioGroup
        colorPalette={"blue"}
        onValueChange={(e) => onChangeRadio(e.value)}
        value={searchMethod}
        alignSelf={"center"}
        variant={"subtle"}
      >
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
    <Box as="form" role="search" onSubmit={handleSearchSubmit} pt={2}>
      <VStack>
        <Textarea
          required
          dir="rtl"
          aria-label="Search"
          onChange={searchStringHandle}
          rows={1}
          value={searchString}
          bgColor="bg"
        />
        <Button
          colorPalette="green"
          variant="solid"
          type="submit"
          fontSize={"md"}
        >
          <MdSearch /> {t("search_button")}
        </Button>
      </VStack>
    </Box>
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
