import { IconButton } from "@chakra-ui/react";
import { VscInspect } from "react-icons/vsc";

interface ButtonInspectProps {
  isActive: boolean;
  onClickInspect: () => void;
}

const ButtonInspect = ({ isActive, onClickInspect }: ButtonInspectProps) => {
  return (
    <IconButton
      variant={isActive ? "solid" : "ghost"}
      aria-label="Inspect"
      colorPalette={isActive ? "teal" : undefined}
      onClick={onClickInspect}
    >
      <VscInspect />
    </IconButton>
  );
};

export { ButtonInspect };
