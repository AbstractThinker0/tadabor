import { useTranslation } from "react-i18next";
import { useTagsPageStore } from "@/store/zustand/tagsPage";

import { Dialog, Button, ButtonGroup, Box, Span } from "@chakra-ui/react";
import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

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
  const { t } = useTranslation();
  const currentTag = useTagsPageStore((state) => state.currentTag);
  const deleteTag = useTagsPageStore((state) => state.deleteTag);

  const versesCount = currentTag ? getTaggedVerses(currentTag.tagID) : 0;

  async function onClickDelete() {
    if (!currentTag) return;

    // Async action handles DB deletion
    const success = await deleteTag(currentTag.tagID);

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
          Delete tag confirmation
        </Dialog.Header>

        <Dialog.Body>
          <Box>
            Are you sure you want to delete{" "}
            <Span
              padding={"3px"}
              bgColor={"yellow.emphasized"}
              wordBreak={"break-all"}
              borderRadius={"0.375rem"}
            >
              {currentTag?.tagDisplay}
            </Span>{" "}
            tag? All verses tagged with this tag will lose it.
          </Box>
          <p>Number of verses affected: {versesCount}</p>
        </Dialog.Body>
        <Dialog.Footer
          mt={5}
          justifyContent="center"
          borderTop="1px solid"
          borderColor={"border.emphasized"}
        >
          <ButtonGroup>
            <Button onClick={onClose}>No, Cancel</Button>
            <Button colorPalette="red" onClick={onClickDelete}>
              Yes, delete
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
};

export default DeleteTagModal;
