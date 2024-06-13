interface CollapseContentProps {
  identifier: string;
  children?: React.ReactNode | undefined;
  extraClass?: string;
  refCollapse?: React.RefObject<HTMLDivElement>;
}

const CollapseContent = ({
  children,
  identifier,
  extraClass = "",
  refCollapse,
}: CollapseContentProps) => {
  return (
    <div className={`collapse ${extraClass}`} id={identifier} ref={refCollapse}>
      {children}
    </div>
  );
};

export { CollapseContent };
