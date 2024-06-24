import { useEffect, useRef } from "react";

import useQuran from "@/context/useQuran";

import ListVerses from "@/components/Pages/Inspector/ListVerses";

interface DisplayProps {
  currentChapter: number;
}

const Display = ({ currentChapter }: DisplayProps) => {
  const quranService = useQuran();
  const refDisplay = useRef<HTMLDivElement>(null);

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
        <ListVerses currentChapter={currentChapter} />
      </div>
    </div>
  );
};

export default Display;
