import { memo } from "react";

import { IconTextDirectionLtr, IconTextDirectionRtl } from "./Icons";

interface TextareaToolbarProps {
  inputKey: string;
  handleSetDirection: (key: string, direction: string) => void;
}

const TextareaToolbar = memo(
  ({ inputKey, handleSetDirection }: TextareaToolbarProps) => {
    return (
      <div dir="ltr" className="text-center">
        <ToolbarOption handleClick={() => handleSetDirection(inputKey, "ltr")}>
          <IconTextDirectionLtr />
        </ToolbarOption>
        <ToolbarOption handleClick={() => handleSetDirection(inputKey, "rtl")}>
          <IconTextDirectionRtl />
        </ToolbarOption>
      </div>
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
    <button type="button" className="btn btn-sm" onClick={onClickButton}>
      {children}
    </button>
  );
}

export default TextareaToolbar;
