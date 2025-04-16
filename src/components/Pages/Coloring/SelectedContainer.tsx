import { verseProps } from "quran-tools";

import { useAppSelector, useAppDispatch } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import useQuran from "@/context/useQuran";

import { Box, Flex, Tag, Button, Text } from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import VerseContainer from "@/components/Custom/VerseContainer";
import { ButtonVerse, ButtonExpand } from "@/components/Generic/Buttons";

import { ButtonSidebar } from "@/components/Pages/Coloring/ButtonSidebar";
import { coloredProps, colorProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

import { useBoolean } from "usehooks-ts";

interface SelectedContainterProps {
  openVerseModal: () => void;
}

const SelectedContainter = ({ openVerseModal }: SelectedContainterProps) => {
  const selectedChapters = useAppSelector(
    (state) => state.coloringPage.selectedChapters
  );
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );
  const selectedColors = useAppSelector(
    (state) => state.coloringPage.selectedColors
  );

  const dispatch = useAppDispatch();
  const quranService = useQuran();

  function onClickDeleteSelected(colorID: string) {
    dispatch(coloringPageActions.deselectColor(colorID));
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
    dispatch(coloringPageActions.toggleSelectChapter(Number(chapterID)));
  };

  return (
    <>
      <Flex
        pt={"2px"}
        pb={"5px"}
        px={1}
        dir="ltr"
        justifyContent={"space-between"}
      >
        <Box>
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
        <Box pt={1}>
          <ButtonSidebar />
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

  const selectedVerses = Object.keys(coloredVerses).filter((verseKey) =>
    Object.keys(selectedColors).includes(coloredVerses[verseKey].colorID)
  );

  return (
    <Box px={2}>
      {selectedVerses.length ? (
        selectedVerses
          .sort((keyA, KeyB) => {
            const infoA = keyA.split("-");
            const infoB = KeyB.split("-");
            if (Number(infoA[0]) !== Number(infoB[0]))
              return Number(infoA[0]) - Number(infoB[0]);
            else return Number(infoA[1]) - Number(infoB[1]);
          })
          .map((verseKey) => {
            const verse = quranService.getVerseByKey(verseKey)!;
            return (
              <SelectedVerseItem
                key={verse.key}
                verse={verse}
                verseColor={coloredVerses[verse.key]}
                openVerseModal={openVerseModal}
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

interface SelectedVerseItemProps {
  verse: verseProps;
  verseColor: colorProps | undefined;
  openVerseModal: () => void;
}

const SelectedVerseItem = ({
  verse,
  verseColor,
  openVerseModal,
}: SelectedVerseItemProps) => {
  const { value: isOpen, toggle: setOpen } = useBoolean();
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const onClickChapter = (verse: verseProps) => {
    dispatch(coloringPageActions.gotoChapter(Number(verse.suraid)));
    dispatch(coloringPageActions.setScrollKey(verse.key));
  };

  const onClickVerseColor = (verse: verseProps) => {
    dispatch(coloringPageActions.setCurrentVerse(verse));
    openVerseModal();
  };

  return (
    <Box
      p={1}
      borderBottom={"1.5px solid"}
      borderColor={"border.emphasized"}
      key={verse.key}
      bgColor={verseColor?.colorCode}
      color={verseColor ? getTextColor(verseColor.colorCode) : undefined}
    >
      <VerseContainer>
        {verse.versetext}{" "}
        <ButtonVerse
          color={"inherit"}
          onClick={() => onClickChapter(verse)}
        >{`(${quranService.getChapterName(verse.suraid)}:${
          verse.verseid
        })`}</ButtonVerse>
        <ButtonExpand onClick={setOpen} color={"inherit"} />
        <Button variant={"ghost"} onClick={() => onClickVerseColor(verse)}>
          🎨
        </Button>
      </VerseContainer>

      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
    </Box>
  );
};

export { SelectedContainter };
