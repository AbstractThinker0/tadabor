import { useEffect, memo, useRef, useTransition, useState } from "react";

import useQuran from "@/context/useQuran";
import { verseProps } from "@/types";

import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseModal from "@/components/Pages/Coloring/VerseModal";
import { colorProps, coloredProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Flex,
  Text,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";

const VersesSide = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectedColors = useAppSelector(
    (state) => state.coloringPage.selectedColors
  );

  return (
    <Flex flexDir={"column"} flex={1} w={"100%"} p={1}>
      <Card
        overflowY={"scroll"}
        flex={1}
        px={4}
        py={1}
        bgColor={"#f7fafc"}
        dir="rtl"
      >
        {Object.keys(selectedColors).length ? (
          <SelectedContainter openVerseModal={onOpen} />
        ) : (
          <VersesList openVerseModal={onOpen} />
        )}
      </Card>
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

  return (
    <>
      <Box pt={"2px"} pb={"5px"} dir="ltr">
        <Flex flexWrap={"wrap"} gap={"5px"}>
          <Box fontWeight={"bold"}>Selected colors:</Box>
          {Object.keys(selectedColors).map((colorID) => (
            <Flex
              key={colorID}
              justify={"space-between"}
              maxW={"120px"}
              px={"5px"}
              borderRadius={3}
              backgroundColor={selectedColors[colorID].colorCode}
              color={getTextColor(selectedColors[colorID].colorCode)}
            >
              <div></div>
              <Box
                maxW={"500px"}
                overflowY={"hidden"}
                overflowWrap={"break-word"}
              >
                {selectedColors[colorID].colorDisplay}
              </Box>
              <Box
                cursor={"pointer"}
                px={"3px"}
                onClick={() => onClickDeleteSelected(colorID)}
              >
                X
              </Box>
            </Flex>
          ))}
        </Flex>
        <Flex pt={"2px"} gap={"5px"} flexWrap={"wrap"}>
          <Box fontWeight={"bold"}>Selected chapters:</Box>
          {chaptersScope.length === 114 ? (
            <Box fontWeight={"bold"}>All chapters.</Box>
          ) : chaptersScope.length === 0 ? (
            <Box fontWeight={"bold"}>No chapters selected.</Box>
          ) : (
            chaptersScope.map((chapterID) => (
              <Box
                bgColor={"beige"}
                p={1}
                borderRadius={"0.3rem"}
                key={chapterID}
              >
                {quranService.getChapterName(chapterID)}
              </Box>
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
            const verse = quranService.getVerseByKey(verseKey);
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
  const [isOpen, setOpen] = useBoolean();
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
      borderBottom={"1.5px solid rgba(220, 220, 220, 0.893)"}
      key={verse.key}
      backgroundColor={verseColor?.colorCode}
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
        <ButtonExpand onClick={setOpen.toggle} color={"inherit"} />
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

  const refListVerse = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollKey || !refListVerse.current) return;

    const verseToHighlight = refListVerse.current.querySelector(
      `[data-id="${scrollKey}"]`
    );

    setTimeout(() => {
      if (verseToHighlight) {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  }, [scrollKey, isPending]);

  useEffect(() => {
    //
    startTransition(() => {
      setStateVerses(quranService.getVerses(currentChapter));
    });
  }, [currentChapter]);

  if (isPending) return <LoadingSpinner />;

  return (
    <>
      <CardHeader
        textAlign={"center"}
        fontSize={"larger"}
        color={"blue.500"}
        py={0}
      >
        سورة {quranService.getChapterName(currentChapter)}
      </CardHeader>
      <div ref={refListVerse}>
        {stateVerses.map((verse) => (
          <Box
            p={"5px"}
            borderBottom={"1.5px solid rgba(220, 220, 220, 0.893)"}
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
            backgroundColor={coloredVerses[verse.key]?.colorCode}
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
    const [isOpen, setOpen] = useBoolean();
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
          <ButtonExpand color={"inherit"} onClick={setOpen.toggle} />
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
