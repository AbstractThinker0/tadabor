import { useEffect, useState } from "react";

import { dbFuncs } from "@/util/db";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import {
  Dialog,
  Button,
  ButtonGroup,
  Box,
  Flex,
  type DialogOpenChangeDetails,
} from "@chakra-ui/react";

import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";

import VerseContainer from "@/components/Custom/VerseContainer";

interface VerseTagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function VerseTagsModal({ isOpen, onClose }: VerseTagModalProps) {
  const dispatch = useAppDispatch();

  const tags = useAppSelector((state) => state.tagsPage.tags);

  const versesTags = useAppSelector((state) => state.tagsPage.versesTags);

  const currentVerse = useAppSelector((state) => state.tagsPage.currentVerse);

  const quranService = useQuran();

  const [chosenTags, setChosenTags] = useState(() =>
    currentVerse
      ? versesTags[currentVerse.key]
        ? versesTags[currentVerse.key]
        : []
      : []
  );

  const setVerseTags = (verseKey: string, tags: string[] | null) => {
    if (tags === null) {
      dbFuncs.deleteVerseTags(verseKey);
    } else {
      dbFuncs.saveVerseTags({ verse_key: verseKey, tags_ids: tags });
    }

    dispatch(tagsPageActions.setVerseTags({ verseKey, tags }));
  };

  useEffect(() => {
    if (!currentVerse) return;

    setChosenTags(
      versesTags[currentVerse.key] ? versesTags[currentVerse.key] : []
    );
  }, [currentVerse]);

  const onCloseComplete = () => {
    setChosenTags([]);

    dispatch(tagsPageActions.setCurrentVerse(null));
  };

  const onOpenChange = (details: DialogOpenChangeDetails) => {
    if (!details.open) {
      onCloseComplete();
    }
  };

  const canFindTag = (tagID: string) => {
    return chosenTags.includes(tagID);
  };

  function onClickTag(tagID: string) {
    if (!currentVerse) return;

    let newTags: string[] = [];

    if (canFindTag(tagID)) {
      newTags = chosenTags.filter((nTag) => {
        return nTag !== tagID;
      });
    } else {
      newTags = [...chosenTags, tagID];
    }

    setChosenTags(newTags);
  }

  function onClickSave() {
    if (currentVerse?.key) setVerseTags(currentVerse.key, chosenTags);

    onClose();
  }

  return (
    <Dialog.Root
      size="xl"
      open={isOpen}
      onOpenChange={onOpenChange}
      onInteractOutside={onClose}
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
              ? `${quranService.getChapterName(currentVerse.suraid)}:${
                  currentVerse.verseid
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
            <Button colorPalette="blue" onClick={onClose}>
              Close
            </Button>
            <Button colorPalette="green" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
}

export default VerseTagsModal;
