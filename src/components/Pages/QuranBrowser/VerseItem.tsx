import type { rootProps, verseMatchResult, verseProps } from "quran-tools";
import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

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

  const onClickVerseChapter = (verseKey: string) => {
    dispatch(qbPageActions.gotoChapter(verseKey.split("-")[0]));
    dispatch(qbPageActions.setScrollKey(verseKey));
  };

  return (
    <BaseVerseItem
      rootProps={{
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
      {toolInspect && isInspectorON ? (
        <VerseInspected
          verseText={verse.versetext}
          selectedWord={selectedWord}
          onClickWord={onClickWord}
        />
      ) : (
        verse.versetext
      )}{" "}
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

  const orgVerse = quranService.getVerseByKey(verse.key)

  const toolInspect = useAppSelector((state) => state.navigation.toolInspect);

  const { value: isInspectorON, toggle: toggleInspector } = useBoolean();
  const { value: isRootListOpen, setValue: setRootListOpen } = useBoolean();

  const [currentRoots, setCurrentRoots] = useState<rootProps[]>([]);
  const [selectedWord, setSelectedWord] = useState(-1);

  const onClickWord = (wordIndex: number) => {
    const wordRoots = quranService.getWordRoots(orgVerse.rank, wordIndex);

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
    dispatch(qbPageActions.gotoChapter(verseKey.split("-")[0]));
    dispatch(qbPageActions.setScrollKey(verseKey));
  };

  const onClickVerse = () => {
    dispatch(qbPageActions.setScrollKey(verse.key));
  };

  return (
    <BaseVerseItem
      rootProps={{
        paddingStart: "5px",
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
      <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
        {index + 1}.
      </Span>{" "}
      {toolInspect && isInspectorON ? (
        <VerseInspected
          verseText={orgVerse.versetext}
          selectedWord={selectedWord}
          onClickWord={onClickWord}
        />
      ) : (
        <VerseHighlightMatches verse={verse} />)} (
      <ButtonVerse onClick={() => onClickVerseChapter(verse.key)}>
        {quranService.getChapterName(verse.suraid)}
      </ButtonVerse>
      :<ButtonVerse onClick={onClickVerse}>{verse.verseid}</ButtonVerse>)
    </BaseVerseItem>
  );
};

export { VerseItem, SearchVerseItem };
