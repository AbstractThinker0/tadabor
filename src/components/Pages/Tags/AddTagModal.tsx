import { useState } from "react";
import { dbFuncs } from "@/util/db";
import { tagProps } from "@/components/Pages/Tags/consts";

import { useAppDispatch } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { Dialog, Button, ButtonGroup, Box, Input } from "@chakra-ui/react";
import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";

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
    <Dialog.Root
      size="xl"
      open={isOpen}
      onInteractOutside={onClose}
      placement={"center"}
    >
      <DialogContent dir="ltr">
        <Dialog.Header
          borderBottom="1px solid"
          borderColor={"border.emphasized"}
        >
          Add a new tag
        </Dialog.Header>

        <Dialog.Body>
          <Box pb={1}>
            <span>Display name: </span>
            <Input
              type="text"
              placeholder="display name"
              value={tagName}
              onChange={onChangeName}
            />
          </Box>
        </Dialog.Body>
        <Dialog.Footer
          mt={5}
          justifyContent="center"
          borderTop="1px solid"
          borderColor={"border.emphasized"}
        >
          <ButtonGroup>
            <Button onClick={onClose}>Close</Button>
            <Button colorPalette="blue" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
};

export default AddTagModal;
