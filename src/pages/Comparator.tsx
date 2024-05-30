import { useEffect, useState } from "react";

import { RankedVerseProps, translationsProps } from "@/types";
import useQuran from "@/context/useQuran";
import {
  isVerseNotesLoading,
  isTransNotesLoading,
  useAppDispatch,
  useAppSelector,
} from "@/store";
import { fetchAllTranslations } from "@/store/slices/global/translations";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { fetchTransNotes } from "@/store/slices/global/transNotes";
import { comparatorPageActions } from "@/store/slices/pages/comparator";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import Display from "@/components/Pages/Comparator/Display";
import Menu from "@/components/Pages/Comparator/Menu";

import "@/styles/pages/comparator.scss";

function Comparator() {
  const quranService = useQuran();

  const { currentChapter, currentVerse } = useAppSelector(
    (state) => state.comparatorPage
  );

  const { loading, data, complete, error } = useAppSelector(
    (state) => state.translations
  );
  const isVNotesLoading = useAppSelector(isVerseNotesLoading());
  const isTNotesLoading = useAppSelector(isTransNotesLoading());
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
    dispatch(fetchVerseNotes());
    dispatch(fetchTransNotes());
  }, []);

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
    dispatch(comparatorPageActions.setCurrentVerse(verseKey));
  };

  const setChapter = (chapterID: string) => {
    dispatch(comparatorPageActions.setCurrentChapter(chapterID));
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
      {isVNotesLoading || isTNotesLoading ? (
        <LoadingSpinner />
      ) : (
        <Display
          currentChapter={currentChapter}
          currentVerse={currentVerse}
          chapterVerses={chapterVerses}
          transVerses={stateTrans}
          handleSelectVerse={selectVerse}
        />
      )}
    </div>
  );
}

export default Comparator;
