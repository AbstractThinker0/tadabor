import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { colorProps } from "./consts";
import { useAppDispatch } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";
import { dbFuncs } from "@/util/db";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  ButtonGroup,
  Box,
  Input,
} from "@chakra-ui/react";

interface AddColorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddColorModal = ({ isOpen, onClose }: AddColorModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
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
      colorID: Date.now().toString(),
      colorCode: colorCode,
      colorDisplay: colorName,
    };

    dispatch(coloringPageActions.addColor(newColor));

    dbFuncs
      .saveColor({
        id: newColor.colorID,
        name: newColor.colorDisplay,
        code: newColor.colorCode,
      })
      .then(() => {
        toast.success(t("save_success"));
      })
      .catch(() => {
        toast.error(t("save_failed"));
      });

    setColorName("");
    setColorCode("#000000");
    onClose();
  }

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent dir="ltr">
        <ModalHeader borderBottom="1px solid #dee2e6">
          Add a new color
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
        </ModalBody>
        <ModalFooter
          mt={5}
          justifyContent="center"
          borderTop="1px solid #dee2e6"
        >
          <ButtonGroup>
            <Button onClick={onClose}>Close</Button>
            <Button colorScheme="blue" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddColorModal;
