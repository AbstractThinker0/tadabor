import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { useAppSelector } from "@/store";

import { verseProps } from "quran-tools";

import { VerseItem } from "@/components/Pages/Inspector/VerseItem";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { Flex } from "@chakra-ui/react";

interface ListVersesProps {
  currentChapter: string;
}

const ListVerses = ({ currentChapter }: ListVersesProps) => {
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  const scrollKey = useAppSelector((state) => state.inspectorPage.scrollKey);

  const refVerses = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startTransition(() => {
      setStateVerses(quranService.getVerses(currentChapter));
    });
  }, [currentChapter]);

  // Handling scroll by using a callback ref
  useEffect(() => {
    if (refVerses.current && scrollKey) {
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
    <Flex
      flex={1}
      flexDirection={"column"}
      ref={refVerses}
      py={"0.5rem"}
      px={"0.25rem"}
      dir="rtl"
    >
      {isPending ? (
        <LoadingSpinner text="Loading verses.." />
      ) : (
        stateVerses.map((verse) => (
          <VerseItem
            key={verse.key}
            verse={verse}
            isSelected={scrollKey === verse.key}
          />
        ))
      )}
    </Flex>
  );
};

export default ListVerses;
