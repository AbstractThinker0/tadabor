import { memo, useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { useAppDispatch } from "@/store";
import { inspectorPageActions } from "@/store/slices/pages/inspector";

import {
  verseProps,
  rootProps,
  verseMatchResult,
  searchIndexProps,
} from "quran-tools";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";
import VerseContainer from "@/components/Custom/VerseContainer";
import {
  Box,
  Collapsible,
  Accordion,
  HStack,
  Button,
  Separator,
  Span,
  StackSeparator,
} from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import { Tooltip } from "@/components/ui/tooltip";

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
  }, [rootOccs]);

  useEffect(() => {
    if (refVerses.current && scrollKey) {
      const verseToHighlight = refVerses.current.querySelector(
        `[data-child-id="${scrollKey}"]`
      ) as HTMLDivElement;

      if (verseToHighlight) {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [scrollKey, isPending]);

  const handleDerivationClick = (verseKey: string, verseIndex: number) => {
    startTransition(() => {
      if (itemsCount < verseIndex + 20) {
        setItemsCount(verseIndex + 20);
      }
      setScrollKey(verseKey);
    });
  };

  return (
    <Box overflowY={"scroll"} maxH={"1000px"} onScroll={onScrollOccs}>
      <DerivationsComponent
        searchIndexes={derivations}
        handleDerivationClick={handleDerivationClick}
      />
      <Box padding={3} ref={refVerses}>
        {rootVerses.slice(0, itemsCount).map((rootVerse) => (
          <Box
            key={rootVerse.key}
            py={"4px"}
            px={"5px"}
            smDown={{ px: "1px" }}
            borderBottom={"1.5px solid"}
            borderColor={"border.emphasized"}
            aria-selected={scrollKey === rootVerse.key}
            _selected={{ bgColor: "orange.emphasized" }}
          >
            <RootVerse rootVerse={rootVerse} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

interface DerivationsComponentProps {
  handleDerivationClick: (verseKey: string, verseIndex: number) => void;
  searchIndexes: searchIndexProps[];
}

const DerivationsComponent = memo(
  ({ searchIndexes, handleDerivationClick }: DerivationsComponentProps) => {
    return (
      <>
        <HStack
          wrap="wrap"
          p={1}
          separator={<StackSeparator border={"none"}>-</StackSeparator>}
        >
          {searchIndexes.map((root: searchIndexProps, index: number) => (
            <Tooltip showArrow key={index} content={root.text}>
              <Button
                px={2}
                fontSize="xl"
                variant="ghost"
                onClick={() => handleDerivationClick(root.key, index)}
              >{`${root.name}`}</Button>
            </Tooltip>
          ))}
        </HStack>
        <Separator />
      </>
    );
  }
);

DerivationsComponent.displayName = "DerivationsComponent";

interface RootVerseProps {
  rootVerse: verseMatchResult;
}

const RootVerse = ({ rootVerse }: RootVerseProps) => {
  const quranService = useQuran();
  const dispatch = useAppDispatch();
  const { value: isNoteOpen, toggle: setNoteOpen } = useBoolean();

  const verseChapter = quranService.getChapterName(rootVerse.suraid);

  function onClickVerseChapter() {
    dispatch(inspectorPageActions.setCurrentChapter(rootVerse.suraid));
    dispatch(inspectorPageActions.setScrollKey(rootVerse.key));
  }

  return (
    <>
      <VerseContainer data-child-id={rootVerse.key}>
        <VerseHighlightMatches verse={rootVerse} />{" "}
        <ButtonVerse onClick={onClickVerseChapter}>
          ({`${verseChapter}:${rootVerse.verseid}`})
        </ButtonVerse>
        <ButtonExpand onClick={setNoteOpen} />
      </VerseContainer>
      <CollapsibleNote
        isOpen={isNoteOpen}
        noteType="verse"
        noteKey={rootVerse.key}
      />
    </>
  );
};

export { VerseItem };
