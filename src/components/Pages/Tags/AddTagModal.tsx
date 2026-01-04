import { useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import type { tagProps } from "@/components/Pages/Tags/consts";

import { useTagsPageStore } from "@/store/zustand/tagsPage";

import { Dialog, Button, ButtonGroup, Box, Input } from "@chakra-ui/react";
import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

interface AddTagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTagModal = ({ isOpen, onClose }: AddTagModalProps) => {
  const { t } = useTranslation();
  const addTag = useTagsPageStore((state) => state.addTag);

  const [tagName, setTagName] = useState("");

  function onChangeName(event: React.ChangeEvent<HTMLInputElement>) {
    setTagName(event.target.value);
  }

  async function onClickSave() {
    if (!tagName) {
      alert("Please enter the tag display name");
      return;
    }

    const newTag: tagProps = {
      tagID: uuidv4(),
      tagDisplay: tagName,
    };

    // Async action handles DB persistence
    const success = await addTag(newTag);

    if (success) {
      toaster.create({
        description: t("save_success"),
        type: "success",
      });
    } else {
      toaster.create({
        description: t("save_failed"),
        type: "error",
      });
    }

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
