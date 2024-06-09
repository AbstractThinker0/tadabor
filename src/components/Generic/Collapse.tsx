interface CollpaseContentProps {
  identifier: string;
  children?: React.ReactNode | undefined;
  extraClass?: string;
  refCollapse?: React.RefObject<HTMLDivElement>;
}

const CollpaseContent = ({
  children,
  identifier,
  extraClass = "",
  refCollapse,
}: CollpaseContentProps) => {
  return (
    <div className={`collapse ${extraClass}`} id={identifier} ref={refCollapse}>
      {children}
    </div>
  );
};

export { CollpaseContent };
