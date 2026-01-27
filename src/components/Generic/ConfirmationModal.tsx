import type { ReactNode } from "react";
import { Dialog, Button, ButtonGroup } from "@chakra-ui/react";
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
  confirmText = "Yes, confirm",
  cancelText = "No, Cancel",
  confirmColorPalette = "red",
  size = "xl",
}: ConfirmationModalProps) => {
  return (
    <Dialog.Root
      size={size}
      open={isOpen}
      onInteractOutside={onClose}
      placement={"center"}
    >
      <DialogContent dir="ltr">
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
              {cancelText}
            </Button>
            <Button colorPalette={confirmColorPalette} onClick={onConfirm}>
              {confirmText}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
};

export default ConfirmationModal;
