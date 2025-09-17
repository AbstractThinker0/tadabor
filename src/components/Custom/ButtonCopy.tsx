import { useClipboard, IconButton } from "@chakra-ui/react";

import { toasterBottomCenter } from "@/components/ui/toaster";

import { FiCopy } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";

interface ButtonCopyProps {
  copyText: string;
  copyNotice: string;
}

const ButtonCopy = ({ copyText, copyNotice }: ButtonCopyProps) => {
  const clipboard = useClipboard({ value: copyText });

  const onClickCopy = () => {
    clipboard.copy();
    toasterBottomCenter.create({
      type: "success",
      description: copyNotice,
      meta: { center: true },
    });
  };

  return (
    <IconButton
      colorPalette={clipboard.copied ? "teal" : undefined}
      variant={clipboard.copied ? "solid" : "ghost"}
      onClick={onClickCopy}
      marginEnd={"3px"}
      width={"6px"}
      height={"36px"}
    >
      {clipboard.copied ? <FiCheck /> : <FiCopy />}
    </IconButton>
  );
};

export { ButtonCopy };
