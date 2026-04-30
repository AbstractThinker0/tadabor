import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

import { useLettersPageStore } from "@/store/pages/lettersPage";

import {
  Dialog,
  type DialogOpenChangeDetails,
  Button,
  ButtonGroup,
  Input,
} from "@chakra-ui/react";

import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

interface ModalCreatePresetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreatePreset = ({ isOpen, onClose }: ModalCreatePresetProps) => {
  const { t, i18n } = useTranslation();

  const [presetName, setPresetName] = useState("");

  const savePreset = useLettersPageStore((state) => state.savePreset);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPresetName(event.target.value);
  };

  const onClickSave = async () => {
    if (presetName.trim().length === 0) {
      alert(t("letters.create_preset.empty"));
      return;
    }

    const presetID = uuidv4();

    const success = await savePreset(presetID, presetName);

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
  };

  const onCloseComplete = () => {
    setPresetName("");
  };

  const onOpenChange = (details: DialogOpenChangeDetails) => {
    if (!details.open) {
      onCloseComplete();
    }
  };

  return (
    <Dialog.Root
      size="xl"
      open={isOpen}
      onOpenChange={onOpenChange}
      onInteractOutside={onClose}
      placement={"center"}
    >
      <DialogContent dir={i18n.dir()}>
        <Dialog.Header
          borderBottom="1px solid"
          borderColor={"border.emphasized"}
        >
          {t("letters.create_preset.title")}
        </Dialog.Header>

        <Dialog.Body>
          <div>
            <span>{t("letters.create_preset.name")}</span>
            <Input
              dir="auto"
              id="presetName"
              value={presetName}
              onChange={onChangeName}
            />
          </div>
        </Dialog.Body>

        <Dialog.Footer
          mt={5}
          justifyContent="center"
          borderTop="1px solid"
          borderColor={"border.emphasized"}
        >
          <ButtonGroup>
            <Button onClick={onClose}>{t("ui.actions.close")}</Button>
            <Button colorPalette="blue" onClick={onClickSave}>
              {t("ui.actions.save_changes")}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>

        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
};

export { ModalCreatePreset };
