import { useRef, useState, useTransition, useEffect } from "react";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { translationPageActions } from "@/store/slices/pages/translation";

import { verseProps } from "@/types";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseContainer from "@/components/Custom/VerseContainer";

import TransComponent from "@/components/Pages/Translation/TransComponent";
import { Box, Button, Flex } from "@chakra-ui/react";

interface DisplayPanelProps {
  selectChapter: string;
}

const DisplayPanel = ({ selectChapter }: DisplayPanelProps) => {
  const quranService = useQuran();

  const scrollKey = useAppSelector((state) => state.translationPage.scrollKey);

  const refDisplay = useRef<HTMLDivElement>(null);
  const refListVerses = useRef<HTMLDivElement>(null);

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!refDisplay.current) return;

    startTransition(() => {
      setStateVerses(quranService.getVerses(selectChapter));
    });

    refDisplay.current.scrollTop = 0;
  }, [selectChapter]);

  useEffect(() => {
    if (!scrollKey) return;

    if (!refListVerses.current) return;

    const verseToHighlight = refListVerses.current.querySelector(
      `[data-id="${scrollKey}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [scrollKey, isPending]);

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
          color={"blue.500"}
          border={"1px solid gray"}
          backgroundColor={"gainsboro"}
          borderTopRadius={5}
        >
          سورة {quranService.getChapterName(selectChapter)}
        </Box>
        <Box
          flex={1}
          p={1}
          border={"1px solid gainsboro"}
          backgroundColor={"#f7fafc"}
          ref={refListVerses}
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

  const onClickVerse = (verseKey: string) => {
    dispatch(translationPageActions.setScrollKey(verseKey));
  };

  return (
    <Box
      backgroundColor={isSelected ? "antiquewhite" : undefined}
      data-id={verse.key}
    >
      <VerseContainer dir="rtl">
        {verse.versetext}{" "}
        <Button
          variant="ghost"
          _hover={{ color: "cornflowerblue" }}
          onClick={() => onClickVerse(verse.key)}
          fontSize={"inherit"}
        >
          ({verse.verseid})
        </Button>
      </VerseContainer>
      <TransComponent verse_key={verse.key} />
    </Box>
  );
};

export default DisplayPanel;
