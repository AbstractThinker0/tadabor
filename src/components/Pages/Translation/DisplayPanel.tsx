import { useRef, useState, useTransition, useEffect, useCallback } from "react";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { translationPageActions } from "@/store/slices/pages/translation";

import { verseProps } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseContainer from "@/components/Custom/VerseContainer";

import TransComponent from "@/components/Pages/Translation/TransComponent";
import { Box, Flex } from "@chakra-ui/react";
import { ButtonVerse } from "@/components/Generic/Buttons";
import { ChapterHeader } from "@/components/Generic/ChapterHeader";

const DisplayPanel = () => {
  const quranService = useQuran();
  const currentChapter = useAppSelector(
    (state) => state.translationPage.currentChapter
  );

  const scrollKey = useAppSelector((state) => state.translationPage.scrollKey);

  const refDisplay = useRef<HTMLDivElement>(null);

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!refDisplay.current) return;

    startTransition(() => {
      setStateVerses(quranService.getVerses(currentChapter));
    });

    refDisplay.current.scrollTop = 0;
  }, [currentChapter]);

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
        <ListTitle />
        <Flex
          flex={1}
          flexDirection={"column"}
          p={1}
          border={"1px solid"}
          borderColor={"border.emphasized"}
          bgColor={"brand.contrast"}
          ref={handleVerseListRef}
        >
          {isPending ? (
            <LoadingSpinner text="Loading verses.." />
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
        </Flex>
      </Flex>
    </Box>
  );
};

const ListTitle = () => {
  const selectChapter = useAppSelector(
    (state) => state.translationPage.currentChapter
  );

  const showSearchPanel = useAppSelector(
    (state) => state.translationPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.translationPage.showSearchPanelMobile
  );

  const dispatch = useAppDispatch();

  const onTogglePanel = (state: boolean) => {
    dispatch(translationPageActions.setSearchPanel(state));
  };

  return (
    <ChapterHeader
      chapterID={Number(selectChapter)}
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
    />
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
