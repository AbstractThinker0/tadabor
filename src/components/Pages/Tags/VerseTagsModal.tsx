import { useState } from "react";

import useQuran from "@/context/useQuran";

import { useTagsPageStore } from "@/store/zustand/tagsPage";

import { Dialog, Button, ButtonGroup, Box, Flex } from "@chakra-ui/react";

import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";

import VerseContainer from "@/components/Custom/VerseContainer";

interface VerseTagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function VerseTagsModal({ isOpen, onClose }: VerseTagModalProps) {
  const tags = useTagsPageStore((state) => state.tags);

  const currentVerse = useTagsPageStore((state) => state.currentVerse);

  // We need to look up the tags for the current verse
  const versesTags = useTagsPageStore((state) => state.versesTags);
  const currentVerseTags = currentVerse ? versesTags[currentVerse.key] || [] : [];

  const setVerseTagsStore = useTagsPageStore((state) => state.setVerseTags);
  const setCurrentVerse = useTagsPageStore((state) => state.setCurrentVerse);

  const quranService = useQuran();

  const [editedTags, setEditedTags] = useState<string[] | null>(null);

  const currentTags = editedTags ?? currentVerseTags;

  const setVerseTags = (verseKey: string, tags: string[] | null) => {
    // The store action handles dbFuncs internally
    setVerseTagsStore(verseKey, tags);
  };

  const onCloseComplete = () => {
    onClose();

    setEditedTags(null);

    setCurrentVerse(null);
  };

  const canFindTag = (tagID: string) => {
    return currentTags.includes(tagID);
  };

  function onClickTag(tagID: string) {
    if (!currentVerse) return;

    let newTags: string[] = [];

    if (canFindTag(tagID)) {
      newTags = currentTags.filter((nTag) => {
        return nTag !== tagID;
      });
    } else {
      newTags = [...currentTags, tagID];
    }

    setEditedTags(newTags);
  }

  function onClickSave() {
    if (currentVerse?.key) setVerseTags(currentVerse.key, currentTags);

    onCloseComplete();
  }

  return (
    <Dialog.Root
      size="xl"
      open={isOpen}
      onInteractOutside={onCloseComplete}
      placement={"center"}
    >
      <DialogContent dir="ltr">
        <Dialog.Header
          borderBottom="1px solid"
          borderColor={"border.emphasized"}
        >
          Choose verse tags
        </Dialog.Header>

        <Dialog.Body>
          <Box textAlign={"center"} fontSize={"large"} pb={2}>
            (
            {currentVerse
              ? `${quranService.getChapterName(currentVerse.suraid)}:${currentVerse.verseid
              }`
              : ""}
            )
          </Box>
          <VerseContainer
            displayMode="default"
            center
            bgColor={"gray.emphasized"}
            padding={"4px"}
            mb={"5px"}
            borderRadius={"0.375rem"}
            textAlign={"center"}
            lineHeight={"normal"}
          >
            {currentVerse?.versetext}
          </VerseContainer>
          <Flex flexWrap={"wrap"} justify={"center"} gap={"10px"}>
            {Object.keys(tags).map((tagID) => (
              <Box
                cursor={"pointer"}
                padding={"4px"}
                overflowWrap={"break-word"}
                wordBreak={"break-word"}
                borderRadius={"0.3rem"}
                textAlign={"center"}
                fontSize={"large"}
                mb={1}
                bgColor={canFindTag(tagID) ? "yellow.emphasized" : "gray.muted"}
                onClick={() => onClickTag(tagID)}
                key={tagID}
              >
                {tags[tagID].tagDisplay}
              </Box>
            ))}
          </Flex>
        </Dialog.Body>
        <Dialog.Footer
          mt={5}
          justifyContent="center"
          borderTop="1px solid"
          borderColor={"border.emphasized"}
        >
          <ButtonGroup>
            <Button colorPalette="blue" onClick={onCloseComplete}>
              Close
            </Button>
            <Button colorPalette="green" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onCloseComplete} />
      </DialogContent>
    </Dialog.Root>
  );
}

export default VerseTagsModal;
