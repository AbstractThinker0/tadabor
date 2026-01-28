import type { rootProps, verseMatchResult, verseProps } from "quran-tools";

import { useQuranBrowserPageStore } from "@/store/pages/quranBrowserPage";
import { useNavigationStore } from "@/store/global/navigationStore";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";
import { VerseIndex } from "@/components/Custom/VerseIndex";
import { VerseRef } from "@/components/Custom/VerseRef";

import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import { useBoolean } from "usehooks-ts";
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

import { ButtonInspect } from "@/components/Custom/ButtonInspect";
import {
  RootsAccordion,
  VerseInspected,
} from "@/components/Custom/VerseInspected";
import useQuran from "@/context/useQuran";

interface VerseItemProps {
  verse: verseProps | verseMatchResult;
  isSelected: boolean;
  index?: number;
}

const VerseItem = ({ verse, isSelected, index }: VerseItemProps) => {
  const quranService = useQuran();
  const audioPlayer = useAudioPlayer();

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

  const onClickVerseChapter = () => {
    gotoChapter(verse.key.split("-")[0]);
    setScrollKey(verse.key);
  };

  const onClickAudio = () => {
    audioPlayer.playVerse(verse);
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
        <>
          <Button
            background="none"
            border="none"
            onClick={onClickAudio}
            width="6px"
            height="36px"
            fontSize="20px"
            padding={0}
          >
            🔊
          </Button>
          {toolInspect && (
            <ButtonInspect
              isActive={isInspectorON}
              onClickInspect={toggleInspector}
            />
          )}
        </>
      }
      outerEndElement={
        <RootsAccordion
          isOpen={toolInspect && isInspectorON && isRootListOpen}
          rootsList={currentRoots}
          onClickVerseChapter={onClickVerseChapter}
        />
      }
    >
      {isSearchResult && <VerseIndex index={index} />}{" "}
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
      <VerseRef
        suraid={verse.suraid}
        verseid={verse.verseid}
        onClickChapter={isSearchResult ? onClickVerseChapter : undefined}
        onClickVerse={onClickVerse}
      />
    </BaseVerseItem>
  );
};

export { VerseItem };
