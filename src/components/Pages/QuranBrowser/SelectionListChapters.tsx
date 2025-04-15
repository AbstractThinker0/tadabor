import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { selectedChaptersType } from "@/types";

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
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const currentChapter = useAppSelector((state) => state.qbPage.selectChapter);
  const selectedChapters = useAppSelector(
    (state) => state.qbPage.selectedChapters
  );

  const searchingString = useAppSelector(
    (state) => state.qbPage.searchingString
  );

  const [chapterSearch, setChapterSearch] = useState("");

  const refChaptersList = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = refChaptersList.current;

    if (!parent) return;

    const selectedChapter = parent.querySelector<HTMLDivElement>(
      `[data-id="${currentChapter}"]`
    );

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

  const onClearInput = () => {
    setChapterSearch("");
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChapterSearch(event.target.value);
  };

  const onClickChapter = (chapterID: number) => {
    handleCurrentChapter(chapterID);
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

  const currentSelectedChapters = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedCount = currentSelectedChapters.length;

  const onlyCurrentSelected =
    getSelectedCount === 1 &&
    Number(currentSelectedChapters[0]) === currentChapter;

  return (
    <Flex flexDirection="column" h="40vh">
      <InputString
        inputElementProps={{
          borderBottom: "none",
          borderBottomRadius: "0",
          placeholder: quranService.getChapterName(currentChapter),
        }}
        value={chapterSearch}
        onChange={onChangeInput}
        onClear={onClearInput}
        dir="rtl"
      />
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
              <Box flexGrow="1" onClick={() => onClickChapter(chapter.id)}>
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
      <Flex
        alignItems="center"
        flexWrap="wrap"
        padding="5px"
        bgColor={"gray.muted"}
        border="1px solid"
        borderColor={"border.emphasized"}
      >
        <Box fontWeight="bold">{t("search_scope")}:</Box>
        <Flex justifyContent="center" gap="3px">
          <Button
            px={2}
            colorPalette="teal"
            fontWeight="normal"
            disabled={getSelectedCount === 114}
            onClick={onClickSelectAll}
          >
            {t("all_chapters")}
          </Button>
          <Button
            px={2}
            colorPalette="teal"
            fontWeight="normal"
            disabled={onlyCurrentSelected}
            onClick={onClickDeselectAll}
          >
            {t("current_chapter")}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

SelectionListChapters.displayName = "SelectionListChapters";

export default SelectionListChapters;
