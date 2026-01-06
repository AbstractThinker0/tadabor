import { useState } from "react";
import { useBoolean } from "usehooks-ts";

import { useAppDispatch } from "@/store";
import { searcher2PageActions } from "@/store/slices/pages/searcher2";
import { useNavigationStore } from "@/store/zustand/navigationStore";

import useQuran from "@/context/useQuran";

import type { rootProps, verseMatchResult } from "quran-tools";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { ButtonVerse } from "@/components/Generic/Buttons";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";
import { Span } from "@chakra-ui/react";

import { ButtonInspect } from "@/components/Custom/ButtonInspect";
import {
  RootsAccordion,
  VerseInspected,
} from "@/components/Custom/VerseInspected";

interface VerseItemProps {
  index: number;
  verseMatch: verseMatchResult;
  isSelected: boolean;
}

const VerseItem = ({ verseMatch, isSelected, index }: VerseItemProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();
  const toolInspect = useNavigationStore((state) => state.toolInspect);

  const { value: isInspectorON, toggle: toggleInspector } = useBoolean();
  const { value: isRootListOpen, setValue: setRootListOpen } = useBoolean();
  const [currentRoots, setCurrentRoots] = useState<rootProps[]>([]);
  const [selectedWord, setSelectedWord] = useState<number>(-1);

  const onClickWord = (wordIndex: number): void => {
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

  const onClickVerseChapter = (verseKey: string): void => {
    const chapterId = verseKey.split("-")[0];
    dispatch(searcher2PageActions.setVerseTab(chapterId));
    dispatch(searcher2PageActions.setScrollKey(verseKey));
  };

  const onClickVerse = (): void => {
    dispatch(
      searcher2PageActions.setScrollKey(isSelected ? "" : verseMatch.key)
    );
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
      <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
        {index + 1}.
      </Span>{" "}
      {toolInspect && isInspectorON ? (
        <VerseInspected
          verseText={quranService.getVerseTextByKey(verseMatch.key)}
          selectedWord={selectedWord}
          onClickWord={onClickWord}
        />
      ) : (
        <VerseHighlightMatches verse={verseMatch} />
      )}{" "}
      <Span whiteSpace="nowrap">
        (
        <ButtonVerse onClick={() => onClickVerseChapter(verseMatch.key)}>
          {quranService.getChapterName(verseMatch.suraid)}
        </ButtonVerse>
        :<ButtonVerse onClick={onClickVerse}>{verseMatch.verseid}</ButtonVerse>)
      </Span>
    </BaseVerseItem>
  );
};

export { VerseItem };
