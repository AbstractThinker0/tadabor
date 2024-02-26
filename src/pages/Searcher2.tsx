import { Fragment, useState, useTransition } from "react";

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

  const searchStringHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
    startTransition(() => {
      const getSearchResult = () => {
        const matchVerses: verseMatchResult[] = [];

        const quranText = quranService.absoluteQuran;

        for (const verse of quranText) {
          const result = searchVerse(verse, event.target.value, false, false);

          if (result) {
            matchVerses.push(result);
          }
        }

        return matchVerses;
      };

      setStateVerses(getSearchResult());
    });
  };

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Reached the bottom, ( the +10 is needed since the scrollHeight - scrollTop doesn't seem to go to the very bottom for some reason )
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setItemsCount((state) => state + 15);
    }
  }

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
      </div>
      <div className="searcher2-list " dir="rtl" onScroll={handleScroll}>
        {isPending ? (
          <LoadingSpinner />
        ) : (
          stateVerses.slice(0, itemsCount).map((verseMatch) => (
            <div
              className="searcher2-list-verse border-bottom"
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
