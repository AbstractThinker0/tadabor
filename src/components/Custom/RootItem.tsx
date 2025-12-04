import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import type {
  rootProps,
  verseMatchResult,
  searchIndexProps,
} from "quran-tools";

import { ButtonVerse } from "@/components/Generic/Buttons";

import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import { DerivationsComponent } from "@/components/Custom/DerivationsComponent";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { Box, Accordion, Span, Separator, Spinner } from "@chakra-ui/react";

interface RootItemProps {
  root: rootProps;
  onClickVerseChapter?: (verseKey: string) => void;
}

const RootItem = ({ root, onClickVerseChapter }: RootItemProps) => {
  return (
    <Accordion.Item value={root.name}>
      <Accordion.ItemTrigger>
        <Span flex="1">
          {root.name} ({root.count})
        </Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent pb={4}>
        <RootOccurences
          rootOccs={root.occurences}
          onClickVerseChapter={onClickVerseChapter}
        />
      </Accordion.ItemContent>
    </Accordion.Item>
  );
};

interface RootOccurencesProps {
  rootOccs: string[];
  onClickVerseChapter?: (verseKey: string) => void;
}

const RootOccurences = ({
  rootOccs,
  onClickVerseChapter,
}: RootOccurencesProps) => {
  const [itemsCount, setItemsCount] = useState(20);
  const [scrollKey, setScrollKey] = useState("");
  const [selectedVerse, setSelectedVerse] = useState("");

  const [derivations, setDerivations] = useState<searchIndexProps[]>([]);
  const [rootVerses, setRootVerses] = useState<verseMatchResult[]>([]);
  const [isPending, startTransition] = useTransition();

  const quranService = useQuran();

  const refVerses = useRef<HTMLDivElement>(null);

  const onScrollOccs = (event: React.UIEvent<HTMLDivElement>) => {
    if (itemsCount >= rootVerses.length || isPending) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Near the bottom
    if (scrollHeight - scrollTop <= clientHeight + 200) {
      startTransition(() => {
        setItemsCount((state) => Math.min(state + 5, rootVerses.length));
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

        setSelectedVerse(scrollKey);
        setScrollKey("");
      }
    }
  }, [scrollKey, isPending]);

  const handleDerivationClick = (verseKey: string, verseIndex?: number) => {
    startTransition(() => {
      if (verseIndex) {
        if (itemsCount < verseIndex + 20) {
          setItemsCount(Math.min(verseIndex + 20, rootVerses.length));
        }
      }

      setScrollKey(verseKey);
    });
  };

  const handleVerseClick = (verseKey: string) => {
    setSelectedVerse((prev) => (verseKey === prev ? "" : verseKey));
  };

  return (
    <Box overflowY={"scroll"} maxH={"1000px"} onScroll={onScrollOccs}>
      <DerivationsComponent
        searchIndexes={derivations}
        handleDerivationClick={handleDerivationClick}
      />
      <Separator />
      <Box padding={1} ref={refVerses}>
        {rootVerses.slice(0, itemsCount).map((rootVerse, index) => (
          <RootVerse
            index={index}
            key={rootVerse.key}
            rootVerse={rootVerse}
            isSelected={selectedVerse === rootVerse.key}
            handleVerseClick={handleVerseClick}
            onClickVerseChapter={onClickVerseChapter}
          />
        ))}
      </Box>

      {isPending && (
        <Box width={"100%"} textAlign={"center"} py={5}>
          <Spinner size="sm" borderWidth="2px" margin="auto" color="blue.500" />
        </Box>
      )}
    </Box>
  );
};

interface RootVerseProps {
  index: number;
  rootVerse: verseMatchResult;
  isSelected: boolean;
  handleVerseClick: (verseKey: string) => void;
  onClickVerseChapter?: (verseKey: string) => void;
}

const RootVerse = ({
  index,
  rootVerse,
  isSelected,
  handleVerseClick,
  onClickVerseChapter,
}: RootVerseProps) => {
  const quranService = useQuran();

  const verseChapter = quranService.getChapterName(rootVerse.suraid);

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
      <VerseHighlightMatches verse={rootVerse} />{" "}
      <Span whiteSpace="nowrap">
        (
        <ButtonVerse
          onClick={() =>
            onClickVerseChapter && onClickVerseChapter(rootVerse.key)
          }
        >
          {verseChapter}
        </ButtonVerse>
        :<ButtonVerse onClick={onClickVerse}>{rootVerse.verseid}</ButtonVerse>)
      </Span>
    </BaseVerseItem>
  );
};

export { RootItem };
