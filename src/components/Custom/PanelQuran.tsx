import { useEffect, useState, useTransition, useRef } from "react";

import useQuran from "@/context/useQuran";

import type { verseProps } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { ButtonVerse } from "@/components/Generic/Buttons";

import { Flex } from "@chakra-ui/react";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { ChapterHeader } from "@/components/Custom/ChapterHeader";

interface PanelQuranProps {
  verseKey: string;
  scrollKey: string;
  setScrollKey: (key: string) => void;
}

const PanelQuran = ({ verseKey, scrollKey, setScrollKey }: PanelQuranProps) => {
  const quranService = useQuran();
  const suraID = verseKey.split("-")[0];

  const [isPending, startTransition] = useTransition();
  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const refVerses = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!suraID) return;

    startTransition(() => {
      setStateVerses(quranService.getVerses(suraID));
    });
  }, [suraID, quranService]);

  // Handling scroll
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

  const onClickVerseSuffix = (key: string) => {
    if (scrollKey === key) {
      setScrollKey("");
    } else {
      setScrollKey(key);
    }
  };

  if (!verseKey) return null;

  return (
    <Flex
      flexDirection={"column"}
      bgColor={"brand.bg"}
      py={"1rem"}
      px={"1rem"}
      smDown={{ px: "0.5rem" }}
      overflowY={"scroll"}
      maxH={"100%"}
      height={"100%"}
      ref={refVerses}
      dir="rtl"
    >
      <ChapterHeader chapterID={Number(suraID)} versesOptions={true} />
      {isPending ? (
        <LoadingSpinner text="Loading verses.." />
      ) : (
        stateVerses.map((verse) => (
          <VerseItem
            key={verse.key}
            verse={verse}
            isSelected={scrollKey === verse.key}
            onClickVerseSuffix={onClickVerseSuffix}
          />
        ))
      )}
    </Flex>
  );
};

interface VerseItemProps {
  verse: verseProps;
  isSelected: boolean;
  onClickVerseSuffix: (key: string) => void;
}

const VerseItem = ({
  verse,
  isSelected,
  onClickVerseSuffix,
}: VerseItemProps) => {
  return (
    <BaseVerseItem verseKey={verse.key} isSelected={isSelected}>
      {verse.versetext}{" "}
      <ButtonVerse onClick={() => onClickVerseSuffix(verse.key)}>
        ({verse.verseid})
      </ButtonVerse>
    </BaseVerseItem>
  );
};

export default PanelQuran;
