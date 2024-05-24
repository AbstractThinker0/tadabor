import { useTranslation } from "react-i18next";

import { TabButton, TabPanel } from "@/components/Generic/Tabs";

import RootNotes from "@/components/Pages/YourNotes/RootNotes";
import VerseNotes from "@/components/Pages/YourNotes/VerseNotes";
import TransNotes from "@/components/Pages/YourNotes/TransNotes";

import "@/styles/pages/yournotes.scss";

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

export default YourNotes;
