import { useEffect, useTransition, useState, useCallback } from "react";

import useQuran from "@/context/useQuran";
import { verseProps } from "quran-tools";

import { useAppSelector } from "@/store";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { ListTitle } from "@/components/Pages/Coloring/ListTitle";
import { SelectedContainer } from "@/components/Pages/Coloring/SelectedContainer";

import VerseModal from "@/components/Pages/Coloring/VerseModal";
import { VerseItem } from "@/components/Pages/Coloring/VerseItem";

import { Box, Flex, useDisclosure } from "@chakra-ui/react";

const VersesSide = () => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();

  const selectedColors = useAppSelector(
    (state) => state.coloringPage.selectedColors
  );

  return (
    <Flex flexDir={"column"} flex={1} pt={2} ps={1}>
      <Flex
        flexDir={"column"}
        overflowY={"scroll"}
        flex={1}
        bgColor={"brand.contrast"}
        color={"inherit"}
        border={"1px solid"}
        borderColor={"border"}
        borderRadius={"l3"}
      >
        {Object.keys(selectedColors).length ? (
          <SelectedContainer openVerseModal={onOpen} />
        ) : (
          <VersesList openVerseModal={onOpen} />
        )}
      </Flex>
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

  return (
    <>
      <ListTitle />
      {isPending ? (
        <LoadingSpinner text="Loading verses.." />
      ) : (
        <Box px={2} dir="rtl" ref={handleVerseListRef}>
          {stateVerses.map((verse) => (
            <VerseItem
              key={verse.key}
              verse={verse}
              verseColor={coloredVerses[verse.key]}
              isSelected={scrollKey === verse.key}
              openVerseModal={openVerseModal}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default VersesSide;
