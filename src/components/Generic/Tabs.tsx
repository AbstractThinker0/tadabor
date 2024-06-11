interface TabNavbarProps {
  extraClass?: string;
  children?: React.ReactNode | undefined;
}

const TabNavbar = ({ children, extraClass = "" }: TabNavbarProps) => {
  return (
    <ul
      className={"nav nav-tabs ".concat(extraClass)}
      id="myTab"
      role="tablist"
    >
      {children}
    </ul>
  );
};

interface TabButtonProps {
  text: string;
  identifier: string;
  extraClass?: string;
  ariaSelected?: boolean;
  handleClickTab?: () => void;
  refButton?: React.RefObject<HTMLButtonElement>;
}

const TabButton = ({
  text,
  identifier,
  extraClass = "",
  ariaSelected,
  handleClickTab,
  refButton,
}: TabButtonProps) => {
  const onClickTab = () => {
    if (handleClickTab) handleClickTab();
  };

  return (
    <li className="nav-item" role="presentation">
      <button
        className={"nav-link ".concat(extraClass)}
        id={`${identifier}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#${identifier}-tab-pane`}
        type="button"
        role="tab"
        aria-controls={`${identifier}-tab-pane`}
        aria-selected={ariaSelected}
        onClick={onClickTab}
        ref={refButton}
      >
        {text}
      </button>
    </li>
  );
};

interface TabPanelProps {
  identifier: string;
  extraClass?: string;
  children?: React.ReactNode | undefined;
}

const TabPanel = ({ identifier, extraClass = "", children }: TabPanelProps) => {
  return (
    <div
      className={"tab-pane fade ".concat(extraClass)}
      id={`${identifier}-tab-pane`}
      role="tabpanel"
      aria-labelledby={`${identifier}-tab`}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

interface TabContentProps {
  children?: React.ReactNode | undefined;
}

const TabContent = ({ children }: TabContentProps) => {
  return (
    <div className="tab-content" id="myTabContent">
      {children}
    </div>
  );
};

export { TabNavbar, TabButton, TabContent, TabPanel };
