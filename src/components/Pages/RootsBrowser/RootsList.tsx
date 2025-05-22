import { memo, useCallback, useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";

import type {
  rootProps,
  verseMatchResult,
  searchIndexProps,
} from "quran-tools";

import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import {
  Box,
  Button,
  Collapsible,
  Separator,
  Flex,
  HStack,
  Spacer,
  StackSeparator,
} from "@chakra-ui/react";

import { Tooltip } from "@/components/ui/tooltip";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

import { useBoolean } from "usehooks-ts";

interface RootsListProps {
  searchInclusive: boolean;
  searchString: string;
  handleVerseTab: (verseKey: string) => void;
  stateRoots: rootProps[];
  handleRoots: (roots: rootProps[]) => void;
  itemsCount: number;
}

const RootsList = memo(
  ({
    searchString,
    searchInclusive,
    handleVerseTab,
    stateRoots,
    handleRoots,
    itemsCount,
  }: RootsListProps) => {
    const quranService = useQuran();

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
      startTransition(() => {
        handleRoots(
          quranService.searchRoots(searchString, {
            normalizeToken: true,
            normalizeRoot: true,
            searchInclusive: searchInclusive,
          })
        );
      });
    }, [searchString, searchInclusive]);

    return (
      <Flex flex={1} flexDirection={"column"}>
        {isPending ? (
          <LoadingSpinner text="Loading roots.." />
        ) : (
          stateRoots
            .slice(0, itemsCount)
            .map((root) => (
              <RootComponent
                key={root.id}
                root_occurences={root.occurences}
                root_name={root.name}
                root_id={root.id.toString()}
                root_count={root.count}
                handleVerseTab={handleVerseTab}
              />
            ))
        )}
      </Flex>
    );
  }
);

RootsList.displayName = "RootsList";

interface RootComponentProps {
  root_occurences: string[];
  root_name: string;
  root_id: string;
  root_count: string;
  handleVerseTab: (verseKey: string) => void;
}

const RootComponent = memo(
  ({
    root_occurences,
    root_name,
    root_id,
    root_count,
    handleVerseTab,
  }: RootComponentProps) => {
    const { t } = useTranslation();
    const { value: isOpen, toggle: setOpen } = useBoolean();
    const { value: isOccurencesOpen, toggle: setOccurencesOpen } = useBoolean();

    return (
      <Box px={"5px"} border={"1px solid"} borderColor={"gray.emphasized"}>
        <Flex justify={"center"} fontSize={"larger"} alignItems={"center"}>
          <Spacer />
          <Flex w={"3.5rem"} justify={"center"}>
            {root_name}
          </Flex>
          <Flex flex={1}>
            <ButtonExpand onClick={setOpen} />
            <Button
              w={"7rem"}
              colorPalette="teal"
              variant={"outline"}
              onClick={setOccurencesOpen}
            >
              {t("derivations")} ({root_count})
            </Button>
          </Flex>
        </Flex>
        <CollapsibleNote isOpen={isOpen} noteType="root" noteKey={root_id} />
        <RootOccurences
          isOccurencesOpen={isOccurencesOpen}
          root_occurences={root_occurences}
          handleVerseTab={handleVerseTab}
        />
      </Box>
    );
  }
);

RootComponent.displayName = "RootComponent";

interface RootOccurencesProps {
  isOccurencesOpen: boolean;
  root_occurences: string[];
  handleVerseTab: (verseKey: string) => void;
}

const RootOccurences = ({
  isOccurencesOpen,
  root_occurences,
  handleVerseTab,
}: RootOccurencesProps) => {
  const quranService = useQuran();

  const [itemsCount, setItemsCount] = useState(20);
  const [scrollKey, setScrollKey] = useState("");

  const [derivations, setDerivations] = useState<searchIndexProps[]>([]);
  const [rootVerses, setRootVerses] = useState<verseMatchResult[]>([]);

  const onScrollOccs = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setItemsCount((state) => state + 10);
    }
  };

  useEffect(() => {
    if (!isOccurencesOpen) return;

    const occurencesData = quranService.getOccurencesData(root_occurences);

    setDerivations(occurencesData.rootDerivations);
    setRootVerses(occurencesData.rootVerses);
  }, [isOccurencesOpen, root_occurences]);

  const handleDerivationClick = (verseKey: string, verseIndex: number) => {
    if (itemsCount < verseIndex + 20) {
      setItemsCount(verseIndex + 20);
    }
    setScrollKey(verseKey);
  };

  // Handling scroll by using a callback ref
  const handleOccurencesRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && scrollKey) {
        const verseToHighlight = node.querySelector(
          `[data-child-id="${scrollKey}"]`
        ) as HTMLDivElement;

        if (verseToHighlight) {
          verseToHighlight.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    },
    [scrollKey]
  );

  return (
    <Collapsible.Root open={isOccurencesOpen} lazyMount>
      <Collapsible.Content>
        <Box
          padding={3}
          bgColor={"brand.contrast"}
          maxH={"65vh"}
          overflowY={"scroll"}
          onScroll={onScrollOccs}
          dir="rtl"
          ref={handleOccurencesRef}
        >
          <DerivationsComponent
            searchIndexes={derivations}
            handleDerivationClick={handleDerivationClick}
          />
          {rootVerses.slice(0, itemsCount).map((verse) => (
            <Box
              key={verse.key}
              padding={1}
              borderBottom={"1.5px solid"}
              borderColor={"border.emphasized"}
              aria-selected={scrollKey === verse.key}
              _selected={{ bgColor: "orange.emphasized" }}
              data-child-id={verse.key}
            >
              <RootVerse rootVerse={verse} handleVerseTab={handleVerseTab} />
            </Box>
          ))}
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
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
  handleVerseTab: (verseKey: string) => void;
}

const RootVerse = ({ rootVerse, handleVerseTab }: RootVerseProps) => {
  const quranService = useQuran();

  const { value: isOpen, toggle: setOpen } = useBoolean();

  const verseChapter = quranService.getChapterName(rootVerse.suraid);

  const onClickChapter = () => {
    handleVerseTab(rootVerse.key);
  };

  return (
    <>
      <VerseContainer>
        <VerseHighlightMatches verse={rootVerse} /> (
        <ButtonVerse
          onClick={onClickChapter}
        >{`${verseChapter}:${rootVerse.verseid}`}</ButtonVerse>
        )
        <ButtonExpand onClick={setOpen} />
      </VerseContainer>

      <CollapsibleNote
        isOpen={isOpen}
        noteType="verse"
        noteKey={rootVerse.key}
      />
    </>
  );
};

export default RootsList;
