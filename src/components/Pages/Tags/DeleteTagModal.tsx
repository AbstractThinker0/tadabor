import { dbFuncs } from "@/util/db";

import { useAppDispatch, useAppSelector } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { Dialog, Button, ButtonGroup, Box, Span } from "@chakra-ui/react";
import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";

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
