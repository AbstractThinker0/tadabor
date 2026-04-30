import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { colorProps } from "@/components/Pages/Coloring/consts";
import { useColoringPageStore } from "@/store/pages/coloringPage";

import { Box, Input } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

import { FormModal } from "@/components/Generic/FormModal";

interface AddColorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddColorModal = ({ isOpen, onClose }: AddColorModalProps) => {
  const { t } = useTranslation();
  const addColor = useColoringPageStore((state) => state.addColor);
  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("#000000");

  function onChangeName(event: React.ChangeEvent<HTMLInputElement>) {
    setColorName(event.target.value);
  }

  function onInputColor(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();

    setColorCode(event.currentTarget.value);
  }

  async function onClickSave() {
    if (!colorName) {
      alert(t("coloring.add.display_name_required"));
      return;
    }

    const newColor: Omit<colorProps, "colorID"> = {
      colorCode: colorCode,
      colorDisplay: colorName,
    };

    const success = await addColor(newColor);

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

    setColorName("");
    setColorCode("#000000");
    onClose();
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={onClickSave}
      title={t("coloring.add.title")}
    >
      <Box pb={1}>
        <span>{t("coloring.add.display_name_label")} </span>
        <Input
          type="text"
          placeholder={t("coloring.add.display_name_placeholder")}
          value={colorName}
          onChange={onChangeName}
        />
      </Box>
      <div>
        <span>{t("coloring.add.color_label")}</span>
        <Input onInput={onInputColor} type="color" value={colorCode} />
      </div>
    </FormModal>
  );
};

export { AddColorModal };
