import { useState } from "react";

import useQuran from "@/context/useQuran";

import { useQuranBrowserPageStore } from "@/store/zustand/quranBrowserPage";

import type { selectedChaptersType } from "@/types";

import { Flex } from "@chakra-ui/react";

import {
  ChaptersListBody,
  ChaptersListFooter,
  ChaptersListHeader,
} from "@/components/Custom/ChaptersListAdvanced";

interface SelectionListChaptersProps {
  handleCurrentChapter: (chapterID: number) => void;
}

const SelectionListChapters = ({
  handleCurrentChapter,
}: SelectionListChaptersProps) => {
  const quranService = useQuran();

  const currentChapter = useQuranBrowserPageStore(
    (state) => state.selectChapter
  );

  const selectedChapters = useQuranBrowserPageStore(
    (state) => state.selectedChapters
  );

  const searchingString = useQuranBrowserPageStore(
    (state) => state.searchingString
  );

  const selectedVerse = useQuranBrowserPageStore(
    (state) => state.selectedVerse
  );
  const setSelectedVerse = useQuranBrowserPageStore(
    (state) => state.setSelectedVerse
  );
  const setSelectedChapters = useQuranBrowserPageStore(
    (state) => state.setSelectedChapters
  );
  const toggleSelectChapter = useQuranBrowserPageStore(
    (state) => state.toggleSelectChapter
  );

  const [chapterSearch, setChapterSearch] = useState("");
  const [verseSearch, setVerseSearch] = useState("");

  const handleSetVerseSearch = (verseID: string) => {
    setVerseSearch(verseID);
  };

  const onClickVerse = (verseKey: string) => {
    setSelectedVerse(verseKey);
  };

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

    setSelectedChapters(newSelectionChapters);
  };

  const onClickDeselectAll = () => {
    const newSelectionChapters: selectedChaptersType = {};

    quranService.chapterNames.forEach((chapter) => {
      newSelectionChapters[chapter.id] = false;
    });

    newSelectionChapters[currentChapter] = true;

    setSelectedChapters(newSelectionChapters);
  };

  const onChangeSelectChapter = (chapterID: number) => {
    toggleSelectChapter(chapterID);
  };

  const currentSelectedChapters = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedCount = currentSelectedChapters.length;

  const onlyCurrentSelected =
    getSelectedCount === 1 &&
    Number(currentSelectedChapters[0]) === currentChapter;

  return (
    <Flex
      flexDirection="column"
      h="38vh"
      border="1px solid"
      borderColor={"border.emphasized"}
      borderRadius="md"
      overflow="hidden"
      bgColor={"brand.bg"}
      boxShadow="sm"
      mb={4}
    >
      <ChaptersListHeader
        currentChapter={currentChapter}
        chapterToken={chapterSearch}
        onChangeChapterToken={onChangeInput}
        onClearInput={onClearInput}
        verseToken={verseSearch}
        handleSetVerseSearch={handleSetVerseSearch}
      />
      <ChaptersListBody
        chapterToken={chapterSearch}
        currentChapter={currentChapter}
        handleCurrentChapter={handleCurrentChapter}
        onChangeSelectChapter={onChangeSelectChapter}
        defaultSelected={!searchingString.length}
        selectedChapters={selectedChapters}
        verseToken={verseSearch}
        currentVerse={selectedVerse}
        onClickVerse={onClickVerse}
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

SelectionListChapters.displayName = "SelectionListChapters";

export default SelectionListChapters;
