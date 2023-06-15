import { useEffect, useState } from "react";
import { RankedVerseProps, translationsProps } from "../types";
import useQuran from "../context/QuranContext";

import LoadingSpinner from "../components/LoadingSpinner";
import Display from "../components/Comparator/Display";
import Menu from "../components/Comparator/Menu";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchAllData } from "../store/dataReducer";

function Comparator() {
  const { absoluteQuran } = useQuran();
  const [currentChapter, setCurrentChapter] = useState("1");
  const [currentVerse, setCurrentVerse] = useState("");
  const { loading, data, complete, error } = useAppSelector(
    (state) => state.data
  );
  const dispatch = useAppDispatch();

  const [stateTrans, setStateTrans] = useState<translationsProps>(data);

  useEffect(() => {
    if (complete) {
      setStateTrans(data);
    } else if (!loading) {
      dispatch(fetchAllData());
    }
  }, [loading, complete, dispatch, data]);

  const chapterVerses: RankedVerseProps[] = [];

  absoluteQuran.forEach((verse, index) => {
    if (verse.suraid !== currentChapter) return;

    chapterVerses.push({ ...verse, rank: index });
  });

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
