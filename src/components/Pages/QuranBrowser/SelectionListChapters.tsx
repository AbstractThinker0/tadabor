import { useState } from "react";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

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

  const dispatch = useAppDispatch();

  const currentChapter = useAppSelector((state) => state.qbPage.selectChapter);

  const selectedChapters = useAppSelector(
    (state) => state.qbPage.selectedChapters
  );

  const searchingString = useAppSelector(
    (state) => state.qbPage.searchingString
  );

  const selectedVerse = useAppSelector((state) => state.qbPage.selectedVerse);

  const [chapterSearch, setChapterSearch] = useState("");
  const [verseSearch, setVerseSearch] = useState("");

  const handleSetVerseSearch = (verseID: string) => {
    setVerseSearch(verseID);
  };

  const onClickVerse = (verseKey: string) => {
    dispatch(qbPageActions.setSelectedVerse(verseKey));
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
    <Flex flexDirection="column" h="38vh">
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
