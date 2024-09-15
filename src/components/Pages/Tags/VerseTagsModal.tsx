import { useEffect, useState } from "react";

import { dbFuncs } from "@/util/db";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  ButtonGroup,
  Box,
  Flex,
} from "@chakra-ui/react";

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
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={onCloseComplete}
      isCentered
    >
      <ModalOverlay />
      <ModalContent dir="ltr">
        <ModalHeader borderBottom="1px solid #dee2e6">
          Choose verse tags
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box textAlign={"center"} fontSize={"large"}>
            (
            {currentVerse
              ? `${quranService.getChapterName(currentVerse.suraid)}:${
                  currentVerse.verseid
                }`
              : ""}
            )
          </Box>
          <VerseContainer
            bgColor={"rgb(245, 244, 244)"}
            padding={"4px"}
            mb={"5px"}
            borderRadius={"0.375rem"}
            textAlign={"center"}
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
                bgColor={canFindTag(tagID) ? "#ffffbf" : "grey"}
                onClick={() => onClickTag(tagID)}
                key={tagID}
              >
                {tags[tagID].tagDisplay}
              </Box>
            ))}
          </Flex>
        </ModalBody>
        <ModalFooter
          mt={5}
          justifyContent="center"
          borderTop="1px solid #dee2e6"
        >
          <ButtonGroup>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default VerseTagsModal;
