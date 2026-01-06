import { useRef, useState, useTransition, useEffect, useCallback } from "react";

import useQuran from "@/context/useQuran";

import { useTranslationPageStore } from "@/store/pages/translationPage";

import type { verseProps } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { CollapsibleNote } from "@/components/Note/CollapsibleNote";

import { Box, Flex, IconButton } from "@chakra-ui/react";

import { ButtonVerse } from "@/components/Generic/Buttons";
import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { ChapterHeader } from "@/components/Custom/ChapterHeader";

import { useBoolean } from "usehooks-ts";

import { AiOutlineTranslation } from "react-icons/ai";

const DisplayPanel = () => {
  const quranService = useQuran();
  const currentChapter = useTranslationPageStore(
    (state) => state.currentChapter
  );

  const scrollKey = useTranslationPageStore((state) => state.scrollKey);

  const refDisplay = useRef<HTMLDivElement>(null);

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!refDisplay.current) return;

    startTransition(() => {
      setStateVerses(quranService.getVerses(currentChapter));
    });

    refDisplay.current.scrollTop = 0;
  }, [currentChapter, quranService]);

  // Handling scroll by using a callback ref with MutationObserver
  const handleVerseListRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && scrollKey && !isPending) {
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
  const selectChapter = useTranslationPageStore(
    (state) => state.currentChapter
  );

  const showSearchPanel = useTranslationPageStore(
    (state) => state.showSearchPanel
  );

  const showSearchPanelMobile = useTranslationPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useTranslationPageStore(
    (state) => state.setSearchPanel
  );

  const onTogglePanel = (state: boolean) => {
    setSearchPanel(state);
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
  const { value: isOpen, toggle } = useBoolean(true);

  const setScrollKey = useTranslationPageStore((state) => state.setScrollKey);

  const onClickVerse = () => {
    setScrollKey(verse.key);
  };

  return (
    <BaseVerseItem
      verseKey={verse.key}
      isSelected={isSelected}
      rootProps={{ _selected: { bgColor: "yellow.subtle" } }}
      endElement={
        <IconButton
          aria-label="Expand"
          onClick={toggle}
          variant={isOpen ? "solid" : "ghost"}
          colorPalette={isOpen ? "teal" : undefined}
          width={"6px"}
          height={"36px"}
        >
          <AiOutlineTranslation />
        </IconButton>
      }
      outerEndElement={
        <CollapsibleNote
          isOpen={isOpen}
          noteKey={verse.key}
          noteType={"translation"}
        />
      }
    >
      {verse.versetext}{" "}
      <ButtonVerse onClick={onClickVerse}>({verse.verseid})</ButtonVerse>
    </BaseVerseItem>
  );
};

export default DisplayPanel;
