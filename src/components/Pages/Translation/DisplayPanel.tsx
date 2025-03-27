import { useRef, useState, useTransition, useEffect, useCallback } from "react";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { translationPageActions } from "@/store/slices/pages/translation";

import { verseProps } from "@/types";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseContainer from "@/components/Custom/VerseContainer";

import TransComponent from "@/components/Pages/Translation/TransComponent";
import { Box, Flex } from "@chakra-ui/react";
import { ButtonVerse } from "@/components/Generic/Buttons";

interface DisplayPanelProps {
  selectChapter: string;
}

const DisplayPanel = ({ selectChapter }: DisplayPanelProps) => {
  const quranService = useQuran();

  const scrollKey = useAppSelector((state) => state.translationPage.scrollKey);

  const refDisplay = useRef<HTMLDivElement>(null);

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!refDisplay.current) return;

    startTransition(() => {
      setStateVerses(quranService.getVerses(selectChapter));
    });

    refDisplay.current.scrollTop = 0;
  }, [selectChapter]);

  // Handling scroll by using a callback ref with MutationObserver
  const handleVerseListRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && scrollKey) {
        const verseToHighlight = node.querySelector(
          `[data-id="${scrollKey}"]`
        ) as HTMLDivElement;

        if (verseToHighlight) {
          // using this observer method because otherwise the scroll stops too early
          const observer = new MutationObserver(() => {
            verseToHighlight.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            observer.disconnect(); // Stop observing once the scroll is done
          });

          observer.observe(verseToHighlight, {
            childList: true,
            subtree: true,
            attributes: true,
          });
        }
      }
    },
    [scrollKey, isPending]
  );

  return (
    <Box
      ref={refDisplay}
      flex={1}
      overflowY={"scroll"}
      minH={"100%"}
      padding={1}
    >
      <Flex flexDirection={"column"} minH={"100%"}>
        <Box
          p={2}
          fontSize={"larger"}
          textAlign={"center"}
          color={"blue.fg"}
          border={"1px solid"}
          borderColor={"border.emphasized"}
          bgColor={"gray.emphasized"}
          borderTopRadius={5}
        >
          سورة {quranService.getChapterName(selectChapter)}
        </Box>
        <Box
          flex={1}
          p={1}
          border={"1px solid"}
          borderColor={"border.emphasized"}
          bgColor={"brand.contrast"}
          ref={handleVerseListRef}
        >
          {isPending ? (
            <LoadingSpinner />
          ) : (
            stateVerses.map((verse) => {
              return (
                <VerseItem
                  key={verse.key}
                  isSelected={scrollKey === verse.key}
                  verse={verse}
                />
              );
            })
          )}
        </Box>
      </Flex>
    </Box>
  );
};

interface VerseItemProps {
  isSelected: boolean;
  verse: verseProps;
}

const VerseItem = ({ isSelected, verse }: VerseItemProps) => {
  const dispatch = useAppDispatch();

  const onClickVerse = () => {
    dispatch(translationPageActions.setScrollKey(verse.key));
  };

  return (
    <Box
      aria-selected={isSelected}
      _selected={{ bgColor: "yellow.subtle" }}
      data-id={verse.key}
    >
      <VerseContainer dir="rtl">
        {verse.versetext}{" "}
        <ButtonVerse onClick={onClickVerse}>({verse.verseid})</ButtonVerse>
      </VerseContainer>
      <TransComponent inputKey={verse.key} />
    </Box>
  );
};

export default DisplayPanel;
