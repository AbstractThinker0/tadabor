import { CSSProperties } from "react";
import { IconSearch, IconSelect } from "./Icons";

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

interface SearchButtonProps {
  description: string;
}

const SearchButton = ({ description }: SearchButtonProps) => {
  return (
    <button className="btn btn-outline-success w-50 fw-bold" type="submit">
      <IconSearch size={15} stroke={3} /> {description}
    </button>
  );
};

export { ExpandButton, SearchButton };
