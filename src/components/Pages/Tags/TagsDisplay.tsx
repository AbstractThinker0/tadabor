import { memo, useEffect, useRef, useState, useTransition } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { verseProps } from "quran-tools";
import useQuran from "@/context/useQuran";

import { ButtonExpand, ButtonVerse } from "@/components/Generic/Buttons";

import VerseContainer from "@/components/Custom/VerseContainer";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { tagsProps, versesTagsProps } from "@/components/Pages/Tags/consts";
import VerseTagsModal from "@/components/Pages/Tags/VerseTagsModal";
import { ListTitle } from "@/components/Pages/Tags/ListTitle";
import { ButtonSidebar } from "@/components/Pages/Tags/ButtonSidebar";
import { VerseTags } from "@/components/Pages/Tags/VerseTags";

import { Box, Button, Flex, Tag, useDisclosure } from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import { useBoolean } from "usehooks-ts";

function TagsDisplay() {
  const selectedTags = useAppSelector((state) => state.tagsPage.selectedTags);

  const { open, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      flexDir={"column"}
      overflowY={"scroll"}
      w={"100%"}
      minH={"100%"}
      flex={1}
      padding={"0.5rem"}
    >
      <Flex
        border={"1px solid"}
        borderColor={"border.emphasized"}
        borderRadius={"l3"}
        flex={1}
        flexDir={"column"}
      >
        {Object.keys(selectedTags).length ? (
          <SelectedContainer onOpenVerseModal={onOpen} />
        ) : (
          <ListVerses onOpenVerseModal={onOpen} />
        )}
      </Flex>
      <VerseTagsModal isOpen={open} onClose={onClose} />
    </Flex>
  );
}

interface SelectedContainerProps {
  onOpenVerseModal: () => void;
}

const SelectedContainer = ({ onOpenVerseModal }: SelectedContainerProps) => {
  const quranService = useQuran();
  const dispatch = useAppDispatch();

  const selectedTags = useAppSelector((state) => state.tagsPage.selectedTags);

  const selectedChapters = useAppSelector(
    (state) => state.tagsPage.selectedChapters
  );

  const tags = useAppSelector((state) => state.tagsPage.tags);

  const versesTags = useAppSelector((state) => state.tagsPage.versesTags);

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
    <>
      <Flex p={1}>
        <Box pt={1} paddingEnd={1}>
          <ButtonSidebar />
        </Box>
        <Box flex={1} dir="ltr">
          <Flex alignItems={"center"} gap={"0.5rem"}>
            <Box lineHeight={"short"} fontWeight={"bold"}>
              Selected tags:
            </Box>
            <Flex gap={"5px"} flexWrap={"wrap"}>
              {Object.keys(selectedTags).map((tagID) => (
                <Tag.Root
                  size="lg"
                  colorPalette={"yellow"}
                  key={tagID}
                  wordBreak={"break-all"}
                >
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
          <Flex alignItems="center" flexWrap={"wrap"} gap={"5px"}>
            <Box lineHeight={"short"} fontWeight={"bold"}>
              Selected chapters:
            </Box>
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
        </Box>
      </Flex>
      {chaptersScope.length ? (
        <SelectedVerses
          selectedTags={selectedTags}
          tags={tags}
          versesTags={getSelectedVerses()}
          onOpenVerseModal={onOpenVerseModal}
        />
      ) : (
        <Box textAlign={"center"} dir="ltr">
          You have to select at least one chapter.
        </Box>
      )}
    </>
  );
};

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
    <Box p={1}>
      {sortedVerses.length ? (
        <>
          {sortedVerses.map((verseKey) => {
            const verse = quranService.getVerseByKey(verseKey)!;
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
    </Box>
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
  onOpenVerseModal: () => void;
}

const ListVerses = memo(({ onOpenVerseModal }: ListVersesProps) => {
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  const tags = useAppSelector((state) => state.tagsPage.tags);

  const versesTags = useAppSelector((state) => state.tagsPage.versesTags);

  const currentChapter = useAppSelector(
    (state) => state.tagsPage.currentChapter
  );

  const scrollKey = useAppSelector((state) => state.tagsPage.scrollKey);

  const refVerses = useRef<HTMLDivElement>(null);

  // Handling scroll
  useEffect(() => {
    if (refVerses.current && scrollKey) {
      const verseToHighlight = refVerses.current.querySelector(
        `[data-id="${scrollKey}"]`
      ) as HTMLDivElement;

      if (verseToHighlight) {
        verseToHighlight.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [scrollKey, isPending]);

  useEffect(() => {
    //
    startTransition(() => {
      setStateVerses(quranService.getVerses(currentChapter));
    });
  }, [currentChapter]);

  return (
    <>
      <ListTitle />
      <Flex
        flexDirection={"column"}
        flex={1}
        bgColor={"brand.contrast"}
        p={1}
        ref={refVerses}
        borderBottomRadius={"l3"}
        dir="rtl"
      >
        {isPending ? (
          <LoadingSpinner text="Loading verses.." />
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
      </Flex>
    </>
  );
});

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

export default TagsDisplay;
