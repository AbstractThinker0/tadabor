import { useCallback, useEffect, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";
import { useAppSelector } from "@/store";
import { translationsProps } from "@/types";
import { verseProps } from "quran-tools";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import UserTranslation from "@/components/Pages/Comparator/UserTranslation";
import { Box, Flex } from "@chakra-ui/react";
import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import { useBoolean } from "usehooks-ts";

interface DisplayProps {
  currentChapter: string;
  currentVerse: string;
  chapterVerses: verseProps[];
  transVerses: translationsProps;
  handleSelectVerse: (verseKey: string) => void;
}

const Display = ({
  currentChapter,
  currentVerse,
  chapterVerses,
  transVerses,
  handleSelectVerse,
}: DisplayProps) => {
  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);
  const quranService = useQuran();
  const [isPending, startTransition] = useTransition();

  const onClickVerse = (verseKey: string) => {
    const verseToSelect = currentVerse === verseKey ? "" : verseKey;
    handleSelectVerse(verseToSelect);
  };

  useEffect(() => {
    startTransition(() => {
      setStateVerses(chapterVerses);
    });
  }, [chapterVerses]);

  // Handling scroll by using a callback ref
  const handleVerseListRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && currentVerse) {
        const verseToHighlight = node.querySelector(
          `[data-id="${currentVerse}"]`
        ) as HTMLDivElement;

        if (verseToHighlight) {
          verseToHighlight.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    },
    [currentVerse, isPending]
  );

  return (
    <Flex
      flex={1}
      flexDirection={"column"}
      bgColor={"brand.bg"}
      px={5}
      smDown={{ px: "5px" }}
    >
      <Box
        bgColor={"bg.subtle"}
        textAlign={"center"}
        fontSize={"xx-large"}
        color={"blue.solid"}
      >
        سورة {quranService.getChapterName(currentChapter)}
      </Box>
      <Flex flexDirection={"column"} flex={1} ref={handleVerseListRef}>
        {isPending ? (
          <LoadingSpinner text="Loading verses.." />
        ) : (
          stateVerses.map((verse) => (
            <VerseItem
              transVerses={transVerses}
              onClickVerse={onClickVerse}
              verse={verse}
              isSelected={currentVerse === verse.key}
              key={verse.key}
            />
          ))
        )}
      </Flex>
    </Flex>
  );
};

interface VerseItemProps {
  verse: verseProps;
  isSelected: boolean;
  transVerses: translationsProps;
  onClickVerse: (verseKey: string) => void;
}

const VerseItem = ({
  verse,
  isSelected,
  transVerses,
  onClickVerse,
}: VerseItemProps) => {
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const { value: isOpen, toggle: setOpen } = useBoolean();

  return (
    <Box
      px={"5px"}
      aria-selected={isSelected}
      _selected={{ bgColor: "orange.emphasized" }}
    >
      <VerseContainer
        dir="rtl"
        py={2}
        borderTop={"1px solid"}
        borderBottom={"1px solid"}
        borderColor={"border.emphasized"}
        data-id={verse.key}
      >
        {verse.versetext}
        <ButtonVerse onClick={() => onClickVerse(verse.key)}>
          ({verse.verseid})
        </ButtonVerse>
        <ButtonExpand onClick={setOpen} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
      {Object.keys(transVerses).map((trans) => (
        <Box py={2} key={trans} dir="ltr">
          <Box color={"fg.muted"}>{trans}</Box>
          <Box fontSize={`${notesFS}rem`}>
            {transVerses[trans][verse.rank].versetext}
          </Box>
        </Box>
      ))}
      <UserTranslation verseKey={verse.key} />
    </Box>
  );
};

export default Display;
