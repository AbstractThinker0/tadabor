import { memo, useCallback, useEffect, useState, useTransition } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { verseProps } from "@/types";
import useQuran from "@/context/useQuran";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { tagsProps, versesTagsProps } from "@/components/Pages/Tags/consts";
import VerseTagsModal from "@/components/Pages/Tags/VerseTagsModal";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import { useBoolean } from "usehooks-ts";

function TagsDisplay() {
  const quranService = useQuran();
  const dispatch = useAppDispatch();

  const selectedTags = useAppSelector((state) => state.tagsPage.selectedTags);

  const selectedChapters = useAppSelector(
    (state) => state.tagsPage.selectedChapters
  );

  const tags = useAppSelector((state) => state.tagsPage.tags);

  const versesTags = useAppSelector((state) => state.tagsPage.versesTags);

  const { open, onOpen, onClose } = useDisclosure();

  function onClickDeleteSelected(tagID: string) {
    dispatch(tagsPageActions.deselectTag(tagID));
  }

  const chaptersScope = Object.keys(selectedChapters).filter(
    (chapterID) => selectedChapters[chapterID] === true
  );

  const getSelectedVerses = () => {
    const asArray = Object.entries(versesTags);

    const filtered = asArray.filter(([key]) => {
      const info = key.split("-");
      return selectedChapters[info[0]] === true;
    });

    return Object.fromEntries(filtered);
  };

  const onClickCloseChapter = (chapterID: string) => {
    dispatch(tagsPageActions.toggleSelectChapter(Number(chapterID)));
  };

  return (
    <Flex
      flexDir={"column"}
      overflowY={"scroll"}
      w={"100%"}
      minH={"100%"}
      flex={1}
      padding={"0.5rem"}
    >
      <Card.Root
        border={"1px solid"}
        borderColor={"border.emphasized"}
        flex={1}
        dir="rtl"
      >
        {Object.keys(selectedTags).length ? (
          <>
            <CardHeader py={1}>
              <Flex alignItems={"center"} gap={"0.5rem"} dir="ltr">
                <Box fontWeight={"bold"}>Selected tags:</Box>
                <Flex gap={"5px"}>
                  {Object.keys(selectedTags).map((tagID) => (
                    <Tag.Root size="lg" colorPalette={"yellow"} key={tagID}>
                      <Tag.Label>{selectedTags[tagID].tagDisplay}</Tag.Label>
                      <Tag.EndElement>
                        <Tag.CloseTrigger
                          onClick={() => onClickDeleteSelected(tagID)}
                        />
                      </Tag.EndElement>
                    </Tag.Root>
                  ))}
                </Flex>
              </Flex>
              <Flex flexWrap={"wrap"} gap={"5px"} dir="ltr">
                <Box fontWeight={"bold"}>Selected chapters:</Box>
                {chaptersScope.length === 114 ? (
                  <Box fontWeight={"bold"}>All chapters.</Box>
                ) : chaptersScope.length === 0 ? (
                  <Box fontWeight={"bold"}>No chapters selected.</Box>
                ) : (
                  chaptersScope.map((chapterID, index) => (
                    <Tag.Root
                      colorPalette="green"
                      size="lg"
                      variant={"solid"}
                      key={index}
                    >
                      <Tag.Label overflow={"visible"}>
                        {quranService.getChapterName(chapterID)}
                      </Tag.Label>
                      <Tag.EndElement>
                        <Tag.CloseTrigger
                          onClick={() => onClickCloseChapter(chapterID)}
                        />
                      </Tag.EndElement>
                    </Tag.Root>
                  ))
                )}
              </Flex>
            </CardHeader>
            {chaptersScope.length ? (
              <SelectedVerses
                selectedTags={selectedTags}
                tags={tags}
                versesTags={getSelectedVerses()}
                onOpenVerseModal={onOpen}
              />
            ) : (
              <Box textAlign={"center"} dir="ltr">
                You have to select at least one chapter.
              </Box>
            )}
          </>
        ) : (
          <ListVerses
            onOpenVerseModal={onOpen}
            versesTags={versesTags}
            tags={tags}
          />
        )}
      </Card.Root>
      <VerseTagsModal isOpen={open} onClose={onClose} />
    </Flex>
  );
}

interface SelectedVersesProps {
  selectedTags: tagsProps;
  tags: tagsProps;
  versesTags: versesTagsProps;
  onOpenVerseModal: () => void;
}

function SelectedVerses({
  selectedTags,
  versesTags,
  tags,
  onOpenVerseModal,
}: SelectedVersesProps) {
  const quranService = useQuran();

  const selectedVerses = Object.keys(versesTags).filter((verseKey) =>
    Object.keys(selectedTags).some((tagID) =>
      versesTags[verseKey].includes(tagID)
    )
  );

  const sortedVerses = selectedVerses.sort((keyA, KeyB) => {
    const infoA = keyA.split("-");
    const infoB = KeyB.split("-");
    if (Number(infoA[0]) !== Number(infoB[0]))
      return Number(infoA[0]) - Number(infoB[0]);
    else return Number(infoA[1]) - Number(infoB[1]);
  });

  return (
    <CardBody>
      {sortedVerses.length ? (
        <>
          {sortedVerses.map((verseKey) => {
            const verse = quranService.getVerseByKey(verseKey);
            return (
              <Box
                borderBottom={"1.5px solid"}
                borderColor={"border.emphasized"}
                p={"4px"}
                key={verseKey}
              >
                <VerseTags tags={tags} versesTags={versesTags[verse.key]} />
                <SelectedVerseComponent
                  onOpenVerseModal={onOpenVerseModal}
                  verse={verse}
                />
              </Box>
            );
          })}
        </>
      ) : (
        <Box textAlign={"center"} dir="ltr">
          There are no verses matching the selected tags.
        </Box>
      )}
    </CardBody>
  );
}

interface SelectedVerseComponentProps {
  verse: verseProps;
  onOpenVerseModal: () => void;
}

const SelectedVerseComponent = ({
  verse,
  onOpenVerseModal,
}: SelectedVerseComponentProps) => {
  const dispatch = useAppDispatch();
  const quranService = useQuran();
  const { value: isOpen, toggle: setOpen } = useBoolean();

  function onClickVerse(verse: verseProps) {
    dispatch(tagsPageActions.gotoChapter(verse.suraid));
    dispatch(tagsPageActions.setScrollKey(verse.key));
  }

  function onClickTagVerse(verse: verseProps) {
    dispatch(tagsPageActions.setCurrentVerse(verse));
    onOpenVerseModal();
  }

  return (
    <>
      <VerseContainer>
        {verse.versetext}{" "}
        <ButtonVerse onClick={() => onClickVerse(verse)}>
          ({`${quranService.getChapterName(verse.suraid)}:${verse.verseid}`})
        </ButtonVerse>
        <ButtonExpand onClick={setOpen} />
        <Button variant={"ghost"} onClick={() => onClickTagVerse(verse)}>
          🏷️
        </Button>
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
    </>
  );
};

interface ListVersesProps {
  versesTags: versesTagsProps;
  tags: tagsProps;
  onOpenVerseModal: () => void;
}

const ListVerses = memo(
  ({ versesTags, tags, onOpenVerseModal }: ListVersesProps) => {
    const quranService = useQuran();

    const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

    const [isPending, startTransition] = useTransition();

    const currentChapter = useAppSelector(
      (state) => state.tagsPage.currentChapter
    );

    const scrollKey = useAppSelector((state) => state.tagsPage.scrollKey);

    // Handling scroll by using a callback ref
    const handleVerseListRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (node && scrollKey) {
          const verseToHighlight = node.querySelector(
            `[data-id="${scrollKey}"]`
          ) as HTMLDivElement;

          if (verseToHighlight) {
            verseToHighlight.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      },
      [scrollKey, isPending]
    );

    useEffect(() => {
      //
      startTransition(() => {
        setStateVerses(quranService.getVerses(currentChapter));
      });
    }, [currentChapter]);

    return (
      <>
        <CardHeader
          bgColor={"gray.emphasized"}
          textAlign={"center"}
          fontSize={"larger"}
          color={"teal.fg"}
          borderBottom={"1px solid"}
          borderColor={"border.emphasized"}
          py={1}
        >
          سورة {quranService.getChapterName(currentChapter)}
        </CardHeader>
        <CardBody bgColor={"brand.contrast"} pt={0} ref={handleVerseListRef}>
          {isPending ? (
            <LoadingSpinner />
          ) : (
            stateVerses.map((verse) => (
              <Box
                key={verse.key}
                data-id={verse.key}
                aria-selected={scrollKey === verse.key}
                _selected={{ bgColor: "blue.emphasized" }}
                borderBottom={"1.5px solid"}
                borderColor={"border.emphasized"}
                p={"4px"}
              >
                {versesTags[verse.key] !== undefined && (
                  <VerseTags versesTags={versesTags[verse.key]} tags={tags} />
                )}
                <ListVerseComponent
                  onOpenVerseModal={onOpenVerseModal}
                  verse={verse}
                />
              </Box>
            ))
          )}
        </CardBody>
      </>
    );
  }
);

ListVerses.displayName = "ListVerses";

interface ListVerseComponentProps {
  verse: verseProps;
  onOpenVerseModal: () => void;
}

const ListVerseComponent = memo(
  ({ onOpenVerseModal, verse }: ListVerseComponentProps) => {
    const dispatch = useAppDispatch();
    const { value: isOpen, toggle: setOpen } = useBoolean();

    function onClickTagVerse(verse: verseProps) {
      dispatch(tagsPageActions.setCurrentVerse(verse));
      onOpenVerseModal();
    }

    function onClickVerse() {
      dispatch(tagsPageActions.setScrollKey(verse.key));
    }

    return (
      <>
        <VerseContainer>
          {verse.versetext}{" "}
          <ButtonVerse onClick={onClickVerse}>({verse.verseid})</ButtonVerse>
          <ButtonExpand onClick={setOpen} />
          <Button variant={"ghost"} onClick={() => onClickTagVerse(verse)}>
            🏷️
          </Button>
        </VerseContainer>
        <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
      </>
    );
  }
);

ListVerseComponent.displayName = "ListVerseComponent";

interface VerseTagsProps {
  versesTags: string[];
  tags: tagsProps;
}

const VerseTags = ({ versesTags, tags }: VerseTagsProps) => {
  return (
    <Flex flexWrap={"wrap"} gap={"5px"} pb={"5px"} fontSize={"medium"}>
      {versesTags.map((tagID) => (
        <Box
          as="span"
          padding={"3px"}
          bgColor={"yellow.emphasized"}
          borderRadius={"0.3rem"}
          overflowWrap={"break-word"}
          overflowX={"hidden"}
          fontFamily={"initial"}
          key={tagID}
        >
          {tags[tagID].tagDisplay}
        </Box>
      ))}
    </Flex>
  );
};

export default TagsDisplay;
