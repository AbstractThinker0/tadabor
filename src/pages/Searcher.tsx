import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store";

import { TabButton, TabPanel } from "@/components/Generic/Tabs";

import QuranTab from "@/components/Custom/QuranTab";

import SearcherDisplay from "@/components/Searcher/SearcherDisplay";
import SearcherSide from "@/components/Searcher/SearcherSide";

const Searcher = () => {
  const { t } = useTranslation();

  const refVerseButton = useRef<HTMLButtonElement>(null);
  const { verse_tab, press_dummy } = useAppSelector(
    (state) => state.searcherPage
  );

  useEffect(() => {
    if (!verse_tab) return;

    if (!refVerseButton.current) return;

    refVerseButton.current.click();
  }, [verse_tab, press_dummy]);

  return (
    <div className="searcher">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <TabButton
          text={t("searcher_search")}
          identifier="search"
          extraClass="active"
          ariaSelected={true}
        />
        {verse_tab && (
          <li className="nav-item" role="presentation">
            <button
              className="nav-link "
              id={`verse-tab`}
              data-bs-toggle="tab"
              data-bs-target={`#verse-tab-pane`}
              type="button"
              role="tab"
              aria-controls={`verse-tab-pane`}
              ref={refVerseButton}
            >
              {verse_tab}
            </button>
          </li>
        )}
      </ul>
      <div className="tab-content" id="myTabContent">
        <TabPanel identifier="search" extraClass="show active">
          <div className="searcher-search">
            <SearcherSide />
            <SearcherDisplay />
          </div>
        </TabPanel>
        {verse_tab ? (
          <QuranTab verseKey={verse_tab} dummyProp={press_dummy} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Searcher;
