import type { rootProps, verseMatchResult, verseProps } from "quran-tools";
import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { ButtonVerse } from "@/components/Generic/Buttons";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";
import { Accordion, Collapsible, IconButton, Span } from "@chakra-ui/react";
import { VscInspect } from "react-icons/vsc";

import { useBoolean } from "usehooks-ts";
import { useState } from "react";

import { RootItem } from "@/components/Custom/RootItem";

interface VerseItemProps {
  verse: verseProps;
  isSelected: boolean;
}

const VerseItem = ({ verse, isSelected }: VerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const toolInspect = useAppSelector((state) => state.navigation.toolInspect);

  const { value: isInspectorON, toggle: toggleInspector } = useBoolean();
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
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  return (
    <BaseVerseItem
      verseKey={verse.key}
      isSelected={isSelected}
      endElement={
        toolInspect && (
          <IconButton
            variant={isInspectorON ? "solid" : "ghost"}
            aria-label="Inspect"
            colorPalette={isInspectorON ? "teal" : undefined}
            onClick={toggleInspector}
          >
            <VscInspect />
          </IconButton>
        )
      }
      outerEndElement={
        <Collapsible.Root
          open={toolInspect && isInspectorON && isRootListOpen}
          lazyMount
        >
          <Collapsible.Content>
            <Accordion.Root
              borderRadius={"0.3rem"}
              mt={1}
              bgColor={"bg"}
              multiple
              lazyMount
            >
              {currentRoots.map((root) => (
                <RootItem key={root.id} root={root} />
              ))}
            </Accordion.Root>
          </Collapsible.Content>
        </Collapsible.Root>
      }
    >
      {toolInspect && isInspectorON
        ? verse.versetext.split(" ").map((word, index) => (
            <Span key={index}>
              <Span
                cursor={"pointer"}
                p={"2px"}
                border={"1px solid"}
                borderRadius={"0.3rem"}
                borderColor={"orange.fg"}
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
          ))
        : verse.versetext}{" "}
      <ButtonVerse onClick={onClickVerse}>{`(${verse.verseid})`}</ButtonVerse>
    </BaseVerseItem>
  );
};

interface SearchVerseItemProps {
  verse: verseMatchResult;
  isSelected: boolean;
  index: number;
}

const SearchVerseItem = ({
  verse,
  isSelected,
  index,
}: SearchVerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const onClickVerseChapter = () => {
    dispatch(qbPageActions.gotoChapter(verse.suraid));
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  const onClickVerse = () => {
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  return (
    <BaseVerseItem
      verseKey={verse.key}
      isSelected={isSelected}
      rootProps={{ paddingStart: "5px" }}
    >
      <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
        {index + 1}.
      </Span>{" "}
      <VerseHighlightMatches verse={verse} /> (
      <ButtonVerse onClick={onClickVerseChapter}>
        {quranService.getChapterName(verse.suraid)}
      </ButtonVerse>
      :<ButtonVerse onClick={onClickVerse}>{verse.verseid}</ButtonVerse>)
    </BaseVerseItem>
  );
};

export { VerseItem, SearchVerseItem };
