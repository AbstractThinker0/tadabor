import { useEffect, useState, useTransition, type RefObject } from "react";

import useQuran from "@/context/useQuran";
import { useAppSelector } from "@/store";
import type { translationsProps } from "@/types";
import type { verseProps } from "quran-tools";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { Box, Flex, Span } from "@chakra-ui/react";
import { CollapsibleNote } from "@/components/Note/CollapsibleNote";
import { useBoolean } from "usehooks-ts";
import { NoteForm } from "@/components/Note/NoteForm";

interface DisplayProps {
  currentChapter: string;
  currentVerse: string;
  chapterVerses: verseProps[];
  transVerses: translationsProps;
  handleSelectVerse: (verseKey: string) => void;
  refVerseList: RefObject<HTMLDivElement | null>;
}

const Display = ({
  currentChapter,
  currentVerse,
  chapterVerses,
  transVerses,
  handleSelectVerse,
  refVerseList,
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

  // Handling scroll
  useEffect(() => {
    const node = refVerseList.current;

    if (!node || isPending || !currentVerse) return;

    const verseToHighlight = node.querySelector(
      `[data-id="${currentVerse}"]`
    ) as HTMLDivElement;

    if (verseToHighlight) {
      verseToHighlight.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [refVerseList, currentVerse, isPending]);

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
      <Flex flexDirection={"column"} flex={1} ref={refVerseList}>
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
        <Span>
          {verse.versetext}
          <ButtonVerse onClick={() => onClickVerse(verse.key)}>
            ({verse.verseid})
          </ButtonVerse>
        </Span>
        <ButtonExpand onClick={setOpen} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} noteType="verse" noteKey={verse.key} />
      {Object.keys(transVerses).map((trans) => (
        <Box py={2} key={trans} dir="ltr">
          <Box color={"fg.muted"}>{trans}</Box>
          <Box fontSize={`${notesFS}rem`}>
            {transVerses[trans][verse.rank].versetext}
          </Box>
        </Box>
      ))}
      <Box py={2} dir="ltr">
        <Box color={"fg.muted"}>Your translation</Box>
        <NoteForm
          rootProps={{ bgColor: "inherit" }}
          isOpen={true}
          noteKey={verse.key}
          noteType="translation"
        />
      </Box>
    </Box>
  );
};

export default Display;
