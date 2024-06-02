import { useEffect, useState, useTransition, useRef } from "react";
import { useTranslation } from "react-i18next";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { searcher2PageActions } from "@/store/slices/pages/searcher2";

import useQuran from "@/context/useQuran";
import { verseMatchResult } from "@/types";
import {
  searchVerse,
  onlySpaces,
  removeDiacritics,
  normalizeAlif,
} from "@/util/util";

import NoteText from "@/components/Custom/NoteText";
import QuranTab from "@/components/Custom/QuranTab";
import VerseContainer from "@/components/Custom/VerseContainer";
import Checkbox from "@/components/Custom/Checkbox";

import { TabButton, TabPanel } from "@/components/Generic/Tabs";
import { ExpandButton } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

import "@/styles/pages/searcher2.scss";

const Searcher2 = () => {
  const refVerseButton = useRef<HTMLButtonElement>(null);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const { verseTab, showQuranTab, scrollKey } = useAppSelector(
    (state) => state.searcher2Page
  );

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

  return (
    <div className="searcher2">
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
  scrollKey,
  handleVerseTab,
}: TabContentProps) => {
  const dispatch = useAppDispatch();

  const setScrollKey = (key: string) => {
    dispatch(searcher2PageActions.setScrollKey(key));
  };

  return (
    <div className="tab-content" id="myTabContent">
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

  const { searchString, searchIdentical, searchDiacritics, searchStart } =
    useAppSelector((state) => state.searcher2Page);

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
    dispatch(searcher2PageActions.setSearchStart(false));
  };

  const handleCheckboxStart = (status: boolean) => {
    dispatch(searcher2PageActions.setSearchStart(status));
    dispatch(searcher2PageActions.setSearchIdentical(false));
  };

  useEffect(() => {
    startTransition(() => {
      const getSearchResult = () => {
        const matchVerses: verseMatchResult[] = [];

        const quranText = quranService.absoluteQuran;

        // Check if we search with diacritics or they should be stripped off
        const normalizedToken = searchDiacritics
          ? searchString
          : normalizeAlif(removeDiacritics(searchString));

        // If an empty search token don't initiate a search
        if (onlySpaces(normalizedToken)) {
          return matchVerses;
        }

        for (const verse of quranText) {
          const result = searchVerse(
            verse,
            normalizedToken,
            searchIdentical,
            searchDiacritics,
            searchStart
          );

          if (result) {
            matchVerses.push(result);
          }
        }

        return matchVerses;
      };

      setStateVerses(getSearchResult());
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
