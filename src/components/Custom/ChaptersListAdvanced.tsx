import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import type { selectedChaptersType } from "@/types";

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

  function onChangeChapterToken(event: React.ChangeEvent<HTMLInputElement>) {
    setChapterToken(event.target.value);
  }

  function handleCurrentChapter(chapterID: number) {
    setChapter(chapterID);
    setChapterToken("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onChangeSelectChapter(chapterID: number) {
    toggleSelectChapter(chapterID);
  }

  function onClickSelectAll() {
    const newSelectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      newSelectedChapters[chapter.id] = true;
    });

    setSelectedChapters(newSelectedChapters);
  }

  function onClickDeselectAll() {
    const newSelectedChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      newSelectedChapters[chapter.id] = false;
    });

    newSelectedChapters[currentChapter] = true;

    setSelectedChapters(newSelectedChapters);
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
      <ChaptersListHeader
        currentChapter={currentChapter}
        chapterToken={chapterToken}
        onChangeChapterToken={onChangeChapterToken}
        onClearInput={onClearInput}
      />
      <ChaptersListBody
        chapterToken={chapterToken}
        currentChapter={currentChapter}
        onChangeSelectChapter={onChangeSelectChapter}
        handleCurrentChapter={handleCurrentChapter}
        selectedChapters={selectedChapters}
      />
      <ChaptersListFooter
        getSelectedCount={getSelectedCount}
        onlyCurrentSelected={onlyCurrentSelected}
        onClickDeselectAll={onClickDeselectAll}
        onClickSelectAll={onClickSelectAll}
      />
    </Flex>
  );
};

export { ChaptersListAdvanced };

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
  chapterToken: string;
  selectedChapters: selectedChaptersType;
  defaultSelected?: boolean;
  onChangeSelectChapter: (chapterID: number) => void;
  handleCurrentChapter: (chapterID: number) => void;
}

const ChaptersListBody = ({
  currentChapter,
  chapterToken,
  selectedChapters,
  defaultSelected = true,
  onChangeSelectChapter,
  handleCurrentChapter,
}: ChaptersListBodyProps) => {
  const quranService = useQuran();

  const refChaptersList = useRef<HTMLDivElement>(null);
  const refChapter = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const selectedChapterElement = refChapter.current;
    const chaptersListElement = refChaptersList.current;

    if (!selectedChapterElement || !chaptersListElement) return;

    const parentOffsetTop = chaptersListElement.offsetTop;

    if (
      chaptersListElement.scrollTop + parentOffsetTop <
        selectedChapterElement.offsetTop -
          chaptersListElement.clientHeight +
          selectedChapterElement.clientHeight * 2.5 ||
      chaptersListElement.scrollTop + parentOffsetTop >
        selectedChapterElement.offsetTop -
          selectedChapterElement.clientHeight * 2.5
    ) {
      chaptersListElement.scrollTop =
        selectedChapterElement.offsetTop -
        parentOffsetTop -
        chaptersListElement.clientHeight / 2;
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
      border="1px solid"
      borderColor={"border.emphasized"}
      overflowY="scroll"
      bgColor={"brand.bg"}
      fontSize={"medium"}
      padding="2px"
      ref={refChaptersList}
    >
      {quranService.chapterNames
        .filter((chapter) => chapter.name.includes(chapterToken))
        .map((chapter) => (
          <Flex
            key={chapter.id}
            cursor="pointer"
            px="5px"
            py={"3px"}
            mdDown={{ py: "8px" }}
            aria-selected={defaultSelected && currentChapter === chapter.id}
            _selected={{ bgColor: "gray.emphasized" }}
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
  getSelectedCount: number;
  onlyCurrentSelected: boolean;
  onClickSelectAll: () => void;
  onClickDeselectAll: () => void;
}

const ChaptersListFooter = ({
  getSelectedCount,
  onlyCurrentSelected,
  onClickSelectAll,
  onClickDeselectAll,
}: ChaptersListFooterProps) => {
  const { t } = useTranslation();

  return (
    <Flex
      alignItems="center"
      flexWrap="wrap"
      padding="5px"
      bgColor={"bg.muted"}
      border="1px solid"
      borderColor={"border.emphasized"}
    >
      <Box fontWeight="bold" fontSize={"medium"} paddingEnd={"0.1rem"}>
        {t("search.scope")}:
      </Box>
      <Flex justifyContent="center" gap="3px">
        <Button
          px={"0.25rem"}
          colorPalette="teal"
          fontWeight="normal"
          disabled={getSelectedCount === 114}
          onClick={onClickSelectAll}
        >
          {t("search.all_quran")}
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

export { ChaptersListHeader, ChaptersListBody, ChaptersListFooter };
