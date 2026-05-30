import { useTranslation } from "react-i18next";
import { useTagsPageStore } from "@/store/pages/tagsPage";

import { Box, Span } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

import { ConfirmationModal } from "@/components/Generic/ConfirmationModal";

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
      toaster.success(t("ui.messages.save_success"));
    } else {
      toaster.error(t("ui.messages.save_failed"));
    }

    onClose();
  }

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClickDelete}
      title={t("tags.delete.title")}
      confirmText={t("tags.delete.confirm")}
    >
      <Box>
        {t("tags.delete.body_prefix")}{" "}
        <Span
          padding={"3px"}
          bgColor={"yellow.emphasized"}
          wordBreak={"break-all"}
          borderRadius={"0.375rem"}
        >
          {currentTag?.tagDisplay}
        </Span>{" "}
        {t("tags.delete.body_suffix")}
      </Box>
      <p>{t("tags.delete.affected_verses", { count: versesCount })}</p>
    </ConfirmationModal>
  );
};

export { DeleteTagModal };
