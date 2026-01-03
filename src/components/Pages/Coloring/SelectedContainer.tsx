import { useCallback, useMemo } from "react";

import { useColoringPageStore } from "@/store/zustand/coloringPage";

import useQuran from "@/context/useQuran";

import { Box, Flex, Tag, Text } from "@chakra-ui/react";

import { SelectedVerseItem } from "@/components/Pages/Coloring/VerseItem";
import { ButtonSidebar } from "@/components/Pages/Coloring/ButtonSidebar";
import type { coloredProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

interface SelectedContainerProps {
  openVerseModal: () => void;
}

const SelectedContainer = ({ openVerseModal }: SelectedContainerProps) => {
  const selectedChapters = useColoringPageStore(
    (state) => state.selectedChapters
  );
  const coloredVerses = useColoringPageStore((state) => state.coloredVerses);
  const selectedColors = useColoringPageStore((state) => state.selectedColors);

  const deselectColor = useColoringPageStore((state) => state.deselectColor);
  const toggleSelectChapter = useColoringPageStore(
    (state) => state.toggleSelectChapter
  );
  const quranService = useQuran();

  function onClickDeleteSelected(colorID: string) {
    deselectColor(colorID);
  }

  const chaptersScope = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedColoredVerses = () => {
    const asArray = Object.entries(coloredVerses);

    const filtered = asArray.filter(([key]) => {
      const info = key.split("-");
      return selectedChapters[info[0]] === true;
    });

    return Object.fromEntries(filtered);
  };

  const onClickCloseChapter = (chapterID: string) => {
    toggleSelectChapter(Number(chapterID));
  };

  return (
    <>
      <Flex pt={"2px"} pb={"5px"} px={1}>
        <Box pt={1} paddingEnd={1}>
          <ButtonSidebar />
        </Box>
        <Box flex={1} dir="ltr">
          <Flex flexWrap={"wrap"} gap={"5px"} alignItems="center">
            <Box lineHeight={"short"} fontWeight={"bold"}>
              Selected colors:
            </Box>
            {Object.keys(selectedColors).map((colorID) => (
              <Tag.Root
                key={colorID}
                maxW={"120px"}
                bgColor={selectedColors[colorID].colorCode}
                color={getTextColor(selectedColors[colorID].colorCode)}
                size="lg"
                variant={"solid"}
              >
                <Tag.Label
                  maxW={"500px"}
                  overflowY={"hidden"}
                  overflowWrap={"break-word"}
                  display={"initial"}
                >
                  {selectedColors[colorID].colorDisplay}
                </Tag.Label>
                <Tag.EndElement>
                  <Tag.CloseTrigger
                    onClick={() => onClickDeleteSelected(colorID)}
                  />
                </Tag.EndElement>
              </Tag.Root>
            ))}
          </Flex>
          <Flex pt={"2px"} gap={"5px"} flexWrap={"wrap"} alignItems="center">
            <Box lineHeight={"short"} fontWeight={"bold"}>
              Selected chapters:
            </Box>
            {chaptersScope.length === 114 ? (
              <Box fontWeight={"bold"}>All chapters.</Box>
            ) : chaptersScope.length === 0 ? (
              <Box fontWeight={"bold"}>No chapters selected.</Box>
            ) : (
              chaptersScope.map((chapterID, index) => (
                <Tag.Root
                  colorPalette="green"
                  size="lg"
                  variant={"solid"}
                  key={index}
                >
                  <Tag.Label overflow={"visible"}>
                    {quranService.getChapterName(chapterID)}
                  </Tag.Label>
                  <Tag.EndElement>
                    <Tag.CloseTrigger
                      onClick={() => onClickCloseChapter(chapterID)}
                    />
                  </Tag.EndElement>
                </Tag.Root>
              ))
            )}
          </Flex>
        </Box>
      </Flex>
      {chaptersScope.length ? (
        <SelectedVerses
          selectedColors={selectedColors}
          coloredVerses={getSelectedColoredVerses()}
          openVerseModal={openVerseModal}
        />
      ) : (
        <Box textAlign={"center"} dir="ltr">
          You have to select at least one chapter.
        </Box>
      )}
    </>
  );
};

interface SelectedVersesProps {
  coloredVerses: coloredProps;
  selectedColors: coloredProps;
  openVerseModal: () => void;
}

function SelectedVerses({
  coloredVerses,
  selectedColors,
  openVerseModal,
}: SelectedVersesProps) {
  const quranService = useQuran();

  const scrollKey = useColoringPageStore((state) => state.scrollKey);

  const selectedVerses = useMemo(
    () =>
      Object.keys(coloredVerses)
        .filter((verseKey) =>
          Object.keys(selectedColors).includes(coloredVerses[verseKey].colorID)
        )
        .sort((keyA, KeyB) => {
          const infoA = keyA.split("-");
          const infoB = KeyB.split("-");
          if (Number(infoA[0]) !== Number(infoB[0]))
            return Number(infoA[0]) - Number(infoB[0]);
          else return Number(infoA[1]) - Number(infoB[1]);
        }),
    [coloredVerses, selectedColors]
  );

  // Handling scroll by using a callback ref
  const handleVerseListRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && scrollKey) {
        const verseToHighlight = node.querySelector(
          `[data-id="${scrollKey}"]`
        ) as HTMLDivElement;

        if (verseToHighlight) {
          verseToHighlight.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    },
    [scrollKey]
  );

  return (
    <Box px={2} dir="rtl" ref={handleVerseListRef}>
      {selectedVerses.length ? (
        selectedVerses.map((verseKey, index) => {
          const verse = quranService.getVerseByKey(verseKey)!;
          return (
            <SelectedVerseItem
              index={index}
              key={verse.key}
              verse={verse}
              verseColor={coloredVerses[verse.key]}
              openVerseModal={openVerseModal}
              isSelected={scrollKey === verse.key}
            />
          );
        })
      ) : (
        <Text textAlign="center" dir="ltr">
          There are no verses matching the selected colors.
        </Text>
      )}
    </Box>
  );
}

export { SelectedContainer };
