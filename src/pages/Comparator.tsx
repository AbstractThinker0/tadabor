import { useEffect, useState } from "react";

import { RankedVerseProps, translationsProps } from "@/types";
import useQuran from "@/context/useQuran";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchAllTranslations } from "@/store/slices/translations";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import Display from "@/components/Comparator/Display";
import Menu from "@/components/Comparator/Menu";

function Comparator() {
  const quranService = useQuran();
  const [currentChapter, setCurrentChapter] = useState("1");
  const [currentVerse, setCurrentVerse] = useState("");
  const { loading, data, complete, error } = useAppSelector(
    (state) => state.translations
  );
  const dispatch = useAppDispatch();

  const [stateTrans, setStateTrans] = useState<translationsProps>(data);
  const [chapterVerses, setChapterVerses] = useState(() => {
    //
    const chapterVerses: RankedVerseProps[] = [];

    quranService.absoluteQuran.forEach((verse, index) => {
      if (verse.suraid !== currentChapter) return;

      chapterVerses.push({ ...verse, rank: index });
    });

    return chapterVerses;
  });

  useEffect(() => {
    //
    const chapterVerses: RankedVerseProps[] = [];

    quranService.absoluteQuran.forEach((verse, index) => {
      if (verse.suraid !== currentChapter) return;

      chapterVerses.push({ ...verse, rank: index });
    });

    setChapterVerses(chapterVerses);
  }, [currentChapter]);

  useEffect(() => {
    if (complete) {
      setStateTrans(data);
    } else if (!loading) {
      dispatch(fetchAllTranslations());
    }
  }, [loading, complete, dispatch, data]);

  const selectVerse = (verseKey: string) => {
    setCurrentVerse(verseKey);
  };

  const setChapter = (chapterID: string) => {
    setCurrentChapter(chapterID);
  };

  if (error)
    return (
      <div dir="auto" className="text-center">
        Failed to load translations, try reloading the page.
      </div>
    );

  if (!complete) return <LoadingSpinner />;

  return (
    <div className="comparator">
      <Menu
        chapterVerses={chapterVerses}
        handleSelectVerse={selectVerse}
        handleSetChapter={setChapter}
      />
      <Display
        currentChapter={currentChapter}
        currentVerse={currentVerse}
        chapterVerses={chapterVerses}
        transVerses={stateTrans}
        handleSelectVerse={selectVerse}
      />
    </div>
  );
}

export default Comparator;
