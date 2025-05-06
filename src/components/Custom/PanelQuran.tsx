import { useEffect, useState, useTransition, useRef } from "react";

import useQuran from "@/context/useQuran";

import { verseProps } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseContainer from "@/components/Custom/VerseContainer";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";
import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";

import { Box, Flex, Heading } from "@chakra-ui/react";
import { useBoolean } from "usehooks-ts";

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
    if (!verseKey) return;

    startTransition(() => {
      setStateVerses(quranService.getVerses(suraID));
    });
  }, [verseKey]);

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
      <Heading textAlign={"center"} color="blue.fg" fontSize={"3xl"} pb={"4"}>
        سورة {quranService.getChapterName(suraID)}
      </Heading>
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
  const { value: isOpen, toggle: setOpen } = useBoolean();

  return (
    <Box
      py={1}
      borderBottom={"1px solid"}
      borderColor={"border.emphasized"}
      aria-selected={isSelected}
      _selected={{ bgColor: "orange.muted" }}
      data-id={verse.key}
    >
      <VerseContainer>
        {verse.versetext}{" "}
        <ButtonVerse onClick={() => onClickVerseSuffix(verse.key)}>
          ({verse.verseid})
        </ButtonVerse>
        <ButtonExpand onClick={setOpen} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} noteType="verse" noteKey={verse.key} />
    </Box>
  );
};

export default PanelQuran;
