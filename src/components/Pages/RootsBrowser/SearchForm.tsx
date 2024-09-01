import { useTranslation } from "react-i18next";

import { rootProps } from "@/types";

import { useAppDispatch } from "@/store";
import { rbPageActions } from "@/store/slices/pages/rootsBrowser";

import { arabicAlpha } from "@/components/Pages/RootsBrowser/consts";

import {
  Box,
  Flex,
  Input,
  Checkbox,
  HStack,
  Button,
  StackDivider,
} from "@chakra-ui/react";

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
  const dispatch = useAppDispatch();

  const searchStringHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(rbPageActions.setSearchString(event.target.value));
  };

  const onChangeInclusive = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(rbPageActions.setSearchInclusive(event.target.checked));
  };

  return (
    <Box py={1}>
      <Flex direction={"column"} alignItems={"center"}>
        <Box>
          <Flex gap={1}>
            <Input
              backgroundColor={"white"}
              type="search"
              value={searchString}
              aria-label="Search"
              onChange={searchStringHandle}
              dir="rtl"
            />
            <span>({stateRoots.length})</span>
          </Flex>

          <Flex gap={1} alignSelf={"start"}>
            <Box fontWeight={"bold"}>{t("search_options")}</Box>{" "}
            <Checkbox isChecked={searchInclusive} onChange={onChangeInclusive}>
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
  const dispatch = useAppDispatch();

  const onLetterClick = (letter: string) => {
    dispatch(rbPageActions.setSearchString(letter));
  };

  return (
    <HStack
      spacing={0}
      justify={"center"}
      wrap={"wrap"}
      divider={<StackDivider borderColor="gray" />}
      dir="rtl"
    >
      {arabicAlpha.map((letter, index) => (
        <Button
          minW={"auto"}
          px={2.5}
          variant={"ghost"}
          key={index}
          colorScheme="blue"
          color={"blue.500"}
          fontSize={"1.1rem"}
          onClick={() => onLetterClick(letter)}
        >
          {letter}
        </Button>
      ))}
    </HStack>
  );
};

export default SearchForm;
