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
        icon={<IconTextDirectionLtr />}
        onClick={() => handleSetDirection("ltr")}
      />
      <IconButton
        variant="ghost"
        aria-label="rtl"
        icon={<IconTextDirectionRtl />}
        onClick={() => handleSetDirection("rtl")}
      />
    </Box>
  );
};

export default TextareaToolbar;
