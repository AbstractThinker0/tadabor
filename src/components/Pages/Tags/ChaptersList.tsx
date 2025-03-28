import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { selectedChaptersType } from "@/types";
import useQuran from "@/context/useQuran";
import { Box, Button, Flex, Input } from "@chakra-ui/react";

import { Checkbox } from "@/components/ui/checkbox";

const ChaptersList = () => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();
  const { t } = useTranslation();
  const refChapter = useRef<HTMLDivElement | null>(null);
  const [chapterToken, setChapterToken] = useState("");

  const currentChapter = useAppSelector(
    (state) => state.tagsPage.currentChapter
  );

  const selectedChapters = useAppSelector(
    (state) => state.tagsPage.selectedChapters
  );

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

  function onClickChapter(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    chapterID: number
  ) {
    document.documentElement.scrollTop = 0;

    dispatch(tagsPageActions.setChapter(chapterID));
    setChapterToken("");

    refChapter.current = event.currentTarget;
  }

  function onChangeSelectChapter(chapterID: number) {
    dispatch(tagsPageActions.toggleSelectChapter(chapterID));
  }

  const currentSelectedChapters = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedCount = currentSelectedChapters.length;

  const onlyCurrentSelected =
    getSelectedCount === 1 &&
    Number(currentSelectedChapters[0]) === currentChapter;

  function onClickSelectAll() {
    const selectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = true;
    });

    dispatch(tagsPageActions.setSelectedChapters(selectedChapters));
  }

  function onClickDeselectAll() {
    const selectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = false;
    });

    selectedChapters[currentChapter] = true;

    dispatch(tagsPageActions.setSelectedChapters(selectedChapters));
  }

  const onChangeChapterToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChapterToken(e.target.value);
  };

  return (
    <>
      <Flex flexDir={"column"} maxH={"40%"}>
        <Input
          type="search"
          placeholder={quranService.getChapterName(currentChapter)}
          value={chapterToken}
          onChange={onChangeChapterToken}
          bgColor={"bg"}
          borderBottomRadius={"unset"}
        />
        <Flex
          flexDir={"column"}
          border={"1px solid"}
          borderColor={"border.emphasized"}
          minW={"200px"}
          overflowY={"scroll"}
        >
          {quranService.chapterNames
            .filter((chapter) => chapter.name.includes(chapterToken))
            .map((chapter) => (
              <Flex
                padding={1}
                cursor={"pointer"}
                key={chapter.id}
                aria-selected={currentChapter === chapter.id}
                _selected={{ bgColor: "purple.emphasized" }}
              >
                <Box
                  flexGrow={1}
                  onClick={(event) => onClickChapter(event, chapter.id)}
                >
                  {chapter.id}. {chapter.name}
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
        </Flex>
      </Flex>
      <Flex
        justify={"center"}
        gap={4}
        padding={4}
        bgColor={"gray.muted"}
        borderBottomRadius={"0.275rem"}
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
    </>
  );
};

export default ChaptersList;
