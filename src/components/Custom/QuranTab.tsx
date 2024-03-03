import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { verseProps } from "@/types";

import { TabPanel } from "@/components/Generic/Tabs";
import { ExpandButton } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import NoteText from "@/components/Custom/NoteText";

interface QuranTabProps {
  verseKey: string;
  dummyProp?: number;
}

const QuranTab = ({ verseKey, dummyProp }: QuranTabProps) => {
  const quranService = useQuran();
  const verseInfo = verseKey.split("-");

  const chapterName = quranService.getChapterName(verseInfo[0]);
  const refListVerses = useRef<HTMLDivElement>(null);
  const [highlightedKey, setHighlightedKey] = useState(verseKey);
  const [isPending, startTransition] = useTransition();
  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  useEffect(() => {
    startTransition(() => {
      setStateVerses(quranService.getVerses(verseInfo[0]));
    });
  }, [verseKey, dummyProp]);

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
      <div className="searcher-chapter" ref={refListVerses} dir="rtl">
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

export default QuranTab;
