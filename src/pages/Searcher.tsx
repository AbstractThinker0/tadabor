import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { searcherPageActions } from "@/store/slices/pages/searcher";

import { TabButton, TabPanel } from "@/components/Generic/Tabs";

import QuranTab from "@/components/Custom/QuranTab";

import SearcherDisplay from "@/components/Pages/Searcher/SearcherDisplay";
import SearcherSide from "@/components/Pages/Searcher/SearcherSide";

import "@/styles/pages/searcher.scss";

const Searcher = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const refVerseButton = useRef<HTMLButtonElement>(null);
  const { verse_tab, showQuranTab } = useAppSelector(
    (state) => state.searcherPage
  );

  useEffect(() => {
    if (!showQuranTab) return;

    if (!verse_tab) return;

    if (!refVerseButton.current) return;

    if (refVerseButton.current.classList.contains("show")) return;

    refVerseButton.current.click();
  }, [verse_tab, showQuranTab]);

  useEffect(() => {
    dispatch(fetchVerseNotes());
  }, []);

  const handleClickTab = () => {
    dispatch(searcherPageActions.setShowQuranTab(false));
  };

  const handleClickQuranTab = () => {
    dispatch(searcherPageActions.setShowQuranTab(true));
  };

  return (
    <div className="searcher">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <TabButton
          text={t("searcher_search")}
          identifier="search"
          extraClass="active"
          ariaSelected={true}
          handleClickTab={handleClickTab}
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
              onClick={handleClickQuranTab}
            >
              {verse_tab}
            </button>
          </li>
        )}
      </ul>
      <TabContent verse_tab={verse_tab} />
    </div>
  );
};

interface TabContentProps {
  verse_tab: string;
}

const TabContent = ({ verse_tab }: TabContentProps) => {
  return (
    <div className="tab-content" id="myTabContent">
      <TabPanel identifier="search" extraClass="show active">
        <div className="searcher-search">
          <SearcherSide />
          <SearcherDisplay />
        </div>
      </TabPanel>
      {verse_tab ? <QuranTab verseKey={verse_tab} /> : ""}
    </div>
  );
};

export default Searcher;
