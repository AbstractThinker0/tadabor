import { dbFuncs } from "@/util/db";

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
} from "@chakra-ui/react";

interface DeleteTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  getTaggedVerses: (tagID: string) => number;
}

const DeleteTagModal = ({
  isOpen,
  onClose,
  getTaggedVerses,
}: DeleteTagModalProps) => {
  const dispatch = useAppDispatch();

  const currentTag = useAppSelector((state) => state.tagsPage.currentTag);

  const versesCount = currentTag ? getTaggedVerses(currentTag.tagID) : 0;

  function onClickDelete() {
    if (!currentTag) return;

    dispatch(tagsPageActions.deleteTag(currentTag.tagID));

    dbFuncs.deleteTag(currentTag.tagID);
    onClose();
  }

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent dir="ltr">
        <ModalHeader borderBottom="1px solid #dee2e6">
          Delete tag confirmation
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            Are you sure you want to delete{" "}
            <Box
              as="span"
              padding={"4px"}
              bgColor={"#ffffbf"}
              overflowWrap={"break-word"}
              borderRadius={"0.375rem"}
            >
              {currentTag?.tagDisplay}
            </Box>{" "}
            tag? All verses tagged with this tag will lose it.
          </Box>
          <p>Number of verses affected: {versesCount}</p>
        </ModalBody>
        <ModalFooter
          mt={5}
          justifyContent="center"
          borderTop="1px solid #dee2e6"
        >
          <ButtonGroup>
            <Button onClick={onClose}>No, Cancel</Button>
            <Button colorScheme="red" onClick={onClickDelete}>
              Yes, delete
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteTagModal;
