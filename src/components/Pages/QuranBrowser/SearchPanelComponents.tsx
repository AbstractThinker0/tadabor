import type React from "react";
import { useTranslation } from "react-i18next";

import { useQuranBrowserPageStore } from "@/store/pages/quranBrowserPage";

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

const SearchOptions = () => {
  const { t } = useTranslation();

  const searchMethod = useQuranBrowserPageStore((state) => state.searchMethod);

  const searchDiacritics = useQuranBrowserPageStore(
    (state) => state.searchDiacritics
  );

  const searchIdentical = useQuranBrowserPageStore(
    (state) => state.searchIdentical
  );

  const searchStart = useQuranBrowserPageStore((state) => state.searchStart);

  const setSearchDiacritics = useQuranBrowserPageStore(
    (state) => state.setSearchDiacritics
  );
  const setSearchIdentical = useQuranBrowserPageStore(
    (state) => state.setSearchIdentical
  );
  const setSearchStart = useQuranBrowserPageStore(
    (state) => state.setSearchStart
  );
  const setSearchMethod = useQuranBrowserPageStore(
    (state) => state.setSearchMethod
  );

  const isRootSearch = searchMethod === SEARCH_METHOD.ROOT ? true : false;

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
        <Wrap pt={"6px"}>
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

  const setSearchString = useQuranBrowserPageStore(
    (state) => state.setSearchString
  );

  const searchStringHandle = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSearchString(event.target.value);
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
  const searchResult = useQuranBrowserPageStore((state) => state.searchResult);

  if (searchResult.length === 0) return null;

  return (
    <Text fontWeight="bold" color="green">{`${t("search_count")} ${
      searchResult.length
    }`}</Text>
  );
};

export { SearchOptions, FormWordSearch, SearchSuccessComponent };
