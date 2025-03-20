import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { selectedChaptersType } from "@/types";

import { Box, Button, Flex, Input } from "@chakra-ui/react";

import { Checkbox } from "@/components/ui/checkbox";

const ChaptersList = () => {
  const currentChapter = useAppSelector(
    (state) => state.coloringPage.currentChapter
  );

  const selectedChapters = useAppSelector(
    (state) => state.coloringPage.selectedChapters
  );

  const dispatch = useAppDispatch();
  const [chapterToken, setChapterToken] = useState("");
  const quranService = useQuran();
  const { t } = useTranslation();
  const refChapter = useRef<HTMLDivElement | null>(null);

  function onChangeChapterToken(event: React.ChangeEvent<HTMLInputElement>) {
    setChapterToken(event.target.value);
  }

  function onClickChapter(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chapterID: number
  ) {
    dispatch(coloringPageActions.setChapter(chapterID));
    setChapterToken("");

    document.documentElement.scrollTop = 0;

    refChapter.current = event.currentTarget;
  }

  useEffect(() => {
    const child = refChapter.current;
    const parent = refChapter.current?.parentElement?.parentElement;

    if (!child || !parent) return;

    const parentOffsetTop = parent.offsetTop;

    if (
      parent.scrollTop + parentOffsetTop <
        child.offsetTop - parent.clientHeight + child.clientHeight * 2.5 ||
      parent.scrollTop + parentOffsetTop >
        child.offsetTop - child.clientHeight * 2.5
    ) {
      parent.scrollTop =
        child.offsetTop - parentOffsetTop - parent.clientHeight / 2;
    }
  }, [currentChapter]);

  function onChangeSelectChapter(chapterID: number) {
    dispatch(coloringPageActions.toggleSelectChapter(chapterID));
  }

  function onClickSelectAll() {
    const selectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = true;
    });

    dispatch(coloringPageActions.setSelectedChapters(selectedChapters));
  }

  function onClickDeselectAll() {
    const selectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = false;
    });

    selectedChapters[currentChapter] = true;

    dispatch(coloringPageActions.setSelectedChapters(selectedChapters));
  }

  const currentSelectedChapters = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedCount = currentSelectedChapters.length;

  const onlyCurrentSelected =
    getSelectedCount === 1 &&
    Number(currentSelectedChapters[0]) === currentChapter;

  return (
    <Flex flexDir={"column"} minH={"30%"} maxH={"45%"}>
      <Input
        type="search"
        placeholder={quranService.getChapterName(currentChapter)}
        value={chapterToken}
        onChange={onChangeChapterToken}
        bgColor={"bg"}
        borderBottomRadius={"unset"}
      />
      <Box
        flexGrow={1}
        border={"1px solid"}
        borderColor={"border.emphasized"}
        overflowY={"scroll"}
        w={"100%"}
      >
        {quranService.chapterNames
          .filter((chapter) => chapter.name.includes(chapterToken))
          .map((chapter) => (
            <Flex
              cursor={"pointer"}
              px={"5px"}
              py={"2px"}
              mb={"2px"}
              aria-selected={currentChapter === chapter.id}
              bgColor={"gray.muted"}
              _selected={{ bgColor: "purple.emphasized" }}
              key={chapter.id}
            >
              <Box
                flexGrow={1}
                onClick={(event) => onClickChapter(event, chapter.id)}
              >
                {chapter.name}
              </Box>
              <Checkbox
                checked={
                  selectedChapters[chapter.id] !== undefined
                    ? selectedChapters[chapter.id]
                    : true
                }
                onChange={() => onChangeSelectChapter(chapter.id)}
              />
            </Flex>
          ))}
      </Box>
      <Flex
        justify={"center"}
        gap={4}
        padding={4}
        bgColor={"bg.muted"}
        border={"1px solid"}
        borderBottomRadius={"0.275rem"}
        borderColor={"border.emphasized"}
        dir="ltr"
      >
        <Button
          colorPalette="teal"
          fontWeight="normal"
          disabled={getSelectedCount === 114}
          onClick={onClickSelectAll}
        >
          {t("all_chapters")}
        </Button>
        <Button
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

export default ChaptersList;
