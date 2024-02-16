import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";
import { useAppSelector } from "@/store";

import { TabButton, TabPanel } from "@/components/Generic/Tabs";
import { ExpandButton } from "@/components/Generic/Buttons";

import NoteText from "@/components/Custom/NoteText";

import SearcherDisplay from "@/components/Searcher/SearcherDisplay";
import SearcherSide from "@/components/Searcher/SearcherSide";
import { verseProps } from "@/types";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

const Searcher = () => {
  const { t } = useTranslation();

  const refVerseButton = useRef<HTMLButtonElement>(null);
  const { verse_tab } = useAppSelector((state) => state.searcherPage);

  useEffect(() => {
    //
    if (!verse_tab) return;

    if (!refVerseButton.current) return;

    refVerseButton.current.click();
  }, [verse_tab]);

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
        {verse_tab ? <QuranTab verseKey={verse_tab} /> : ""}
      </div>
    </div>
  );
};

interface QuranTabProps {
  verseKey: string;
}

const QuranTab = ({ verseKey }: QuranTabProps) => {
  const quranService = useQuran();
  const verseInfo = verseKey.split("-");

  const chapterName = quranService.getChapterName(verseInfo[0]);
  const refListVerses = useRef<HTMLDivElement>(null);
  const [highlightedKey, setHighlightedKey] = useState("");
  const [isPending, startTransition] = useTransition();
  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  useEffect(() => {
    startTransition(() => {
      setStateVerses(quranService.getVerses(verseInfo[0]));
    });
  }, [verseKey]);

  useEffect(() => {
    if (!refListVerses.current) return;

    const verseToHighlight = refListVerses.current.querySelector(
      `[data-id="${verseKey}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setHighlightedKey(verseKey);
  }, [verseKey, isPending]);

  const onClickVerseSuffix = (key: string) => {
    if (highlightedKey === key) {
      setHighlightedKey("");
    } else {
      setHighlightedKey(key);
    }
  };

  return (
    <TabPanel identifier={"verse"}>
      <div className="searcher-chapter" ref={refListVerses}>
        <div className="text-center fs-3 text-primary">سورة {chapterName}</div>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          stateVerses.map((verse) => (
            <div
              key={verse.key}
              className={`searcher-chapter-verse ${
                highlightedKey === verse.key
                  ? "searcher-chapter-verse-highlight"
                  : ""
              }`}
              data-id={verse.key}
            >
              <div>
                {verse.versetext}{" "}
                <span
                  className="searcher-chapter-verse-suffix"
                  onClick={() => onClickVerseSuffix(verse.key)}
                >
                  ({verse.verseid})
                </span>{" "}
                <ExpandButton identifier={verse.key} />
              </div>
              <NoteText verseKey={verse.key} />
            </div>
          ))
        )}
      </div>
    </TabPanel>
  );
};

export default Searcher;
