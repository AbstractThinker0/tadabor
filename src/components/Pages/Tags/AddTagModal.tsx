import { useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import type { tagProps } from "@/components/Pages/Tags/consts";

import { useTagsPageStore } from "@/store/pages/tagsPage";

import { Box, Input } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

import FormModal from "@/components/Generic/FormModal";

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
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={onClickSave}
      title="Add a new tag"
      size="xl"
    >
      <Box pb={1}>
        <span>Display name: </span>
        <Input
          type="text"
          placeholder="display name"
          value={tagName}
          onChange={onChangeName}
        />
      </Box>
    </FormModal>
  );
};

export default AddTagModal;
