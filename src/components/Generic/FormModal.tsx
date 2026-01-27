import type { ReactNode } from "react";
import { Dialog, Button, ButtonGroup } from "@chakra-ui/react";
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
  saveText = "Save changes",
  closeText = "Close",
  size = "lg",
}: FormModalProps) => {
  return (
    <Dialog.Root
      size={size}
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
            <Button onClick={onClose}>{closeText}</Button>
            <Button colorPalette="blue" onClick={onSave}>
              {saveText}
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
};

export default FormModal;
