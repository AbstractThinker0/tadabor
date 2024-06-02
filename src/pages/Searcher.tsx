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
  const { verseTab, showQuranTab, scrollKey } = useAppSelector(
    (state) => state.searcherPage
  );

  useEffect(() => {
    if (!showQuranTab) return;

    if (!verseTab) return;

    if (!refVerseButton.current) return;

    if (refVerseButton.current.classList.contains("show")) return;

    refVerseButton.current.click();
  }, [verseTab, showQuranTab]);

  useEffect(() => {
    dispatch(fetchVerseNotes());
  }, []);

  const handleClickTab = () => {
    dispatch(searcherPageActions.setShowQuranTab(false));
    dispatch(searcherPageActions.setScrollKey(""));
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
        {verseTab && (
          <TabButton
            text={verseTab}
            identifier="verse"
            refButton={refVerseButton}
            handleClickTab={handleClickQuranTab}
          />
        )}
      </ul>
      <TabContent verseTab={verseTab} scrollKey={scrollKey} />
    </div>
  );
};

interface TabContentProps {
  verseTab: string;
  scrollKey: string;
}

const TabContent = ({ verseTab, scrollKey }: TabContentProps) => {
  const dispatch = useAppDispatch();

  const setScrollKey = (key: string) => {
    dispatch(searcherPageActions.setScrollKey(key));
  };

  return (
    <div className="tab-content" id="myTabContent">
      <TabPanel identifier="search" extraClass="show active">
        <div className="searcher-search">
          <SearcherSide />
          <SearcherDisplay />
        </div>
      </TabPanel>
      {verseTab ? (
        <QuranTab
          verseKey={verseTab}
          scrollKey={scrollKey}
          setScrollKey={setScrollKey}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Searcher;
