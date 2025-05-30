import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { useAppDispatch } from "@/store";
import { inspectorPageActions } from "@/store/slices/pages/inspector";

import type {
  verseProps,
  rootProps,
  verseMatchResult,
  searchIndexProps,
} from "quran-tools";

import { ButtonVerse } from "@/components/Generic/Buttons";

import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import { DerivationsComponent } from "@/components/Custom/DerivationsComponent";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { Box, Collapsible, Accordion, Span, Separator } from "@chakra-ui/react";

import { useBoolean } from "usehooks-ts";

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
                <RootItem key={root.id} root={root} />
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

interface RootItemProps {
  root: rootProps;
}

const RootItem = ({ root }: RootItemProps) => {
  return (
    <Accordion.Item value={root.name}>
      <Accordion.ItemTrigger>
        <Span flex="1">
          {root.name} ({root.count})
        </Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent pb={4}>
        <RootOccurences rootOccs={root.occurences} />
      </Accordion.ItemContent>
    </Accordion.Item>
  );
};

interface RootOccurencesProps {
  rootOccs: string[];
}

const RootOccurences = ({ rootOccs }: RootOccurencesProps) => {
  const [itemsCount, setItemsCount] = useState(20);
  const [scrollKey, setScrollKey] = useState("");

  const [derivations, setDerivations] = useState<searchIndexProps[]>([]);
  const [rootVerses, setRootVerses] = useState<verseMatchResult[]>([]);
  const [isPending, startTransition] = useTransition();

  const quranService = useQuran();

  const refVerses = useRef<HTMLDivElement>(null);

  const onScrollOccs = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      startTransition(() => {
        setItemsCount((state) => state + 1);
      });
    }
  };

  useEffect(() => {
    const occurencesData = quranService.getOccurencesData(rootOccs);

    setDerivations(occurencesData.rootDerivations);
    setRootVerses(occurencesData.rootVerses);
  }, [rootOccs, quranService]);

  useEffect(() => {
    if (refVerses.current && scrollKey) {
      const verseToHighlight = refVerses.current.querySelector(
        `[data-id="sub-${scrollKey}"]`
      ) as HTMLDivElement;

      if (verseToHighlight) {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [scrollKey, isPending]);

  const handleDerivationClick = (verseKey: string, verseIndex?: number) => {
    startTransition(() => {
      if (verseIndex) {
        if (itemsCount < verseIndex + 20) {
          setItemsCount(verseIndex + 20);
        }
      }

      setScrollKey(verseKey);
    });
  };

  const handleVerseClick = (verseKey: string) => {
    setScrollKey((prev) => (verseKey === prev ? "" : verseKey));
  };

  return (
    <Box overflowY={"scroll"} maxH={"1000px"} onScroll={onScrollOccs}>
      <DerivationsComponent
        searchIndexes={derivations}
        handleDerivationClick={handleDerivationClick}
      />
      <Separator />
      <Box padding={3} ref={refVerses}>
        {rootVerses.slice(0, itemsCount).map((rootVerse, index) => (
          <RootVerse
            index={index}
            key={rootVerse.key}
            rootVerse={rootVerse}
            isSelected={scrollKey === rootVerse.key}
            handleVerseClick={handleVerseClick}
          />
        ))}
      </Box>
    </Box>
  );
};

interface RootVerseProps {
  index: number;
  rootVerse: verseMatchResult;
  isSelected: boolean;
  handleVerseClick: (verseKey: string) => void;
}

const RootVerse = ({
  index,
  rootVerse,
  isSelected,
  handleVerseClick,
}: RootVerseProps) => {
  const quranService = useQuran();
  const dispatch = useAppDispatch();

  const verseChapter = quranService.getChapterName(rootVerse.suraid);

  function onClickVerseChapter() {
    dispatch(inspectorPageActions.setCurrentChapter(rootVerse.suraid));
    dispatch(inspectorPageActions.setScrollKey(rootVerse.key));
  }

  function onClickVerse() {
    handleVerseClick(rootVerse.key);
  }

  return (
    <BaseVerseItem
      verseKey={rootVerse.key}
      dataKey={`sub-${rootVerse.key}`}
      isSelected={isSelected}
    >
      <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
        {index + 1}.
      </Span>{" "}
      <VerseHighlightMatches verse={rootVerse} /> (
      <ButtonVerse onClick={onClickVerseChapter}>{verseChapter}</ButtonVerse>:
      <ButtonVerse onClick={onClickVerse}>{rootVerse.verseid}</ButtonVerse>)
    </BaseVerseItem>
  );
};

export { VerseItem };
