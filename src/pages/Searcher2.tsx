import { useEffect, useState, useTransition, useRef } from "react";
import { useTranslation } from "react-i18next";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { searcher2PageActions } from "@/store/slices/pages/searcher2";

import useQuran from "@/context/useQuran";
import { verseMatchResult } from "@/types";
import { quranSearcher } from "@/util/quranSearch";

import NoteText from "@/components/Custom/NoteText";
import QuranTab from "@/components/Custom/QuranTab";
import VerseContainer from "@/components/Custom/VerseContainer";
import Checkbox from "@/components/Custom/Checkbox";

import {
  TabButton,
  TabContent,
  TabNavbar,
  TabPanel,
} from "@/components/Generic/Tabs";
import { ExpandButton } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import "@/styles/pages/searcher2.scss";

const Searcher2 = () => {
  const refVerseButton = useRef<HTMLButtonElement>(null);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const verseTab = useAppSelector((state) => state.searcher2Page.verseTab);

  const showQuranTab = useAppSelector(
    (state) => state.searcher2Page.showQuranTab
  );

  const scrollKey = useAppSelector((state) => state.searcher2Page.scrollKey);

  useEffect(() => {
    //
    if (!showQuranTab) return;

    if (!verseTab) return;

    if (!refVerseButton.current) return;

    if (refVerseButton.current.classList.contains("show")) return;

    refVerseButton.current.click();
  }, [verseTab, showQuranTab]);

  useEffect(() => {
    dispatch(fetchVerseNotes());
  }, []);

  const handleVerseTab = (verseKey: string) => {
    dispatch(searcher2PageActions.setVerseTab(verseKey));
    dispatch(searcher2PageActions.setScrollKey(verseKey));
  };

  const handleClickTab = () => {
    dispatch(searcher2PageActions.setShowQuranTab(false));
    dispatch(searcher2PageActions.setScrollKey(""));
  };

  const handleClickQuranTab = () => {
    dispatch(searcher2PageActions.setShowQuranTab(true));
  };

  const setScrollKey = (key: string) => {
    dispatch(searcher2PageActions.setScrollKey(key));
  };

  return (
    <div className="searcher2">
      <TabNavbar>
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
      </TabNavbar>
      <TabContent>
        <TabPanel identifier="search" extraClass="show active">
          <Searcher2Tab handleVerseTab={handleVerseTab} />
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
      </TabContent>
    </div>
  );
};

interface Searcher2TabProps {
  handleVerseTab: (verseKey: string) => void;
}

const Searcher2Tab = ({ handleVerseTab }: Searcher2TabProps) => {
  const quranService = useQuran();

  const [isPending, startTransition] = useTransition();
  const [stateVerses, setStateVerses] = useState<verseMatchResult[]>([]);
  const [itemsCount, setItemsCount] = useState(80);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const searchString = useAppSelector(
    (state) => state.searcher2Page.searchString
  );

  const searchIdentical = useAppSelector(
    (state) => state.searcher2Page.searchIdentical
  );

  const searchDiacritics = useAppSelector(
    (state) => state.searcher2Page.searchDiacritics
  );

  const searchStart = useAppSelector(
    (state) => state.searcher2Page.searchStart
  );

  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

  const searchStringHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(searcher2PageActions.setSearchString(event.target.value));
  };

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setItemsCount((state) => state + 15);
    }
  }

  const handleCheckboxDiacritics = (status: boolean) => {
    dispatch(searcher2PageActions.setSearchDiacritics(status));
  };

  const handleCheckboxIdentical = (status: boolean) => {
    dispatch(searcher2PageActions.setSearchIdentical(status));
  };

  const handleCheckboxStart = (status: boolean) => {
    dispatch(searcher2PageActions.setSearchStart(status));
  };

  useEffect(() => {
    startTransition(() => {
      const result = quranSearcher.byWord(searchString, quranService, "all", {
        searchDiacritics,
        searchIdentical,
        searchStart,
      });

      setStateVerses(result || []);
    });
  }, [searchString, searchIdentical, searchDiacritics, searchStart]);

  const onClickVerse = (verseKey: string) => {
    handleVerseTab(verseKey);
  };

  return (
    <div className="searcher2-searchpanel">
      <div className="d-flex align-items-center flex-column">
        <div className="d-flex gap-1 align-items-center">
          <input
            className="searcher2-searchpanel-input form-control"
            type="search"
            placeholder=""
            value={searchString}
            aria-label="Search"
            onChange={searchStringHandle}
            required
            dir="rtl"
          />
          <span>({stateVerses.length})</span>
        </div>
        <div className="d-flex gap-1">
          <span className="fw-bold">{t("search_options")}</span>
          <Checkbox
            checkboxState={searchDiacritics}
            handleChangeCheckbox={handleCheckboxDiacritics}
            labelText={t("search_diacritics")}
            inputID="CheckDiacritics"
          />
          <Checkbox
            checkboxState={searchIdentical}
            handleChangeCheckbox={handleCheckboxIdentical}
            labelText={t("search_identical")}
            inputID="CheckIdentical"
          />
          <Checkbox
            checkboxState={searchStart}
            handleChangeCheckbox={handleCheckboxStart}
            labelText={t("search_start")}
            inputID="CheckStart"
          />
        </div>
      </div>
      <div className="searcher2-searchpanel-display">
        <div
          className="searcher2-searchpanel-display-list"
          dir="rtl"
          onScroll={handleScroll}
        >
          {isPending || isVNotesLoading ? (
            <LoadingSpinner />
          ) : (
            stateVerses.slice(0, itemsCount).map((verseMatch) => (
              <div
                className="searcher2-searchpanel-display-list-verse border-bottom"
                key={verseMatch.key}
              >
                <VerseContainer>
                  <VerseHighlightMatches verse={verseMatch} />
                  <span
                    className="searcher2-searchpanel-display-list-verse-suffix"
                    onClick={() => onClickVerse(verseMatch.key)}
                  >{` (${quranService.getChapterName(verseMatch.suraid)}:${
                    verseMatch.verseid
                  })`}</span>
                  <ExpandButton identifier={verseMatch.key} />
                </VerseContainer>
                <NoteText verseKey={verseMatch.key} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Searcher2;
