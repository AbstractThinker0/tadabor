import { useTranslation } from "react-i18next";
import { useTagsPageStore } from "@/store/pages/tagsPage";

import { Box, Span } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

import ConfirmationModal from "@/components/Generic/ConfirmationModal";

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
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClickDelete}
      title="Delete tag confirmation"
      confirmText="Yes, delete"
    >
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
    </ConfirmationModal>
  );
};

export default DeleteTagModal;
