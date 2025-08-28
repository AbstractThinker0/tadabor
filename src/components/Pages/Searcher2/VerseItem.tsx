import { useAppDispatch, useAppSelector } from "@/store";

import { searcher2PageActions } from "@/store/slices/pages/searcher2";

import useQuran from "@/context/useQuran";
import type { rootProps, verseMatchResult } from "quran-tools";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { Accordion, Collapsible, IconButton, Span } from "@chakra-ui/react";

import { ButtonVerse } from "@/components/Generic/Buttons";

import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";
import { useBoolean } from "usehooks-ts";
import { useState } from "react";

import { VscInspect } from "react-icons/vsc";
import { RootItem } from "@/components/Custom/RootItem";

interface VerseItemProps {
  index: number;
  verseMatch: verseMatchResult;
  isSelected: boolean;
}

const VerseItem = ({ verseMatch, isSelected, index }: VerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();

  const toolInspect = useAppSelector((state) => state.navigation.toolInspect);

  const { value: isInspectorON, toggle: toggleInspector } = useBoolean();
  const { value: isRootListOpen, setValue: setRootListOpen } = useBoolean();

  const [currentRoots, setCurrentRoots] = useState<rootProps[]>([]);
  const [selectedWord, setSelectedWord] = useState(-1);

  const onClickWord = (wordIndex: number) => {
    const verseRank = quranService.getVerseByKey(verseMatch.key).rank;
    const wordRoots = quranService.getWordRoots(verseRank, wordIndex);

    setCurrentRoots(wordRoots.sort((a, b) => b.name.length - a.name.length));

    if (selectedWord === wordIndex) {
      setRootListOpen(false);
      setSelectedWord(-1);
    } else {
      setRootListOpen(true);
      setSelectedWord(wordIndex);
    }
  };

  const onClickVerseChapter = (verseKey: string) => {
    dispatch(searcher2PageActions.setVerseTab(verseKey.split("-")[0]));
    dispatch(searcher2PageActions.setScrollKey(verseKey));
  };

  const onClickVerse = () => {
    if (isSelected) {
      dispatch(searcher2PageActions.setScrollKey(""));
    } else {
      dispatch(searcher2PageActions.setScrollKey(verseMatch.key));
    }
  };

  return (
    <BaseVerseItem
      rootProps={{
        lineHeight: toolInspect && isInspectorON ? "3.3rem" : "normal",
      }}
      verseKey={verseMatch.key}
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
      <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
        {index + 1}.
      </Span>{" "}
      {toolInspect && isInspectorON ? (
        quranService
          .getVerseTextByKey(verseMatch.key)
          .split(" ")
          .map((word, index) => (
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
      ) : (
        <VerseHighlightMatches verse={verseMatch} />
      )}{" "}
      (
      <ButtonVerse onClick={() => onClickVerseChapter(verseMatch.key)}>
        {quranService.getChapterName(verseMatch.suraid)}
      </ButtonVerse>
      :<ButtonVerse onClick={onClickVerse}>{verseMatch.verseid}</ButtonVerse>)
    </BaseVerseItem>
  );
};

export { VerseItem };
