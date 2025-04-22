import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import { selectedChaptersType } from "@/types";

import { Box, Button, Flex } from "@chakra-ui/react";

import { Checkbox } from "@/components/ui/checkbox";
import { InputString } from "@/components/Generic/Input";

interface ChaptersListAdvancedProps {
  currentChapter: number;
  selectedChapters: selectedChaptersType;
  setChapter: (chapter: number) => void;
  toggleSelectChapter: (chapter: number) => void;
  setSelectedChapters: (chapters: selectedChaptersType) => void;
}

const ChaptersListAdvanced = ({
  currentChapter,
  selectedChapters,
  setChapter,
  toggleSelectChapter,
  setSelectedChapters,
}: ChaptersListAdvancedProps) => {
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
    setChapter(chapterID);
    setChapterToken("");

    window.scrollTo({ top: 0, behavior: "smooth" });

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
    toggleSelectChapter(chapterID);
  }

  function onClickSelectAll() {
    const selectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = true;
    });

    setSelectedChapters(selectedChapters);
  }

  function onClickDeselectAll() {
    const selectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      selectedChapters[chapter.id] = false;
    });

    selectedChapters[currentChapter] = true;

    setSelectedChapters(selectedChapters);
  }

  const onClearInput = () => {
    setChapterToken("");
  };

  const currentSelectedChapters = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedCount = currentSelectedChapters.length;

  const onlyCurrentSelected =
    getSelectedCount === 1 &&
    Number(currentSelectedChapters[0]) === currentChapter;

  return (
    <Flex flexDir={"column"} minH={"45vh"} maxH={"45vh"}>
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
      <Box
        flexGrow={1}
        border={"1px solid"}
        borderColor={"border.emphasized"}
        overflowY={"scroll"}
        w={"100%"}
        fontSize={"medium"}
      >
        {quranService.chapterNames
          .filter((chapter) => chapter.name.includes(chapterToken))
          .map((chapter) => (
            <Flex
              key={chapter.id}
              cursor={"pointer"}
              px={"5px"}
              py={"3px"}
              smDown={{ py: "8px" }}
              aria-selected={currentChapter === chapter.id}
              _selected={{ bgColor: "gray.emphasized" }}
            >
              <Box
                flexGrow={1}
                onClick={(event) => onClickChapter(event, chapter.id)}
              >
                {chapter.id}. {chapter.name}
              </Box>
              <Checkbox
                colorPalette={"blue"}
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

export { ChaptersListAdvanced };
