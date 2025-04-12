import { useEffect, memo, useTransition, useState, useCallback } from "react";

import useQuran from "@/context/useQuran";
import { verseProps } from "quran-tools";

import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseModal from "@/components/Pages/Coloring/VerseModal";
import { colorProps, coloredProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";
import { Box, Button, Flex, Tag, Text, useDisclosure } from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import { useBoolean } from "usehooks-ts";

const VersesSide = () => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();

  const selectedColors = useAppSelector(
    (state) => state.coloringPage.selectedColors
  );

  return (
    <Flex flexDir={"column"} flex={1} w={"100%"} p={1}>
      <Box
        overflowY={"scroll"}
        flex={1}
        px={4}
        py={1}
        bgColor={"brand.contrast"}
        dir="rtl"
        color={"inherit"}
        border={"1px solid"}
        borderColor={"border"}
      >
        {Object.keys(selectedColors).length ? (
          <SelectedContainter openVerseModal={onOpen} />
        ) : (
          <VersesList openVerseModal={onOpen} />
        )}
      </Box>
      <VerseModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

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
      <Box pt={"2px"} pb={"5px"} dir="ltr">
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
    <div>
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
    </div>
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

interface VersesListProps {
  openVerseModal: () => void;
}

const VersesList = ({ openVerseModal }: VersesListProps) => {
  const scrollKey = useAppSelector((state) => state.coloringPage.scrollKey);
  const currentChapter = useAppSelector(
    (state) => state.coloringPage.currentChapter
  );
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );

  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

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
    [scrollKey, isPending]
  );

  useEffect(() => {
    //
    startTransition(() => {
      setStateVerses(quranService.getVerses(currentChapter));
    });
  }, [currentChapter]);

  if (isPending) return <LoadingSpinner />;

  return (
    <>
      <Box textAlign={"center"} fontSize={"larger"} color={"blue.500"} py={0}>
        سورة {quranService.getChapterName(currentChapter)}
      </Box>
      <div ref={handleVerseListRef}>
        {stateVerses.map((verse) => (
          <Box
            p={"5px"}
            borderBottom={"1.5px solid"}
            borderColor={"border.emphasized"}
            style={
              scrollKey === verse.key
                ? {
                    padding: 0,
                    border: "5px solid",
                    borderImage:
                      "linear-gradient(to right, #3acfd5 0%, yellow 25%, #3a4ed5 100%) 1",
                  }
                : {}
            }
            key={verse.key}
            data-id={verse.key}
            bgColor={coloredVerses[verse.key]?.colorCode}
            color={
              coloredVerses[verse.key]
                ? getTextColor(coloredVerses[verse.key].colorCode)
                : undefined
            }
          >
            <VerseComponent verse={verse} openVerseModal={openVerseModal} />
          </Box>
        ))}
      </div>
    </>
  );
};

interface VerseComponentProps {
  verse: verseProps;
  openVerseModal: () => void;
}

const VerseComponent = memo(
  ({ verse, openVerseModal }: VerseComponentProps) => {
    const { value: isOpen, toggle: setOpen } = useBoolean();
    const dispatch = useAppDispatch();

    const onClickVerseColor = (verse: verseProps) => {
      dispatch(coloringPageActions.setCurrentVerse(verse));
      openVerseModal();
    };

    function onClickVerse() {
      dispatch(coloringPageActions.setScrollKey(verse.key));
    }

    return (
      <>
        <VerseContainer>
          {verse.versetext}{" "}
          <ButtonVerse color={"inherit"} onClick={onClickVerse}>
            ({verse.verseid})
          </ButtonVerse>
          <ButtonExpand color={"inherit"} onClick={setOpen} />
          <Button variant={"ghost"} onClick={() => onClickVerseColor(verse)}>
            🎨
          </Button>
        </VerseContainer>
        <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
      </>
    );
  }
);

VerseComponent.displayName = "VerseComponent";

export default VersesSide;
