import type { ReactNode } from "react";
import { Dialog, Button, ButtonGroup } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  children: ReactNode;
  saveText?: string;
  closeText?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const FormModal = ({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  saveText,
  closeText,
  size = "lg",
}: FormModalProps) => {
  const { t, i18n } = useTranslation();

  return (
    <Dialog.Root
      size={size}
      open={isOpen}
      onInteractOutside={onClose}
      placement={"center"}
    >
      <DialogContent dir={i18n.dir()}>
        <Dialog.Header
          fontSize={"xl"}
          borderBottom="1px solid"
          borderColor={"border.emphasized"}
        >
          {title}
        </Dialog.Header>
        <Dialog.Body>{children}</Dialog.Body>
        <Dialog.Footer
          mt={5}
          justifyContent="center"
          borderTop="1px solid"
          borderColor={"border.emphasized"}
        >
          <ButtonGroup>
            <Button onClick={onClose}>
              {closeText ?? t("ui.actions.close")}
            </Button>
            <Button colorPalette="blue" onClick={onSave}>
              {saveText ?? t("ui.actions.save_changes")}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
};

export { FormModal };
