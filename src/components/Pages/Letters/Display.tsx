import { useEffect, useRef } from "react";

import useQuran from "@/context/useQuran";

import { useAppSelector } from "@/store";

import ListVerses from "@/components/Pages/Letters/ListVerses";

const Display = () => {
  const quranService = useQuran();
  const refDisplay = useRef<HTMLDivElement>(null);

  const currentChapter = useAppSelector(
    (state) => state.lettersPage.currentChapter
  );

  // Reset scroll whenever we switch from one chapter to another
  useEffect(() => {
    if (!refDisplay.current) return;

    refDisplay.current.scrollTop = 0;
  }, [currentChapter]);

  return (
    <div className="p-2 display" ref={refDisplay}>
      <div className="card display-verses">
        <div className="card-header text-primary text-center fs-3">
          سورة {quranService.getChapterName(currentChapter)}
        </div>
        <ListVerses />
      </div>
    </div>
  );
};

export default Display;
