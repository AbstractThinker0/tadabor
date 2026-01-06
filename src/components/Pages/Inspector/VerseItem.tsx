import { useState } from "react";

import useQuran from "@/context/useQuran";

import { useInspectorPageStore } from "@/store/zustand/inspectorPage";

import type { verseProps, rootProps } from "quran-tools";

import { ButtonVerse } from "@/components/Generic/Buttons";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { Span } from "@chakra-ui/react";

import { useBoolean } from "usehooks-ts";

import { RootsAccordion } from "@/components/Custom/VerseInspected";

interface VerseItemProps {
  verse: verseProps;
  isSelected: boolean;
}

const VerseItem = ({ verse, isSelected }: VerseItemProps) => {
  const quranService = useQuran();
  const setScrollKey = useInspectorPageStore((state) => state.setScrollKey);
  const setCurrentChapter = useInspectorPageStore(
    (state) => state.setCurrentChapter
  );

  const { value: isRootListOpen, setValue: setRootListOpen } = useBoolean();

  const [currentRoots, setCurrentRoots] = useState<rootProps[]>([]);
  const [selectedWord, setSelectedWord] = useState(-1);

  const onClickWord = (wordIndex: number) => {
    const wordRoots = quranService.getWordRoots(verse.rank, wordIndex);

    setCurrentRoots(wordRoots.sort((a, b) => b.name.length - a.name.length));

    if (selectedWord === wordIndex) {
      setRootListOpen(false);
      setSelectedWord(-1);
    } else {
      setRootListOpen(true);
      setSelectedWord(wordIndex);
    }
  };

  const onClickVerse = () => {
    setScrollKey(verse.key);
  };

  function onClickVerseChapter(verseKey: string) {
    setCurrentChapter(verseKey.split("-")[0]);
    setScrollKey(verseKey);
  }

  return (
    <BaseVerseItem
      verseKey={verse.key}
      isSelected={isSelected}
      rootProps={{ _selected: { bgColor: "blue.subtle" } }}
      outerEndElement={
        <RootsAccordion
          isOpen={isRootListOpen}
          rootsList={currentRoots}
          onClickVerseChapter={onClickVerseChapter}
        />
      }
    >
      {verse.versetext.split(" ").map((word, index) => (
        <Span key={index}>
          <Span
            cursor={"pointer"}
            py={"2px"}
            borderRadius={"0.3rem"}
            _hover={{ bgColor: "orange.emphasized" }}
            aria-selected={selectedWord === index + 1}
            _selected={{
              bgColor: "orange.emphasized",
            }}
            onClick={() => onClickWord(index + 1)}
          >
            {word}
          </Span>{" "}
        </Span>
      ))}{" "}
      <ButtonVerse onClick={onClickVerse}>{`(${verse.verseid})`}</ButtonVerse>
    </BaseVerseItem>
  );
};

VerseItem.displayName = "VerseItem";

export { VerseItem };
