import { useTranslation } from "react-i18next";

import { TabButton, TabPanel } from "@/components/Generic/Tabs";

import SearcherDisplay from "@/components/Searcher/SearcherDisplay";
import SearcherSide from "@/components/Searcher/SearcherSide";

const Searcher = () => {
  const { t } = useTranslation();

  return (
    <div className="searcher">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <TabButton
          text={t("searcher_search")}
          identifier="search"
          extraClass="active"
          ariaSelected={true}
        />
      </ul>
      <div className="tab-content" id="myTabContent">
        <TabPanel identifier="search" extraClass="show active">
          <div className="searcher-search">
            <SearcherSide />
            <SearcherDisplay />
          </div>
        </TabPanel>
      </div>
    </div>
  );
};

export default Searcher;
