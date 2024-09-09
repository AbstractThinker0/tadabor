import { useState } from "react";
import { dbFuncs } from "@/util/db";
import { tagProps } from "@/components/Pages/Tags/consts";

import { useAppDispatch } from "@/store";
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
  Input,
} from "@chakra-ui/react";

interface AddTagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTagModal = ({ isOpen, onClose }: AddTagModalProps) => {
  const dispatch = useAppDispatch();

  const [tagName, setTagName] = useState("");

  function onChangeName(event: React.ChangeEvent<HTMLInputElement>) {
    setTagName(event.target.value);
  }

  function onClickSave() {
    if (!tagName) {
      alert("Please enter the tag display name");
      return;
    }

    const newTag: tagProps = {
      tagID: Date.now().toString(),
      tagDisplay: tagName,
    };

    dispatch(tagsPageActions.addTag(newTag));

    dbFuncs.saveTag({
      id: newTag.tagID,
      name: newTag.tagDisplay,
    });

    setTagName("");
    onClose();
  }

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent dir="ltr">
        <ModalHeader borderBottom="1px solid #dee2e6">
          Add a new tag
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box pb={1}>
            <span>Display name: </span>
            <Input
              type="text"
              placeholder="display name"
              value={tagName}
              onChange={onChangeName}
            />
          </Box>
        </ModalBody>
        <ModalFooter
          mt={5}
          justifyContent="center"
          borderTop="1px solid #dee2e6"
        >
          <ButtonGroup>
            <Button onClick={onClose}>Close</Button>
            <Button colorScheme="blue" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTagModal;
