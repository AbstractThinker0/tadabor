import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import {
  isRootNotesLoading,
  isVerseNotesLoading,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import { fetchRootNotes } from "@/store/slices/rootNotes";
import { fetchVerseNotes } from "@/store/slices/verseNotes";

import SearchForm from "@/components/RootsBrowser/SearchForm";
import RootsList from "@/components/RootsBrowser/RootsList";

import { rootProps } from "@/types";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { TabButton, TabPanel } from "@/components/Generic/Tabs";
import QuranTab from "@/components/Custom/QuranTab";

const RootsBrowser = () => {
  const refVerseButton = useRef<HTMLButtonElement>(null);

  const { t } = useTranslation();
  const [verseTab, setVerseTab] = useState("");
  const [dummyCounter, setDummyCounter] = useState(0);

  const handleVerseTab = (verseKey: string) => {
    setVerseTab(verseKey);
    setDummyCounter((prev) => prev + 1);
  };

  useEffect(() => {
    //
    if (!verseTab) return;

    if (!refVerseButton.current) return;

    refVerseButton.current.click();
  }, [verseTab, dummyCounter]);

  return (
    <div className="roots">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <TabButton
          text={t("searcher_search")}
          identifier="search"
          extraClass="active"
          ariaSelected={true}
        />
        {verseTab && (
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
              {verseTab}
            </button>
          </li>
        )}
      </ul>
      <TabContent
        verse_tab={verseTab}
        press_dummy={dummyCounter}
        handleVerseTab={handleVerseTab}
      />
    </div>
  );
};

interface TabContentProps {
  verse_tab: string;
  press_dummy: number;
  handleVerseTab: (verseKey: string) => void;
}

const TabContent = ({
  verse_tab,
  press_dummy,
  handleVerseTab,
}: TabContentProps) => {
  return (
    <div className="tab-content" id="myTabContent">
      <TabPanel identifier="search" extraClass="show active">
        <RootsPanel handleVerseTab={handleVerseTab} />
      </TabPanel>
      {verse_tab ? (
        <QuranTab verseKey={verse_tab} dummyProp={press_dummy} />
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

  const [searchString, setSearchString] = useState("");
  const [searchInclusive, setSearchInclusive] = useState(false);
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
        setSearchString={setSearchString}
        setSearchInclusive={setSearchInclusive}
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
