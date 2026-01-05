import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useLettersPageStore } from "@/store/zustand/lettersPage";

import TextareaToolbar from "@/components/Note/TextareaToolbar";

import { Dialog, Button, ButtonGroup } from "@chakra-ui/react";

import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";

import TextareaAutosize from "@/components/Note/TextareaAutosize";

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

  const currentDef = useLettersPageStore(
    (state) => state.lettersDefinitions[defKey]
  ) || { name: "", definition: "", dir: "" };

  const saveDefinition = useLettersPageStore((state) => state.saveDefinition);

  const [editedDef, setEditedDef] = useState<string | null>(null);
  const [editedDir, setEditedDir] = useState<string | null>(null);

  // Derive effective values (uses edited if set, otherwise falls back to external state)
  const letterDef = editedDef ?? currentDef.definition;
  const letterDir = editedDir ?? (currentDef.dir || "rtl");

  const onClickSave = async () => {
    const success = await saveDefinition(
      currentPreset,
      currentLetter,
      letterDef,
      letterDir
    );

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

    onCloseComplete();
  };

  const onCloseComplete = () => {
    onClose();
    setEditedDef(null);
    setEditedDir(null);
  };

  const handleSetDirection = (dir: string) => {
    setEditedDir(dir);
  };

  const onChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedDef(event.target.value);
  };

  return (
    <Dialog.Root
      size="xl"
      open={isOpen}
      onInteractOutside={onCloseComplete}
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
            <Button onClick={onCloseComplete}>Cancel</Button>
            <Button colorPalette="blue" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onCloseComplete} />
      </DialogContent>
    </Dialog.Root>
  );
};

export default ModalEditLetter;
