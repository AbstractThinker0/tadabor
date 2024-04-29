import { useEffect, useState, useTransition, useRef } from "react";
import { useTranslation } from "react-i18next";

import { isVerseNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/verseNotes";

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

import { TabButton, TabPanel } from "@/components/Generic/Tabs";
import { ExpandButton } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import VerseHighlightMatches from "@/components/Generic/VerseHighlightMatches";

const Searcher2 = () => {
  const refVerseButton = useRef<HTMLButtonElement>(null);

  const { t } = useTranslation();
  const [verseTab, setVerseTab] = useState("");
  const [dummyCounter, setDummyCounter] = useState(0);
  const dispatch = useAppDispatch();
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

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

  useEffect(() => {
    dispatch(fetchVerseNotes());
  }, []);

  return (
    <div className="searcher2">
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
      {isVNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <TabContent
          verseTab={verseTab}
          dummyCounter={dummyCounter}
          handleVerseTab={handleVerseTab}
        />
      )}
    </div>
  );
};

interface TabContentProps {
  verseTab: string;
  dummyCounter: number;
  handleVerseTab: (verseKey: string) => void;
}

const TabContent = ({
  verseTab,
  dummyCounter,
  handleVerseTab,
}: TabContentProps) => {
  return (
    <div className="tab-content" id="myTabContent">
      <TabPanel identifier="search" extraClass="show active">
        <Searcher2Tab handleVerseTab={handleVerseTab} />
      </TabPanel>
      {verseTab ? (
        <QuranTab verseKey={verseTab} dummyProp={dummyCounter} />
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
  const [searchString, setSearchString] = useState("");
  const [isPending, startTransition] = useTransition();
  const [stateVerses, setStateVerses] = useState<verseMatchResult[]>([]);
  const [itemsCount, setItemsCount] = useState(80);
  const [searchIdentical, setSearchIdentical] = useState(false);
  const [searchDiacritics, setSearchDiacritics] = useState(false);
  const { i18n, t } = useTranslation();

  const searchStringHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setItemsCount((state) => state + 15);
    }
  }

  const onChangeSearchIdentical = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchIdentical(event.target.checked);
  };

  const onChangeSearchDiacritics = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchDiacritics(event.target.checked);
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
            searchDiacritics
          );

          if (result) {
            matchVerses.push(result);
          }
        }

        return matchVerses;
      };

      setStateVerses(getSearchResult());
    });
  }, [searchString, searchIdentical, searchDiacritics]);

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
          <div
            className={`form-check   ${
              i18n.resolvedLanguage === "ar" && "form-check-reverse"
            }`}
          >
            <input
              className="form-check-input"
              type="checkbox"
              checked={searchIdentical}
              onChange={onChangeSearchIdentical}
              value=""
              id="CheckIdentical"
            />
            <label className="form-check-label" htmlFor="CheckIdentical">
              {t("search_identical")}
            </label>
          </div>
          <div
            className={`form-check   ${
              i18n.resolvedLanguage === "ar" && "form-check-reverse"
            }`}
          >
            <input
              className="form-check-input"
              type="checkbox"
              checked={searchDiacritics}
              onChange={onChangeSearchDiacritics}
              value=""
              id="CheckDiacritics"
            />
            <label className="form-check-label" htmlFor="CheckDiacritics">
              {t("search_diacritics")}
            </label>
          </div>
        </div>
      </div>
      <div className="searcher2-searchpanel-display">
        <div
          className="searcher2-searchpanel-display-list "
          dir="rtl"
          onScroll={handleScroll}
        >
          {isPending ? (
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
