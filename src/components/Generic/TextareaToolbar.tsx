import { Box, IconButton } from "@chakra-ui/react";

import {
  IconTextDirectionLtr,
  IconTextDirectionRtl,
} from "@/components/Generic/Icons";

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
        <IconTextDirectionLtr />
      </IconButton>
      <IconButton
        variant="ghost"
        aria-label="rtl"
        onClick={() => handleSetDirection("rtl")}
      >
        <IconTextDirectionRtl />
      </IconButton>
    </Box>
  );
};

export default TextareaToolbar;
