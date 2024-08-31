import { memo } from "react";

import { IconTextDirectionLtr, IconTextDirectionRtl } from "./Icons";
import { Box, Button } from "@chakra-ui/react";

interface TextareaToolbarProps {
  inputKey: string;
  handleSetDirection: (key: string, direction: string) => void;
}

const TextareaToolbar = memo(
  ({ inputKey, handleSetDirection }: TextareaToolbarProps) => {
    return (
      <Box dir="ltr" textAlign="center" lineHeight={1}>
        <ToolbarOption handleClick={() => handleSetDirection(inputKey, "ltr")}>
          <IconTextDirectionLtr />
        </ToolbarOption>
        <ToolbarOption handleClick={() => handleSetDirection(inputKey, "rtl")}>
          <IconTextDirectionRtl />
        </ToolbarOption>
      </Box>
    );
  }
);

interface ToolbarOptionProps {
  handleClick: () => void;
  children: JSX.Element;
}

function ToolbarOption({ handleClick, children }: ToolbarOptionProps) {
  const onClickButton = () => {
    handleClick();
  };

  return (
    <Button variant="ghost" size="sm" onClick={onClickButton}>
      {children}
    </Button>
  );
}

export default TextareaToolbar;
