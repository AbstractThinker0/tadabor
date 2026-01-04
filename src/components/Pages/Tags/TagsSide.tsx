import { useTranslation } from "react-i18next";
import { useTagsPageStore } from "@/store/zustand/tagsPage";

import type { tagProps } from "@/components/Pages/Tags/consts";
import AddTagModal from "@/components/Pages/Tags/AddTagModal";
import DeleteTagModal from "@/components/Pages/Tags/DeleteTagModal";

import { Box, Flex, Button, Text, useDisclosure } from "@chakra-ui/react";
import { ChaptersListAdvanced } from "@/components/Custom/ChaptersListAdvanced";
import type { selectedChaptersType } from "@/types";

function TagsSide() {
  const versesTags = useTagsPageStore((state) => state.versesTags);
  const selectTag = useTagsPageStore((state) => state.selectTag);

  function onClickSelectTag(tag: tagProps) {
    selectTag(tag);
  }

  const getTaggedVerses = (tagID: string) => {
    let countTags = 0;
    Object.keys(versesTags).forEach((verseKey: string) => {
      versesTags[verseKey].forEach((verseTagID) => {
        if (verseTagID === tagID) {
          countTags++;
        }
      });
    });
    return countTags;
  };

  const selectedVerse = useTagsPageStore((state) => state.selectedVerse);

  const currentChapter = useTagsPageStore((state) => state.currentChapter);

  const selectedChapters = useTagsPageStore(
    (state) => state.selectedChapters
  );

  const setSelectedVerse = useTagsPageStore((state) => state.setSelectedVerse);
  const setChapterAction = useTagsPageStore((state) => state.setChapter);
  const setSelectedChaptersAction = useTagsPageStore((state) => state.setSelectedChapters);
  const toggleSelectChapterAction = useTagsPageStore((state) => state.toggleSelectChapter);

  const onClickVerse = (verseKey: string) => {
    setSelectedVerse(verseKey);
  };

  const setChapter = (chapter: number) => {
    setChapterAction(chapter);
  };

  const setSelectedChapters = (chapters: selectedChaptersType) => {
    setSelectedChaptersAction(chapters);
  };

  const toggleSelectChapter = (chapter: number) => {
    toggleSelectChapterAction(chapter);
  };

  return (
    <Flex
      flexDir={"column"}
      pt={"10px"}
      paddingInlineStart={"10px"}
      paddingInlineEnd={"1px"}
    >
      <ChaptersListAdvanced
        currentChapter={currentChapter}
        selectedChapters={selectedChapters}
        setChapter={setChapter}
        setSelectedChapters={setSelectedChapters}
        toggleSelectChapter={toggleSelectChapter}
        setVerseToken={onClickVerse}
        selectedVerse={selectedVerse}
      />
      <SideList
        onClickSelectTag={onClickSelectTag}
        getTaggedVerses={getTaggedVerses}
      />
      <VersesCount />
    </Flex>
  );
}

interface SideListProps {
  onClickSelectTag(tag: tagProps): void;

  getTaggedVerses: (tagID: string) => number;
}

const SideList = ({
  onClickSelectTag,

  getTaggedVerses,
}: SideListProps) => {
  const {
    open: isOpenAddModal,
    onOpen: onOpenAddModal,
    onClose: onCloseAddModal,
  } = useDisclosure();

  const {
    open: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const tags = useTagsPageStore((state) => state.tags);

  const selectedTags = useTagsPageStore((state) => state.selectedTags);
  const setCurrentTag = useTagsPageStore((state) => state.setCurrentTag);

  const onClickDeleteTag = (tag: tagProps) => {
    setCurrentTag(tag);
    onOpenDeleteModal();
  };

  const isTagSelected = (tagID: string) => (selectedTags[tagID] ? true : false);

  return (
    <Flex
      flexDir={"column"}
      minH={"40vh"}
      maxH={"40vh"}
      marginTop={"1rem"}
      padding={"10px"}
      maxW={"300px"}
      borderRadius={"0.3rem"}
      bgColor={"gray.muted"}
      dir="ltr"
    >
      <Box fontWeight={"bold"} pb={1}>
        Tags list:
      </Box>
      {Object.keys(tags).length > 0 && (
        <Flex
          flexWrap={"wrap"}
          gap={"5px"}
          maxW={"300px"}
          cursor={"pointer"}
          overflowY={"auto"}
          overflowX={"hidden"}
          fontFamily={"initial"}
          pb={1}
        >
          {Object.keys(tags).map((tagID) => (
            <Flex
              padding={"2px"}
              bgColor={
                isTagSelected(tagID) ? "yellow.emphasized" : "gray.subtle"
              }
              borderRadius={"0.3rem"}
              key={tagID}
              overflowX={"hidden"}
            >
              <Box
                paddingRight={"8px"}
                maxW={"250px"}
                overflowX={"hidden"}
                overflowWrap={"break-word"}
                onClick={() => onClickSelectTag(tags[tagID])}
              >
                {tags[tagID].tagDisplay} ({getTaggedVerses(tagID)})
              </Box>
              <div onClick={() => onClickDeleteTag(tags[tagID])}>🗑️</div>
            </Flex>
          ))}
        </Flex>
      )}
      <DeleteTagModal
        isOpen={isOpenDeleteModal}
        onClose={onCloseDeleteModal}
        getTaggedVerses={getTaggedVerses}
      />
      <Box>
        <Button
          colorPalette="teal"
          fontWeight={"normal"}
          onClick={onOpenAddModal}
        >
          Add tag
        </Button>
        <AddTagModal isOpen={isOpenAddModal} onClose={onCloseAddModal} />
      </Box>
    </Flex>
  );
};

const VersesCount = () => {
  const { t } = useTranslation();

  const versesTags = useTagsPageStore((state) => state.versesTags);
  const selectedChapters = useTagsPageStore(
    (state) => state.selectedChapters
  );
  const selectedTags = useTagsPageStore((state) => state.selectedTags);

  const getSelectedVerses = () => {
    const asArray = Object.entries(versesTags);

    const filtered = asArray.filter(([key, tags]) => {
      const info = key.split("-");
      return (
        selectedChapters[info[0]] === true &&
        tags.some((tagID) => Object.keys(selectedTags).includes(tagID))
      );
    });

    return filtered.length;
  };

  const selectedCount = getSelectedVerses();

  if (!Object.keys(selectedTags).length) return null;

  return (
    <Text fontWeight={"bold"} color={"green.fg"}>
      {`${t("search.count")} ${selectedCount}`}
    </Text>
  );
};

export default TagsSide;
