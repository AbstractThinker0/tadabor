import { Box, IconButton } from "@chakra-ui/react";

import { MdOutlineFormatTextdirectionRToL } from "react-icons/md";
import { MdOutlineFormatTextdirectionLToR } from "react-icons/md";

interface TextareaToolbarProps {
  handleSetDirection: (direction: string) => void;
}

const TextareaToolbar = ({ handleSetDirection }: TextareaToolbarProps) => {
  return (
    <Box dir="ltr" textAlign="center" lineHeight={1}>
      <IconButton
        variant="ghost"
        aria-label="ltr"
        onClick={() => handleSetDirection("ltr")}
      >
        <MdOutlineFormatTextdirectionLToR />
      </IconButton>
      <IconButton
        variant="ghost"
        aria-label="rtl"
        onClick={() => handleSetDirection("rtl")}
      >
        <MdOutlineFormatTextdirectionRToL />
      </IconButton>
    </Box>
  );
};

export default TextareaToolbar;
