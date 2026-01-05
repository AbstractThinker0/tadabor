import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/store";

import { lettersPageActions } from "@/store/slices/pages/letters";

import { dbLetters } from "@/util/dbFuncs";
import { onlySpaces } from "@/util/util";

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
  const { t } = useTranslation();

  const [presetName, setPresetName] = useState("");

  const dispatch = useAppDispatch();

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPresetName(event.target.value);
  };

  const onClickSave = () => {
    if (onlySpaces(presetName)) {
      alert("Preset name can't be empty.");
      return;
    }

    const presetID = uuidv4();
    dispatch(lettersPageActions.setPreset({ presetID, presetName }));
    dbLetters
      .savePreset(presetID, presetName)
      .then(() => {
        toaster.create({
          description: t("save_success"),
          type: "success",
        });
      })
      .catch(() => {
        toaster.create({
          description: t("save_failed"),
          type: "error",
        });
      });

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
      <DialogContent dir="ltr">
        <Dialog.Header
          borderBottom="1px solid"
          borderColor={"border.emphasized"}
        >
          Create a new preset
        </Dialog.Header>

        <Dialog.Body>
          <div>
            <span>Preset name:</span>
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

export default ModalCreatePreset;
