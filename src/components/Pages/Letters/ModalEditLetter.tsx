import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";

import { lettersPageActions } from "@/store/slices/pages/letters";

import { dbFuncs } from "@/util/db";

import TextareaToolbar from "@/components/Generic/TextareaToolbar";

import {
  Dialog,
  Button,
  ButtonGroup,
  type DialogOpenChangeDetails,
} from "@chakra-ui/react";

import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

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

  const onOpenChange = (details: DialogOpenChangeDetails) => {
    if (!details.open) {
      onCloseComplete();
    }
  };

  const handleSetDirection = (dir: string) => {
    setLetterDir(dir);
  };

  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLetterDef(event.target.value);
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
          Edit definition of: {currentLetter}
        </Dialog.Header>

        <Dialog.Body>
          <div>
            <TextareaToolbar handleSetDirection={handleSetDirection} />

            <TextareaAutosize
              value={letterDef}
              dir={letterDir}
              onChange={onChangeText}
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
            <Button onClick={onClose}>Cancel</Button>
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

export default ModalEditLetter;
