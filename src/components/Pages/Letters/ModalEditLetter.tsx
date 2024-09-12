import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/store";

import { lettersPageActions } from "@/store/slices/pages/letters";

import { dbFuncs } from "@/util/db";

import TextareaToolbar from "@/components/Generic/TextareaToolbar";

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
} from "@chakra-ui/react";
import TextareaAutosize from "@/components/Custom/TextareaAutosize";

interface ModalEditLetterProps {
  isOpen: boolean;
  onClose: () => void;
  currentLetter: string;
  currentPreset: string;
}

const ModalEditLetter = ({
  isOpen,
  onClose,
  currentLetter,
  currentPreset,
}: ModalEditLetterProps) => {
  const { t } = useTranslation();

  const defKey =
    currentPreset === "-1"
      ? currentLetter
      : `${currentLetter}:${currentPreset}`;

  const currentDef = useAppSelector(
    (state) => state.lettersPage.lettersDefinitions[defKey]
  ) || { name: "", definition: "", dir: "" };

  const [letterDef, setLetterDef] = useState(currentDef.definition);
  const [letterDir, setLetterDir] = useState(currentDef.dir || "rtl");

  const dispatch = useAppDispatch();

  const onClickSave = () => {
    dbFuncs
      .saveLetterDefinition(currentPreset, currentLetter, letterDef, letterDir)
      .then(() => {
        toast.success(t("save_success"));
      })
      .catch(() => {
        toast.error(t("save_failed"));
      });

    dispatch(
      lettersPageActions.setLetterDefinition({
        name: currentLetter,
        definition: letterDef,
        dir: letterDir,
        preset_id: currentPreset,
      })
    );

    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setLetterDef(currentDef.definition);
      setLetterDir(currentDef.dir || "rtl");
    }
  }, [isOpen]);

  const onCloseComplete = () => {
    setLetterDef("");
    setLetterDir("");
  };

  const handleSetDirection = (dir: string) => {
    setLetterDir(dir);
  };

  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLetterDef(event.target.value);
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
          Edit definition of: {currentLetter}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <TextareaToolbar handleSetDirection={handleSetDirection} />

            <TextareaAutosize
              value={letterDef}
              dir={letterDir}
              onChange={onChangeText}
            />
          </div>
        </ModalBody>
        <ModalFooter
          mt={5}
          justifyContent="center"
          borderTop="1px solid #dee2e6"
        >
          <ButtonGroup>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalEditLetter;
