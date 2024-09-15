import {
  Fragment,
  memo,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { inspectorPageActions } from "@/store/slices/pages/inspector";

import { getRootMatches } from "@/util/util";
import {
  verseProps,
  rootProps,
  verseMatchResult,
  searchIndexProps,
} from "@/types";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import VerseContainer from "@/components/Custom/VerseContainer";
import {
  Box,
  CardBody,
  useBoolean,
  Collapse,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  HStack,
  Tooltip,
  Button,
  Divider,
} from "@chakra-ui/react";
import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";

interface ListVersesProps {
  currentChapter: string;
}

const ListVerses = ({ currentChapter }: ListVersesProps) => {
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  const scrollKey = useAppSelector((state) => state.inspectorPage.scrollKey);

  useEffect(() => {
    startTransition(() => {
      setStateVerses(quranService.getVerses(currentChapter));
    });
  }, [currentChapter]);

  const refList = useRef<HTMLDivElement>(null);

  // Reset scroll whenever we switch from one chapter to another
  useEffect(() => {
    if (!refList.current) return;

    if (!scrollKey) return;

    const verseToHighlight = refList.current.querySelector(
      `[data-id="${scrollKey}"]`
    );

    if (verseToHighlight) {
      setTimeout(() => {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, [scrollKey, isPending]);

  return (
    <CardBody ref={refList} dir="rtl">
      {isPending ? (
        <LoadingSpinner />
      ) : (
        stateVerses.map((verse) => (
          <Box
            p={"4px"}
            borderBottom={"1.5px solid rgba(220, 220, 220, 0.893)"}
            bgColor={scrollKey === verse.key ? "#a5d9fc" : undefined}
            key={verse.key}
            data-id={verse.key}
          >
            <VerseWords
              verseRank={verse.rank}
              verseText={verse.versetext.split(" ")}
              verseID={verse.verseid}
              verseKey={verse.key}
            />
          </Box>
        ))
      )}
    </CardBody>
  );
};

export default ListVerses;

interface VerseWordsProps {
  verseRank: number;
  verseText: string[];
  verseID: string;
  verseKey: string;
}

const VerseWords = ({
  verseText,
  verseRank,
  verseID,
  verseKey,
}: VerseWordsProps) => {
  const quranService = useQuran();
  const dispatch = useAppDispatch();
  const [isNoteOpen, setNoteOpen] = useBoolean();
  const [isRootListOpen, setRootListOpen] = useBoolean();

  const [currentRoots, setCurrentRoots] = useState<rootProps[]>([]);
  const [selectedWord, setSelectedWord] = useState(-1);

  const onClickWord = (index: number) => {
    const wordRoots = quranService.quranRoots.filter((root) =>
      root.occurences.find((occ) => {
        const rootData = occ.split(":");

        if (rootData[0] !== verseRank.toString()) return false;

        const wordIndexes = rootData[1].split(",");

        return wordIndexes.includes(index.toString());
      })
    );

    setCurrentRoots(wordRoots.sort((a, b) => b.name.length - a.name.length));

    if (selectedWord === index) {
      setRootListOpen.off();
      setSelectedWord(-1);
    } else {
      setRootListOpen.on();
      setSelectedWord(index);
    }
  };

  const onClickVerse = () => {
    dispatch(inspectorPageActions.setScrollKey(verseKey));
  };

  return (
    <>
      <VerseContainer pb={"2px"}>
        {verseText.map((word, index) => (
          <Fragment key={index}>
            <Box
              as="span"
              cursor={"pointer"}
              py={"2px"}
              borderRadius={"0.3rem"}
              _hover={
                selectedWord === index + 1
                  ? { bg: "rgb(255, 212, 159)" }
                  : { bg: "rgb(255, 229, 197)" }
              }
              bgColor={
                selectedWord === index + 1 ? "rgb(255, 212, 159)" : undefined
              }
              onClick={() => onClickWord(index + 1)}
            >
              {word}
            </Box>{" "}
          </Fragment>
        ))}{" "}
        <ButtonVerse onClick={onClickVerse}>{`(${verseID})`}</ButtonVerse>
        <ButtonExpand onClick={setNoteOpen.toggle} />
      </VerseContainer>
      <CollapsibleNote isOpen={isNoteOpen} inputKey={verseKey} />
      <Collapse in={isRootListOpen}>
        <Accordion
          borderRadius={"0.3rem"}
          mt={1}
          bgColor={"white"}
          allowMultiple
        >
          <Box p={1}>
            {currentRoots.map((root) => (
              <RootItem key={root.id} root={root} />
            ))}
          </Box>
        </Accordion>
      </Collapse>
    </>
  );
};

interface RootItemProps {
  root: rootProps;
}

const RootItem = ({ root }: RootItemProps) => {
  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton>
            <Box as="span" flex="1">
              {root.name} ({root.count})
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <RootOccurences
            rootOccs={root.occurences}
            isOccurencesOpen={isExpanded}
          />
        </>
      )}
    </AccordionItem>
  );
};

interface RootOccurencesProps {
  rootOccs: string[];
  isOccurencesOpen: boolean;
}

const RootOccurences = ({
  rootOccs,
  isOccurencesOpen,
}: RootOccurencesProps) => {
  const [itemsCount, setItemsCount] = useState(20);
  const refCollapse = useRef<HTMLDivElement>(null);
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

  const quranService = useQuran();

  useEffect(() => {
    if (!isOccurencesOpen) return;

    const localDer: searchIndexProps[] = [];
    const localVerses: verseMatchResult[] = [];

    rootOccs.forEach((occ) => {
      const occData = occ.split(":");
      const verse = quranService.getVerseByRank(occData[0]);
      const wordIndexes = occData[1].split(",");
      const verseWords = verse.versetext.split(" ");

      const chapterName = quranService.getChapterName(verse.suraid);

      const verseDerivations = wordIndexes.map((wordIndex) => ({
        name: verseWords[Number(wordIndex) - 1],
        key: verse.key,
        text: `${chapterName}:${verse.verseid}`,
        wordIndex,
      }));

      localDer.push(...verseDerivations);

      const verseParts = getRootMatches(verseWords, wordIndexes);

      localVerses.push({
        verseParts,
        key: verse.key,
        suraid: verse.suraid,
        verseid: verse.verseid,
      });
    });

    setDerivations(localDer);
    setRootVerses(localVerses);
  }, [rootOccs, isOccurencesOpen]);

  const handleDerivationClick = (verseKey: string, verseIndex: number) => {
    if (itemsCount < verseIndex + 20) {
      setItemsCount(verseIndex + 20);
    }
    setScrollKey(verseKey);
  };

  useEffect(() => {
    if (!scrollKey) return;

    if (!refCollapse.current) return;

    const verseToHighlight = refCollapse.current.querySelector(
      `[data-child-id="${scrollKey}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [scrollKey]);

  return (
    <AccordionPanel pb={4} ref={refCollapse}>
      <Box overflowY={"scroll"} maxH={"1000px"} onScroll={onScrollOccs}>
        <DerivationsComponent
          searchIndexes={derivations}
          handleDerivationClick={handleDerivationClick}
        />
        <Box padding={3}>
          {rootVerses.slice(0, itemsCount).map((rootVerse) => (
            <Box
              padding={"4px"}
              borderBottom={"1.5px solid rgba(220, 220, 220, 0.893)"}
              bgColor={scrollKey === rootVerse.key ? "beige" : undefined}
              key={rootVerse.key}
            >
              <RootVerse rootVerse={rootVerse} />
            </Box>
          ))}
        </Box>
      </Box>
    </AccordionPanel>
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
        <HStack wrap="wrap" p={1} divider={<>-</>}>
          {searchIndexes.map((root: searchIndexProps, index: number) => (
            <Tooltip hasArrow key={index} label={root.text}>
              <Button
                px={2}
                fontSize="xl"
                variant="ghost"
                onClick={() => handleDerivationClick(root.key, index)}
              >{`${root.name}`}</Button>
            </Tooltip>
          ))}
        </HStack>
        <Divider />
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
  const [isNoteOpen, setNoteOpen] = useBoolean();

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
        <ButtonExpand onClick={setNoteOpen.toggle} />
      </VerseContainer>
      <CollapsibleNote isOpen={isNoteOpen} inputKey={rootVerse.key} />
    </>
  );
};
