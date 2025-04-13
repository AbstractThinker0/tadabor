import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { useAppSelector } from "@/store";

import { verseProps } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseItem from "@/components/Pages/QuranBrowser/VerseItem";
import { Box, Heading } from "@chakra-ui/react";

interface ListTitleProps {
  chapterName: string;
}

const ListTitle = ({ chapterName }: ListTitleProps) => {
  return (
    <Heading
      textAlign="center"
      bgColor={"bg.muted"}
      color={"blue.focusRing"}
      py={3}
      size="3xl"
      border={"1px solid"}
      borderColor={"border.emphasized"}
      fontWeight="500"
    >
      سورة {chapterName}
    </Heading>
  );
};

const ListVerses = () => {
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  const scrollKey = useAppSelector((state) => state.qbPage.scrollKey);

  const selectChapter = useAppSelector((state) => state.qbPage.selectChapter);

  const chapterName = quranService.getChapterName(selectChapter);

  const refVerses = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startTransition(() => {
      setStateVerses(quranService.getVerses(selectChapter));
    });
  }, [selectChapter]);

  useEffect(() => {
    if (scrollKey && refVerses.current) {
      const verseToHighlight = refVerses.current.querySelector(
        `[data-id="${scrollKey}"]`
      ) as HTMLDivElement;

      if (verseToHighlight) {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [scrollKey, isPending]);

  return (
    <>
      <ListTitle chapterName={chapterName} />
      {isPending ? (
        <LoadingSpinner text="Loading verses..." />
      ) : (
        <Box p={1} ref={refVerses}>
          {stateVerses.map((verse: verseProps) => (
            <VerseItem
              key={verse.key}
              verse={verse}
              isSelected={scrollKey === verse.key}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default ListVerses;
