import { useEffect, useRef, useState, useTransition } from "react";

import useQuran from "@/context/useQuran";

import { isVerseNotesLoading, useAppSelector } from "@/store";

import { verseProps } from "@/types";

import { TabPanel } from "@/components/Generic/Tabs";
import { ExpandButton } from "@/components/Generic/Buttons";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import NoteText from "@/components/Custom/NoteText";
import VerseContainer from "@/components/Custom/VerseContainer";

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
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());

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
      <div className="qtab-chapter" ref={refListVerses} dir="rtl">
        <div className="text-center fs-3 text-primary">سورة {chapterName}</div>
        {isPending || isVNotesLoading ? (
          <LoadingSpinner />
        ) : (
          stateVerses.map((verse) => (
            <div
              key={verse.key}
              className={`qtab-chapter-verse ${
                highlightedKey === verse.key
                  ? "qtab-chapter-verse-highlight"
                  : ""
              }`}
              data-id={verse.key}
            >
              <VerseContainer>
                {verse.versetext}{" "}
                <span
                  className="qtab-chapter-verse-suffix"
                  onClick={() => onClickVerseSuffix(verse.key)}
                >
                  ({verse.verseid})
                </span>{" "}
                <ExpandButton identifier={verse.key} />
              </VerseContainer>
              <NoteText verseKey={verse.key} />
            </div>
          ))
        )}
      </div>
    </TabPanel>
  );
};

export default QuranTab;
