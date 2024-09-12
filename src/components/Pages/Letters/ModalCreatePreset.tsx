import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAppDispatch } from "@/store";

import { lettersPageActions } from "@/store/slices/pages/letters";

import { dbFuncs } from "@/util/db";
import { onlySpaces } from "@/util/util";

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
  Input,
} from "@chakra-ui/react";

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

    const presetID = Date.now().toString();
    dispatch(lettersPageActions.setPreset({ presetID, presetName }));
    dbFuncs
      .saveLettersPreset(presetID, presetName)
      .then(() => {
        toast.success(t("save_success"));
      })
      .catch(() => {
        toast.error(t("save_failed"));
      });

    onClose();
  };

  const onCloseComplete = () => {
    setPresetName("");
  };

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={onCloseComplete}
      isCentered
    >
      <ModalOverlay />
      <ModalContent dir="ltr">
        <ModalHeader borderBottom="1px solid #dee2e6">
          Create a new preset
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <span>Preset name:</span>
            <Input
              dir="auto"
              id="presetName"
              value={presetName}
              onChange={onChangeName}
            />
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

export default ModalCreatePreset;
