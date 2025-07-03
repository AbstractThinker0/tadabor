import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import type { selectedChaptersType } from "@/types";

import { Flex, Box, Button } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { InputString } from "@/components/Generic/Input";

interface SelectionListChaptersProps {
  handleCurrentChapter: (chapterID: number) => void;
}

const SelectionListChapters = ({
  handleCurrentChapter,
}: SelectionListChaptersProps) => {
  const quranService = useQuran();

  const dispatch = useAppDispatch();

  const currentChapter = useAppSelector((state) => state.qbPage.selectChapter);

  const selectedChapters = useAppSelector(
    (state) => state.qbPage.selectedChapters
  );

  const searchingString = useAppSelector(
    (state) => state.qbPage.searchingString
  );

  const [chapterSearch, setChapterSearch] = useState("");

  const onClearInput = () => {
    setChapterSearch("");
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChapterSearch(event.target.value);
  };

  const onClickSelectAll = () => {
    const newSelectionChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      newSelectionChapters[chapter.id] = true;
    });

    dispatch(qbPageActions.setSelectedChapters(newSelectionChapters));
  };

  const onClickDeselectAll = () => {
    const newSelectionChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      newSelectionChapters[chapter.id] = false;
    });

    newSelectionChapters[currentChapter] = true;

    dispatch(qbPageActions.setSelectedChapters(newSelectionChapters));
  };

  const onChangeSelectChapter = (chapterID: number) => {
    dispatch(qbPageActions.toggleSelectChapter(chapterID));
  };

  return (
    <Flex flexDirection="column" h="38vh">
      <ChaptersListHeader
        currentChapter={currentChapter}
        chapterToken={chapterSearch}
        onChangeChapterToken={onChangeInput}
        onClearInput={onClearInput}
      />
      <ChaptersListBody
        chapterSearch={chapterSearch}
        currentChapter={currentChapter}
        handleCurrentChapter={handleCurrentChapter}
        onChangeSelectChapter={onChangeSelectChapter}
        searchingString={searchingString}
        selectedChapters={selectedChapters}
      />
      <ChaptersListFooter
        onClickDeselectAll={onClickDeselectAll}
        onClickSelectAll={onClickSelectAll}
        currentChapter={currentChapter}
        selectedChapters={selectedChapters}
      />
    </Flex>
  );
};

SelectionListChapters.displayName = "SelectionListChapters";

interface ChaptersListHeaderProps {
  currentChapter: number;
  chapterToken: string;
  onChangeChapterToken: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearInput: () => void;
}

const ChaptersListHeader = ({
  chapterToken,
  currentChapter,
  onChangeChapterToken,
  onClearInput,
}: ChaptersListHeaderProps) => {
  const quranService = useQuran();

  return (
    <InputString
      inputElementProps={{
        placeholder: quranService.getChapterName(currentChapter),
        borderBottom: "none",
        borderBottomRadius: "0",
      }}
      value={chapterToken}
      onChange={onChangeChapterToken}
      onClear={onClearInput}
      dir="rtl"
    />
  );
};

interface ChaptersListBodyProps {
  currentChapter: number;
  chapterSearch: string;
  searchingString: string;
  selectedChapters: selectedChaptersType;
  onChangeSelectChapter: (chapterID: number) => void;
  handleCurrentChapter: (chapterID: number) => void;
}

const ChaptersListBody = ({
  currentChapter,
  chapterSearch,
  searchingString,
  selectedChapters,
  onChangeSelectChapter,
  handleCurrentChapter,
}: ChaptersListBodyProps) => {
  const quranService = useQuran();

  const refChaptersList = useRef<HTMLDivElement>(null);
  const refChapter = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const parent = refChaptersList.current;

    if (!parent) return;

    const selectedChapter = refChapter.current;

    if (!selectedChapter) return;

    const parentOffsetTop = parent.offsetTop;

    if (
      parent.scrollTop + parentOffsetTop <
        selectedChapter.offsetTop -
          parent.clientHeight +
          selectedChapter.clientHeight * 1.7 ||
      parent.scrollTop + parentOffsetTop >
        selectedChapter.offsetTop - selectedChapter.clientHeight * 1.1
    ) {
      parent.scrollTop =
        selectedChapter.offsetTop - parentOffsetTop - parent.clientHeight / 2;
    }
  });

  const onClickChapter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chapterID: number
  ) => {
    handleCurrentChapter(chapterID);

    refChapter.current = event.currentTarget;
  };

  return (
    <Box
      flexGrow="1"
      bgColor="brand.bg"
      border="1px solid"
      borderColor={"border.emphasized"}
      overflowY="scroll"
      padding="2px"
      ref={refChaptersList}
    >
      {quranService.chapterNames
        .filter((chapter) => chapter.name.includes(chapterSearch))
        .map((chapter) => (
          <Flex
            px="14px"
            py={"2px"}
            mdDown={{ py: "8px" }}
            cursor="pointer"
            key={chapter.id}
            data-id={chapter.id}
            aria-selected={
              !searchingString.length && currentChapter === chapter.id
            }
            _selected={{
              bgColor: "gray.emphasized",
            }}
          >
            <Box
              flexGrow="1"
              onClick={(event) => onClickChapter(event, chapter.id)}
            >
              {chapter.id}. {chapter.name}
            </Box>
            <Checkbox
              colorPalette={"teal"}
              checked={selectedChapters[chapter.id]}
              onCheckedChange={() => onChangeSelectChapter(chapter.id)}
            />
          </Flex>
        ))}
    </Box>
  );
};

interface ChaptersListFooterProps {
  selectedChapters: selectedChaptersType;
  currentChapter: number;
  onClickSelectAll: () => void;
  onClickDeselectAll: () => void;
}

const ChaptersListFooter = ({
  selectedChapters,
  currentChapter,
  onClickSelectAll,
  onClickDeselectAll,
}: ChaptersListFooterProps) => {
  const { t } = useTranslation();

  const currentSelectedChapters = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedCount = currentSelectedChapters.length;

  const onlyCurrentSelected =
    getSelectedCount === 1 &&
    Number(currentSelectedChapters[0]) === currentChapter;

  return (
    <Flex
      alignItems="center"
      flexWrap="wrap"
      padding="5px"
      bgColor={"gray.muted"}
      border="1px solid"
      borderColor={"border.emphasized"}
    >
      <Box fontWeight="bold" paddingEnd={"0.1rem"}>
        {t("search_scope")}:
      </Box>
      <Flex justifyContent="center" gap="3px">
        <Button
          px={"0.25rem"}
          colorPalette="teal"
          fontWeight="normal"
          disabled={getSelectedCount === 114}
          onClick={onClickSelectAll}
        >
          {t("all_chapters")}
        </Button>
        <Button
          px={"0.25rem"}
          colorPalette="teal"
          fontWeight="normal"
          disabled={onlyCurrentSelected}
          onClick={onClickDeselectAll}
        >
          {t("current_chapter")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default SelectionListChapters;
