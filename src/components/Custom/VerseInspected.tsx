import { Accordion, Collapsible, Span } from "@chakra-ui/react";
import type { rootProps } from "quran-tools";

import { RootItem } from "@/components/Custom/RootItem";

interface VerseInspectedProps {
  verseText: string;
  selectedWord: number;
  onClickWord: (wordIndex: number) => void;
}

const VerseInspected = ({
  verseText,
  selectedWord,
  onClickWord,
}: VerseInspectedProps) => {
  return (
    <>
      {verseText.split(" ").map((word, index) => (
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
      ))}
    </>
  );
};

interface RootAccordionProps {
  isOpen: boolean;
  rootsList: rootProps[];
  onClickVerseChapter: (verseKey: string) => void;
}

const RootsAccordion = ({
  isOpen,
  rootsList,
  onClickVerseChapter,
}: RootAccordionProps) => {
  return (
    <Collapsible.Root open={isOpen} lazyMount>
      <Collapsible.Content>
        <Accordion.Root
          borderRadius={"0.3rem"}
          mt={1}
          bgColor={"bg"}
          multiple
          lazyMount
        >
          {rootsList.map((root) => (
            <RootItem
              key={root.id}
              root={root}
              onClickVerseChapter={onClickVerseChapter}
            />
          ))}
        </Accordion.Root>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export { VerseInspected, RootsAccordion };
