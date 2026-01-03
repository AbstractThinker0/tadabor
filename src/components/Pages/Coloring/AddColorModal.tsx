import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

import type { colorProps } from "@/components/Pages/Coloring/consts";
import { useColoringPageStore } from "@/store/zustand/coloringPage";
import { dbFuncs } from "@/util/db";

import { Dialog, Button, ButtonGroup, Box, Input } from "@chakra-ui/react";
import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

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

  function onClickSave() {
    if (!colorName) {
      alert("Please enter the color display name");
      return;
    }

    const newColor: colorProps = {
      colorID: uuidv4(),
      colorCode: colorCode,
      colorDisplay: colorName,
    };

    addColor(newColor);

    dbFuncs
      .saveColor({
        id: newColor.colorID,
        name: newColor.colorDisplay,
        code: newColor.colorCode,
      })
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

    setColorName("");
    setColorCode("#000000");
    onClose();
  }

  return (
    <Dialog.Root
      size="lg"
      open={isOpen}
      onInteractOutside={onClose}
      placement={"center"}
    >
      <DialogContent dir="ltr">
        <Dialog.Header
          fontSize={"xl"}
          borderBottom="1px solid"
          borderColor={"border.emphasized"}
        >
          Add a new color
        </Dialog.Header>

        <Dialog.Body>
          <Box pb={1}>
            <span>Display name: </span>
            <Input
              type="text"
              placeholder="display name"
              value={colorName}
              onChange={onChangeName}
            />
          </Box>
          <div>
            <span>Color:</span>
            <Input onInput={onInputColor} type="color" value={colorCode} />
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

export default AddColorModal;
