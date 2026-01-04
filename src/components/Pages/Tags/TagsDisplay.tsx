import { memo, useEffect, useRef, useState, useTransition } from "react";

import { useTagsPageStore } from "@/store/zustand/tagsPage";

import type { verseProps } from "quran-tools";
import useQuran from "@/context/useQuran";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import type {
  tagsProps,
  versesTagsProps,
} from "@/components/Pages/Tags/consts";
import VerseTagsModal from "@/components/Pages/Tags/VerseTagsModal";
import { ListTitle } from "@/components/Pages/Tags/ListTitle";
import { ButtonSidebar } from "@/components/Pages/Tags/ButtonSidebar";

import { VerseItem } from "@/components/Pages/Tags/VerseItem";
import { SelectedVerseItem } from "@/components/Pages/Tags/VerseItem";

import { Box, Flex, Tag, useDisclosure } from "@chakra-ui/react";

function TagsDisplay() {
  const selectedTags = useTagsPageStore((state) => state.selectedTags);

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

  const selectedTags = useTagsPageStore((state) => state.selectedTags);

  const selectedChapters = useTagsPageStore(
    (state) => state.selectedChapters
  );

  const tags = useTagsPageStore((state) => state.tags);

  const versesTags = useTagsPageStore((state) => state.versesTags);

  const deselectTag = useTagsPageStore((state) => state.deselectTag);
  const toggleSelectChapter = useTagsPageStore((state) => state.toggleSelectChapter);

  function onClickDeleteSelected(tagID: string) {
    deselectTag(tagID);
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
    toggleSelectChapter(Number(chapterID));
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

  const refVerses = useRef<HTMLDivElement>(null);

  const scrollKey = useTagsPageStore((state) => state.scrollKey);

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
  }, [scrollKey]);

  return (
    <Box p={1} ref={refVerses} dir="rtl">
      {sortedVerses.length ? (
        <>
          {sortedVerses.map((verseKey, index) => {
            const verse = quranService.getVerseByKey(verseKey)!;
            return (
              <SelectedVerseItem
                index={index}
                key={verseKey}
                verse={verse}
                versesTags={versesTags}
                tags={tags}
                onOpenVerseModal={onOpenVerseModal}
                isSelected={verse.key == scrollKey}
              />
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

interface ListVersesProps {
  onOpenVerseModal: () => void;
}

const ListVerses = memo(({ onOpenVerseModal }: ListVersesProps) => {
  const quranService = useQuran();

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  const tags = useTagsPageStore((state) => state.tags);

  const versesTags = useTagsPageStore((state) => state.versesTags);

  const currentChapter = useTagsPageStore(
    (state) => state.currentChapter
  );

  const scrollKey = useTagsPageStore((state) => state.scrollKey);

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
  }, [currentChapter, quranService]);

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
            <VerseItem
              key={verse.key}
              verse={verse}
              isSelected={verse.key == scrollKey}
              versesTags={versesTags}
              tags={tags}
              onOpenVerseModal={onOpenVerseModal}
            />
          ))
        )}
      </Flex>
    </>
  );
});

ListVerses.displayName = "ListVerses";

export default TagsDisplay;
