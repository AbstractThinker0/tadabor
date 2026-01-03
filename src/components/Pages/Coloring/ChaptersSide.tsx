import { useTranslation } from "react-i18next";
import { useColoringPageStore } from "@/store/zustand/coloringPage";

import AddColorModal from "@/components/Pages/Coloring/AddColorModal";

import EditColorsModal from "@/components/Pages/Coloring/EditColorsModal";
import ColorsList from "@/components/Pages/Coloring/ColorsList";
import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { ChaptersListAdvanced } from "@/components/Custom/ChaptersListAdvanced";

import type { selectedChaptersType } from "@/types";

const ChaptersSide = () => {
  const {
    open: isOpenAddColor,
    onOpen: onOpenAddColor,
    onClose: onCloseAddColor,
  } = useDisclosure();

  const {
    open: isOpenEditColor,
    onOpen: onOpenEditColor,
    onClose: onCloseEditColor,
  } = useDisclosure();

  const selectedVerse = useColoringPageStore((state) => state.selectedVerse);

  const currentChapter = useColoringPageStore((state) => state.currentChapter);

  const selectedChapters = useColoringPageStore(
    (state) => state.selectedChapters
  );

  const setSelectedVerse = useColoringPageStore(
    (state) => state.setSelectedVerse
  );
  const setChapter = useColoringPageStore((state) => state.setChapter);
  const setSelectedChaptersStore = useColoringPageStore(
    (state) => state.setSelectedChapters
  );
  const toggleSelectChapterStore = useColoringPageStore(
    (state) => state.toggleSelectChapter
  );

  const onClickVerse = (verseKey: string) => {
    setSelectedVerse(verseKey);
  };

  const setChapterHandler = (chapter: number) => {
    setChapter(chapter);
  };

  const setSelectedChaptersHandler = (chapters: selectedChaptersType) => {
    setSelectedChaptersStore(chapters);
  };

  const toggleSelectChapterHandler = (chapter: number) => {
    toggleSelectChapterStore(chapter);
  };

  return (
    <Flex
      flexDir={"column"}
      maxW={"350px"}
      pt={"8px"}
      paddingInlineStart={"8px"}
      paddingInlineEnd={"4px"}
    >
      <ChaptersListAdvanced
        currentChapter={currentChapter}
        selectedChapters={selectedChapters}
        setChapter={setChapterHandler}
        setSelectedChapters={setSelectedChaptersHandler}
        toggleSelectChapter={toggleSelectChapterHandler}
        selectedVerse={selectedVerse}
        setVerseToken={onClickVerse}
      />
      <Flex
        flexDir={"column"}
        minH={"30%"}
        maxH={"50%"}
        mt={"10px"}
        border={"1px solid"}
        borderColor={"border.emphasized"}
        p={"10px"}
        pt={"2px"}
        bgColor={"bg.muted"}
        borderRadius={"0.275rem"}
      >
        <ColorsList />

        <Flex gap={2} justify={"center"} dir="ltr">
          <Button colorPalette="green" onClick={onOpenAddColor}>
            Add color
          </Button>
          <Button colorPalette="cyan" onClick={onOpenEditColor}>
            Edit colors
          </Button>
        </Flex>
      </Flex>

      <VersesCount />

      <AddColorModal isOpen={isOpenAddColor} onClose={onCloseAddColor} />
      <EditColorsModal isOpen={isOpenEditColor} onClose={onCloseEditColor} />
    </Flex>
  );
};

const VersesCount = () => {
  const { t } = useTranslation();
  const coloredVerses = useColoringPageStore((state) => state.coloredVerses);
  const selectedChapters = useColoringPageStore(
    (state) => state.selectedChapters
  );
  const selectedColors = useColoringPageStore((state) => state.selectedColors);

  const getColoredVersesCount = () => {
    const asArray = Object.entries(coloredVerses);

    const filtered = asArray.filter(([key, color]) => {
      const info = key.split("-");
      return (
        selectedChapters[info[0]] === true && selectedColors[color.colorID]
      );
    });

    return filtered.length;
  };

  const selectedCount = getColoredVersesCount();

  if (!Object.keys(selectedColors).length) return null;

  return (
    <Text color={"green.fg"}>{`${t("search_count")} ${selectedCount}`}</Text>
  );
};

export default ChaptersSide;
