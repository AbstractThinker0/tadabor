import { useCallback, useEffect, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import type { verseMatchResult, searchIndexProps } from "quran-tools";

import { RootVerse } from "@/components/Pages/RootsBrowser/RootVerse";

import { DerivationsComponent } from "@/components/Custom/DerivationsComponent";

import { Box, Collapsible, Separator, Spinner } from "@chakra-ui/react";

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

  const [isPending, startTransition] = useTransition();

  const [itemsCount, setItemsCount] = useState(20);
  const [scrollKey, setScrollKey] = useState("");

  const [derivations, setDerivations] = useState<searchIndexProps[]>([]);
  const [rootVerses, setRootVerses] = useState<verseMatchResult[]>([]);

  const onScrollOccs = (event: React.UIEvent<HTMLDivElement>) => {
    if (itemsCount >= rootVerses.length || isPending) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      startTransition(() => {
        setItemsCount((state) => Math.min(state + 10, rootVerses.length));
      });
    }
  };

  useEffect(() => {
    if (!isOccurencesOpen) return;

    const occurencesData = quranService.getOccurencesData(root_occurences);

    setDerivations(occurencesData.rootDerivations);
    setRootVerses(occurencesData.rootVerses);
  }, [isOccurencesOpen, root_occurences, quranService]);

  const handleDerivationClick = (verseKey: string, verseIndex?: number) => {
    if (verseIndex) {
      if (itemsCount < verseIndex + 20) {
        setItemsCount(Math.min(verseIndex + 20, rootVerses.length));
      }
    }

    setScrollKey(verseKey);
  };

  const handleVerseClick = (verseKey: string) => {
    setScrollKey((prev) => (prev === verseKey ? "" : verseKey));
  };

  // Handling scroll by using a callback ref
  const handleOccurencesRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && scrollKey) {
        const verseToHighlight = node.querySelector(
          `[data-id="sub-${scrollKey}"]`
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
          <Separator />
          {rootVerses.slice(0, itemsCount).map((verse, index) => (
            <RootVerse
              index={index}
              key={verse.key}
              isSelected={scrollKey === verse.key}
              rootVerse={verse}
              handleVerseTab={handleVerseTab}
              handleVerseClick={handleVerseClick}
            />
          ))}

          {isPending && (
            <Box width={"100%"} textAlign={"center"} py={5}>
              <Spinner
                size="sm"
                borderWidth="2px"
                margin="auto"
                color="blue.500"
              />
            </Box>
          )}
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export { RootOccurences };
