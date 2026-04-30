import type { ReactNode } from "react";
import { Dialog, Button, ButtonGroup } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColorPalette?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText,
  cancelText,
  confirmColorPalette = "red",
  size = "xl",
}: ConfirmationModalProps) => {
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
            <Button colorPalette="gray" onClick={onClose}>
              {cancelText ?? t("ui.actions.cancel")}
            </Button>
            <Button colorPalette={confirmColorPalette} onClick={onConfirm}>
              {confirmText ?? t("ui.actions.confirm")}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
};

export { ConfirmationModal };
