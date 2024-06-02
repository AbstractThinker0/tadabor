import { useRef, useState, useTransition, useEffect } from "react";

import useQuran from "@/context/useQuran";

import { useAppDispatch, useAppSelector } from "@/store";
import { translationPageActions } from "@/store/slices/pages/translation";

import { verseProps } from "@/types";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VerseContainer from "@/components/Custom/VerseContainer";

import TransComponent from "@/components/Pages/Translation/TransComponent";

interface DisplayPanelProps {
  selectChapter: number;
}

const DisplayPanel = ({ selectChapter }: DisplayPanelProps) => {
  const quranService = useQuran();

  const dispatch = useAppDispatch();
  const { scrollKey } = useAppSelector((state) => state.translationPage);

  const refDisplay = useRef<HTMLDivElement>(null);
  const refListVerses = useRef<HTMLDivElement>(null);

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!refDisplay.current) return;

    startTransition(() => {
      setStateVerses(quranService.getVerses(selectChapter));
    });

    refDisplay.current.scrollTop = 0;
  }, [selectChapter]);

  useEffect(() => {
    if (!scrollKey) return;

    if (!refListVerses.current) return;

    const verseToHighlight = refListVerses.current.querySelector(
      `[data-id="${scrollKey}"]`
    );

    if (!verseToHighlight) return;

    verseToHighlight.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [scrollKey, isPending]);

  const onClickVerse = (verseKey: string) => {
    dispatch(translationPageActions.setScrollKey(verseKey));
  };

  return (
    <div ref={refDisplay} className="translation-display">
      <div className="card translation-display-card">
        <div className="card-header">
          <h2 className="pb-2 text-primary text-center">
            {quranService.getChapterName(selectChapter)}
          </h2>
        </div>
        <div className="card-body p-1" ref={refListVerses}>
          {isPending ? (
            <LoadingSpinner />
          ) : (
            stateVerses.map((verse) => {
              return (
                <div
                  key={verse.key}
                  className={`${
                    scrollKey === verse.key
                      ? "translation-display-verse-highlight"
                      : ""
                  }`}
                  data-id={verse.key}
                >
                  <div dir="rtl">
                    <VerseContainer>
                      {verse.versetext}{" "}
                      <span
                        className="translation-display-verse-number"
                        onClick={() => onClickVerse(verse.key)}
                      >
                        ({verse.verseid})
                      </span>
                    </VerseContainer>
                  </div>
                  <TransComponent verse_key={verse.key} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayPanel;
