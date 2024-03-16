import { useRef, useState, useTransition, useEffect, Fragment } from "react";

import useQuran from "@/context/useQuran";
import { verseProps } from "@/types";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import TransComponent from "@/components/Translation/TransComponent";

interface DisplayPanelProps {
  selectChapter: number;
}

const DisplayPanel = ({ selectChapter }: DisplayPanelProps) => {
  const quranService = useQuran();
  const refDisplay = useRef<HTMLDivElement>(null);

  const [stateVerses, setStateVerses] = useState<verseProps[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!refDisplay.current) return;

    startTransition(() => {
      setStateVerses(quranService.getVerses(selectChapter));
    });

    refDisplay.current.scrollTop = 0;
  }, [selectChapter]);

  return (
    <div ref={refDisplay} className="translation-display">
      <div className="card translation-display-card">
        <div className="card-header">
          <h2 className="pb-2 text-primary text-center">
            {quranService.getChapterName(selectChapter)}
          </h2>
        </div>
        <div className="card-body p-1">
          {isPending ? (
            <LoadingSpinner />
          ) : (
            stateVerses.map((verse) => {
              return (
                <Fragment key={verse.key}>
                  <p className="fs-3 mb-0" dir="rtl">
                    {verse.versetext} ({verse.verseid})
                  </p>
                  <TransComponent verse_key={verse.key} />
                </Fragment>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayPanel;
