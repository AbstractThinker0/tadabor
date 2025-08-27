import { useState } from "react";

import useQuran from "@/context/useQuran";

import { useAppDispatch } from "@/store";
import { inspectorPageActions } from "@/store/slices/pages/inspector";

import type { verseProps, rootProps } from "quran-tools";

import { ButtonVerse } from "@/components/Generic/Buttons";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { Collapsible, Accordion, Span } from "@chakra-ui/react";

import { useBoolean } from "usehooks-ts";
import { RootItem } from "@/components/Custom/RootItem";

interface VerseItemProps {
  verse: verseProps;
  isSelected: boolean;
}

const VerseItem = ({ verse, isSelected }: VerseItemProps) => {
  const quranService = useQuran();
  const dispatch = useAppDispatch();

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
    dispatch(inspectorPageActions.setScrollKey(verse.key));
  };

  function onClickVerseChapter(verseKey: string) {
    dispatch(inspectorPageActions.setCurrentChapter(verseKey.split("-")[0]));
    dispatch(inspectorPageActions.setScrollKey(verseKey));
  }

  return (
    <BaseVerseItem
      verseKey={verse.key}
      isSelected={isSelected}
      rootProps={{ _selected: { bgColor: "blue.subtle" } }}
      outerEndElement={
        <Collapsible.Root open={isRootListOpen} lazyMount>
          <Collapsible.Content>
            <Accordion.Root
              borderRadius={"0.3rem"}
              mt={1}
              bgColor={"bg"}
              multiple
              lazyMount
            >
              {currentRoots.map((root) => (
                <RootItem
                  key={root.id}
                  root={root}
                  onClickVerseChapter={onClickVerseChapter}
                />
              ))}
            </Accordion.Root>
          </Collapsible.Content>
        </Collapsible.Root>
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
