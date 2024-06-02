import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import {
  isRootNotesLoading,
  isVerseNotesLoading,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import { fetchRootNotes } from "@/store/slices/global/rootNotes";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { rbPageActions } from "@/store/slices/pages/rootsBrowser";

import SearchForm from "@/components/Pages/RootsBrowser/SearchForm";
import RootsList from "@/components/Pages/RootsBrowser/RootsList";

import { rootProps } from "@/types";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { TabButton, TabPanel } from "@/components/Generic/Tabs";
import QuranTab from "@/components/Custom/QuranTab";

import "@/styles/pages/roots.scss";

const RootsBrowser = () => {
  const refVerseButton = useRef<HTMLButtonElement>(null);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showQuranTab, verseTab, scrollKey } = useAppSelector(
    (state) => state.rbPage
  );

  const handleVerseTab = (verseKey: string) => {
    dispatch(rbPageActions.setVerseTab(verseKey));
    dispatch(rbPageActions.setScrollKey(verseKey));
  };

  const handleClickTab = () => {
    dispatch(rbPageActions.setShowQuranTab(false));
    dispatch(rbPageActions.setScrollKey(""));
  };

  const handleClickQuranTab = () => {
    dispatch(rbPageActions.setShowQuranTab(true));
  };

  useEffect(() => {
    if (!showQuranTab) return;

    if (!verseTab) return;

    if (!refVerseButton.current) return;

    if (refVerseButton.current.classList.contains("show")) return;

    refVerseButton.current.click();
  }, [verseTab, showQuranTab]);

  return (
    <div className="roots">
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
      <TabContent
        verseTab={verseTab}
        scrollKey={scrollKey}
        handleVerseTab={handleVerseTab}
      />
    </div>
  );
};

interface TabContentProps {
  verseTab: string;
  scrollKey: string;
  handleVerseTab: (verseKey: string) => void;
}

const TabContent = ({
  verseTab,
  handleVerseTab,
  scrollKey,
}: TabContentProps) => {
  const dispatch = useAppDispatch();

  const setScrollKey = (key: string) => {
    dispatch(rbPageActions.setScrollKey(key));
  };

  return (
    <div className="tab-content" id="myTabContent">
      <TabPanel identifier="search" extraClass="show active">
        <RootsPanel handleVerseTab={handleVerseTab} />
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

interface RootsPanelProps {
  handleVerseTab: (verseKey: string) => void;
}

const RootsPanel = ({ handleVerseTab }: RootsPanelProps) => {
  const dispatch = useAppDispatch();
  const isRNotesLoading = useAppSelector(isRootNotesLoading());
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  const { searchString, searchInclusive } = useAppSelector(
    (state) => state.rbPage
  );

  const [stateRoots, setStateRoots] = useState<rootProps[]>([]);

  useEffect(() => {
    dispatch(fetchRootNotes());
    dispatch(fetchVerseNotes());
  }, []);

  const handleRoots = (roots: rootProps[]) => {
    setStateRoots(roots);
  };

  return (
    <div className="roots-panel">
      <SearchForm
        searchString={searchString}
        searchInclusive={searchInclusive}
        stateRoots={stateRoots}
      />

      {isRNotesLoading || isVNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <RootsList
          searchString={searchString}
          searchInclusive={searchInclusive}
          handleVerseTab={handleVerseTab}
          stateRoots={stateRoots}
          handleRoots={handleRoots}
        />
      )}
    </div>
  );
};

export default RootsBrowser;
