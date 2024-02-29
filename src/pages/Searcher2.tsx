import { Fragment, useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import useQuran from "@/context/useQuran";
import { verseMatchResult } from "@/types";
import { searchVerse } from "@/util/util";

import NoteText from "@/components/Custom/NoteText";

import { ExpandButton } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

const Searcher2 = () => {
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

        for (const verse of quranText) {
          const result = searchVerse(
            verse,
            searchString,
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

  return (
    <div className="searcher2">
      <div className="d-flex align-items-center flex-column">
        <div>
          <input
            className="form-control"
            type="search"
            placeholder=""
            value={searchString}
            aria-label="Search"
            onChange={searchStringHandle}
            required
            dir="rtl"
          />
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
      <div className="searcher2-display">
        <div
          className="searcher2-display-list "
          dir="rtl"
          onScroll={handleScroll}
        >
          {isPending ? (
            <LoadingSpinner />
          ) : (
            stateVerses.slice(0, itemsCount).map((verseMatch) => (
              <div
                className="searcher2-display-list-verse border-bottom"
                key={verseMatch.key}
              >
                <div>
                  <HighlightedText verse={verseMatch} />
                  <span>{` (${quranService.getChapterName(verseMatch.suraid)}:${
                    verseMatch.verseid
                  })`}</span>
                  <ExpandButton identifier={verseMatch.key} />
                </div>
                <NoteText verseKey={verseMatch.key} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface HighlightedTextProps {
  verse: verseMatchResult;
}

const HighlightedText = ({ verse }: HighlightedTextProps) => {
  const verseParts = verse.verseParts;

  return (
    <>
      {verseParts.map((part, i) => {
        const isHighlighted = part.isMatch;

        return (
          <Fragment key={i}>
            {isHighlighted ? <mark>{part.text}</mark> : part.text}
          </Fragment>
        );
      })}
    </>
  );
};

export default Searcher2;
