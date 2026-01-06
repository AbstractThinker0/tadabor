import type { rootProps, verseMatchResult, verseProps } from "quran-tools";
import useQuran from "@/context/useQuran";

import { useQuranBrowserPageStore } from "@/store/pages/quranBrowserPage";
import { useNavigationStore } from "@/store/global/navigationStore";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { ButtonVerse } from "@/components/Generic/Buttons";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";
import { Span } from "@chakra-ui/react";

import { useBoolean } from "usehooks-ts";
import { useState } from "react";

import { ButtonInspect } from "@/components/Custom/ButtonInspect";
import {
  RootsAccordion,
  VerseInspected,
} from "@/components/Custom/VerseInspected";

interface VerseItemProps {
  verse: verseProps | verseMatchResult;
  isSelected: boolean;
  index?: number;
}

const VerseItem = ({ verse, isSelected, index }: VerseItemProps) => {
  const quranService = useQuran();
  const setScrollKey = useQuranBrowserPageStore((state) => state.setScrollKey);
  const gotoChapter = useQuranBrowserPageStore((state) => state.gotoChapter);

  const toolInspect = useNavigationStore((state) => state.toolInspect);

  const { value: isInspectorON, toggle: toggleInspector } = useBoolean();
  const { value: isRootListOpen, setValue: setRootListOpen } = useBoolean();

  const [currentRoots, setCurrentRoots] = useState<rootProps[]>([]);
  const [selectedWord, setSelectedWord] = useState(-1);

  const isSearchResult = typeof index === "number";

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

  const onClickVerseChapter = (verseKey: string) => {
    gotoChapter(verseKey.split("-")[0]);
    setScrollKey(verseKey);
  };

  return (
    <BaseVerseItem
      rootProps={{
        paddingStart: isSearchResult ? "5px" : undefined,
        lineHeight: toolInspect && isInspectorON ? "3.3rem" : "normal",
      }}
      verseKey={verse.key}
      isSelected={isSelected}
      endElement={
        toolInspect && (
          <ButtonInspect
            isActive={isInspectorON}
            onClickInspect={toggleInspector}
          />
        )
      }
      outerEndElement={
        <RootsAccordion
          isOpen={toolInspect && isInspectorON && isRootListOpen}
          rootsList={currentRoots}
          onClickVerseChapter={onClickVerseChapter}
        />
      }
    >
      {isSearchResult && (
        <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
          {index + 1}.
        </Span>
      )}{" "}
      {toolInspect && isInspectorON ? (
        <VerseInspected
          verseText={verse.versetext}
          selectedWord={selectedWord}
          onClickWord={onClickWord}
        />
      ) : isSearchResult ? (
        <VerseHighlightMatches verse={verse as verseMatchResult} />
      ) : (
        verse.versetext
      )}{" "}
      {isSearchResult ? (
        <Span whiteSpace="nowrap">
          (
          <ButtonVerse onClick={() => onClickVerseChapter(verse.key)}>
            {quranService.getChapterName(verse.suraid)}
          </ButtonVerse>
          :<ButtonVerse onClick={onClickVerse}>{verse.verseid}</ButtonVerse>)
        </Span>
      ) : (
        <ButtonVerse onClick={onClickVerse}>{`(${verse.verseid})`}</ButtonVerse>
      )}
    </BaseVerseItem>
  );
};

export { VerseItem };
