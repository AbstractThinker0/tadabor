import { useEffect, useTransition, useState, useCallback } from "react";

import useQuran from "@/context/useQuran";
import { verseProps } from "quran-tools";

import { useAppSelector } from "@/store";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { ListTitle } from "@/components/Pages/Coloring/ListTitle";
import { SelectedContainter } from "@/components/Pages/Coloring/SelectedContainer";
import { VerseComponent } from "@/components/Pages/Coloring/VerseComponent";
import VerseModal from "@/components/Pages/Coloring/VerseModal";

import { getTextColor } from "@/components/Pages/Coloring/util";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";

const VersesSide = () => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();

  const selectedColors = useAppSelector(
    (state) => state.coloringPage.selectedColors
  );

  return (
    <Flex flexDir={"column"} flex={1} pt={2} ps={1}>
      <Box
        overflowY={"scroll"}
        flex={1}
        bgColor={"brand.contrast"}
        dir="rtl"
        color={"inherit"}
        border={"1px solid"}
        borderColor={"border"}
        borderRadius={"l3"}
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
      <ListTitle />
      <Box px={2} ref={handleVerseListRef}>
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
      </Box>
    </>
  );
};

export default VersesSide;
