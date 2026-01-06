import { useTranslation } from "react-i18next";

import type { rootProps } from "quran-tools";

import { useRootsBrowserPageStore } from "@/store/pages/rootsBrowserPage";

import { arabicAlpha } from "quran-tools";

import { Box, Flex, HStack, Button, StackSeparator } from "@chakra-ui/react";

import { Checkbox } from "@/components/ui/checkbox";
import { InputString } from "@/components/Generic/Input";

interface SearchFormProps {
  searchString: string;
  searchInclusive: boolean;
  stateRoots: rootProps[];
}

const SearchForm = ({
  searchString,
  searchInclusive,
  stateRoots,
}: SearchFormProps) => {
  const { t } = useTranslation();
  const setSearchString = useRootsBrowserPageStore(
    (state) => state.setSearchString
  );
  const setSearchInclusive = useRootsBrowserPageStore(
    (state) => state.setSearchInclusive
  );

  const searchStringHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const onChangeInclusive = (checked: boolean) => {
    setSearchInclusive(checked);
  };

  const onClearInput = () => {
    setSearchString("");
  };

  return (
    <Box py={1}>
      <Flex flexDirection={"column"} alignItems={"center"}>
        <Box>
          <Flex gap={1}>
            <InputString
              value={searchString}
              onChange={searchStringHandle}
              onClear={onClearInput}
              dir="rtl"
            />

            <span>({stateRoots.length})</span>
          </Flex>

          <Flex gap={1} alignSelf={"start"}>
            <Box fontWeight={"bold"}>{t("search.options")}</Box>{" "}
            <Checkbox
              checked={searchInclusive}
              onCheckedChange={(e) => onChangeInclusive(!!e.checked)}
            >
              {t("search_inclusive")}
            </Checkbox>
          </Flex>
        </Box>
      </Flex>
      <AlphabetsComponent />
    </Box>
  );
};

const AlphabetsComponent = () => {
  const setSearchString = useRootsBrowserPageStore(
    (state) => state.setSearchString
  );

  const onLetterClick = (letter: string) => {
    setSearchString(letter);
  };

  return (
    <HStack
      gap={0}
      justify={"center"}
      wrap={"wrap"}
      separator={<StackSeparator borderColor="border.emphasized" />}
      dir="rtl"
    >
      {arabicAlpha.map((letter, index) => (
        <Button
          minW={"auto"}
          px={2.5}
          variant={"ghost"}
          key={index}
          colorPalette="blue"
          color={"blue.solid"}
          fontSize={"lg"}
          onClick={() => onLetterClick(letter)}
        >
          {letter}
        </Button>
      ))}
    </HStack>
  );
};

export default SearchForm;
