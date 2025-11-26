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
  selectedVerse: string;
  setVerseToken: (verseKey: string) => void;
}

const ChaptersListAdvanced = ({
  currentChapter,
  selectedChapters,
  setChapter,
  toggleSelectChapter,
  setSelectedChapters,
  selectedVerse,
  setVerseToken,
}: ChaptersListAdvancedProps) => {
  const [chapterToken, setChapterToken] = useState("");
  const [verseSearch, setVerseSearch] = useState("");
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
        verseToken={verseSearch}
        handleSetVerseSearch={setVerseSearch}
      />
      <ChaptersListBody
        chapterToken={chapterToken}
        currentChapter={currentChapter}
        onChangeSelectChapter={onChangeSelectChapter}
        handleCurrentChapter={handleCurrentChapter}
        selectedChapters={selectedChapters}
        verseToken={verseSearch}
        currentVerse={selectedVerse}
        onClickVerse={setVerseToken}
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
  verseToken: string;
  handleSetVerseSearch: (verseID: string) => void;
}

const ChaptersListHeader = ({
  chapterToken,
  currentChapter,
  onChangeChapterToken,
  onClearInput,
  verseToken,
  handleSetVerseSearch,
}: ChaptersListHeaderProps) => {
  const quranService = useQuran();

  const onChangeVerseSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSetVerseSearch(event.target.value);
  };

  const onClearVerseSearch = () => {
    handleSetVerseSearch("");
  };

  return (
    <Flex dir="rtl">
      <Box w={"220px"} flexShrink={0}>
        <InputString
          inputElementProps={{
            placeholder: quranService.getChapterName(currentChapter),
            borderBottom: "none",
            borderBottomRadius: "0",
            borderEndRadius: "0",
          }}
          value={chapterToken}
          onChange={onChangeChapterToken}
          onClear={onClearInput}
          dir="rtl"
        />
      </Box>
      <Box w={"80px"} flexShrink={0}>
        <InputString
          inputElementProps={{
            borderBottom: "none",
            borderBottomRadius: "0",
            borderStartRadius: "0",
          }}
          value={verseToken}
          onChange={onChangeVerseSearch}
          onClear={onClearVerseSearch}
          dir="rtl"
        />
      </Box>
    </Flex>
  );
};

interface ChaptersListBodyProps {
  currentChapter: number;
  chapterToken: string;
  selectedChapters: selectedChaptersType;
  defaultSelected?: boolean;
  onChangeSelectChapter: (chapterID: number) => void;
  handleCurrentChapter: (chapterID: number) => void;
  verseToken: string;
  currentVerse: string;
  onClickVerse: (verseKey: string) => void;
}

const ChaptersListBody = ({
  currentChapter,
  chapterToken,
  selectedChapters,
  defaultSelected = true,
  onChangeSelectChapter,
  handleCurrentChapter,
  verseToken,
  currentVerse,
  onClickVerse,
}: ChaptersListBodyProps) => {
  const quranService = useQuran();

  const refChapter = useRef<HTMLDivElement | null>(null);
  const refVerse = useRef<HTMLDivElement | null>(null);

  // Get verses for the current chapter when verse mode is enabled
  const chapterVerses = quranService.getVerses(currentChapter);

  // Filter verses based on verseToken
  const filteredVerses = chapterVerses.filter((verse) =>
    verseToken ? verse.verseid.toString().startsWith(verseToken) : true
  );

  useEffect(() => {
    if (!refChapter.current) return;

    refChapter.current.scrollIntoView({
      block: "center",
    });
  }, [currentChapter, chapterToken]);

  useEffect(() => {
    if (!refVerse.current) return;

    refVerse.current.scrollIntoView({
      block: "center",
    });
  }, [currentVerse, verseToken]);

  const onClickChapter = (chapterID: number) => {
    handleCurrentChapter(chapterID);
  };

  const handleClickVerse = (verseKey: string) => {
    onClickVerse(verseKey);
  };

  return (
    <Flex flexGrow="1" minH={0} dir="rtl">
      <Box
        w={"220px"}
        border="1px solid"
        borderColor={"border.emphasized"}
        overflowY="scroll"
        bgColor={"brand.bg"}
        fontSize={"medium"}
        paddingEnd="8px"
      >
        {quranService.chapterNames
          .filter((chapter) => chapter.name.includes(chapterToken))
          .map((chapter) => (
            <Flex
              key={chapter.id}
              ref={currentChapter === chapter.id ? refChapter : null}
              cursor="pointer"
              px="5px"
              py={"3px"}
              mdDown={{ py: "8px" }}
              aria-selected={defaultSelected && currentChapter === chapter.id}
              _selected={{ bgColor: "gray.emphasized" }}
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

      <Box
        w={"80px"}
        flexShrink={0}
        border="1px solid"
        borderColor={"border.emphasized"}
        overflowY="scroll"
        bgColor={"brand.bg"}
        fontSize={"medium"}
        padding="2px"
      >
        {filteredVerses.map((verse) => (
          <Box
            ref={currentVerse === verse.key ? refVerse : null}
            key={verse.key}
            cursor="pointer"
            px="5px"
            py={"3px"}
            mdDown={{ py: "8px" }}
            textAlign="center"
            aria-selected={currentVerse === verse.key}
            _selected={{ bgColor: "gray.emphasized" }}
            onClick={() => handleClickVerse(verse.key)}
          >
            {verse.verseid}
          </Box>
        ))}
      </Box>
    </Flex>
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
      w={"300px"}
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
