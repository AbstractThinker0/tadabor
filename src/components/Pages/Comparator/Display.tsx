import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";
import { useAppSelector } from "@/store";
import { verseProps, translationsProps } from "@/types";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import UserTranslation from "@/components/Pages/Comparator/UserTranslation";
import { Box, useBoolean } from "@chakra-ui/react";
import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";

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

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setStateVerses(chapterVerses);
    });
  }, [chapterVerses]);

  useEffect(() => {
    if (isPending) return;

    if (!refListVerses.current) return;

    if (!currentVerse) return;

    const verseToHighlight = refListVerses.current.querySelector(
      `[data-id="${currentVerse}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [isPending]);

  const quranService = useQuran();
  const refListVerses = useRef<HTMLDivElement>(null);

  const onClickVerse = (verseKey: string) => {
    const verseToSelect = currentVerse === verseKey ? "" : verseKey;
    handleSelectVerse(verseToSelect);
  };

  useEffect(() => {
    if (!refListVerses.current) return;

    if (!currentVerse) return;

    const verseToHighlight = refListVerses.current.querySelector(
      `[data-id="${currentVerse}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [currentVerse]);

  return (
    <Box bgColor={"#f7fafc"} px={5}>
      <Box
        bgColor={"rgba(33, 37, 41, .03)"}
        textAlign={"center"}
        fontSize={"xx-large"}
        color={"blue.500"}
      >
        سورة {quranService.getChapterName(currentChapter)}
      </Box>
      <Box ref={refListVerses}>
        {isPending ? (
          <LoadingSpinner />
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
      </Box>
    </Box>
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

  const [isOpen, setOpen] = useBoolean();

  return (
    <Box px={"5px"} bgColor={isSelected ? "antiquewhite" : undefined}>
      <VerseContainer
        dir="rtl"
        py={2}
        borderTop={"1px solid #dee2e6"}
        borderBottom={"1px solid #dee2e6"}
        data-id={verse.key}
      >
        {verse.versetext}
        <ButtonVerse onClick={() => onClickVerse(verse.key)}>
          ({verse.verseid})
        </ButtonVerse>
        <ButtonExpand onClick={setOpen.toggle} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
      {Object.keys(transVerses).map((trans) => (
        <Box py={2} key={trans} dir="ltr">
          <Box color={"rgb(108, 117, 125)"}>{trans}</Box>
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
