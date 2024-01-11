import { useTranslation } from "react-i18next";

import RootNotes from "@/components/YourNotes/RootNotes";
import VerseNotes from "@/components/YourNotes/VerseNotes";
import TransNotes from "@/components/YourNotes/TransNotes";

function YourNotes() {
  const { t } = useTranslation();

  return (
    <div className="yournotes">
      <ul
        className="nav nav-tabs justify-content-center"
        id="myTab"
        role="tablist"
      >
        <TabButton
          text={t("notes_verses")}
          identifier="verses"
          extraClass="active"
          ariaSelected={true}
        />
        <TabButton text={t("notes_roots")} identifier="roots" />
        <TabButton text={t("notes_trans")} identifier="trans" />
      </ul>
      <div className="tab-content" id="myTabContent">
        <TabPanel identifier="verses" extraClass="show active">
          <VerseNotes />
        </TabPanel>
        <TabPanel identifier="roots">
          <RootNotes />
        </TabPanel>
        <TabPanel identifier="trans">
          <TransNotes />
        </TabPanel>
      </div>
    </div>
  );
}

interface TabButtonProps {
  text: string;
  identifier: string;
  extraClass?: string;
  ariaSelected?: boolean;
}

const TabButton = ({
  text,
  identifier,
  extraClass = "",
  ariaSelected,
}: TabButtonProps) => {
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

export default YourNotes;
