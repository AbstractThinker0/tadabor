import { CSSProperties } from "react";
import { IconSelect } from "./Icons";

interface ExpandButtonProps {
  identifier: string;
  extraClass?: string | undefined;
  value?: string | number | undefined;
  style?: CSSProperties | undefined;
}

const ExpandButton = ({
  identifier,
  extraClass = "",
  value,
  style,
}: ExpandButtonProps) => {
  return (
    <button
      className={"btn ".concat(extraClass)}
      type="button"
      data-bs-toggle="collapse"
      data-bs-target={`#collapseExample${identifier}`}
      aria-expanded="false"
      aria-controls={`collapseExample${identifier}`}
      style={style}
      value={value}
    >
      <IconSelect />
    </button>
  );
};

export { ExpandButton };
