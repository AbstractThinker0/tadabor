import { useEffect, useState } from "react";
import { RankedVerseProps, verseProps } from "../types";
import axios from "axios";
import useQuran from "../context/QuranContext";

import LoadingSpinner from "../components/LoadingSpinner";
import Display from "../components/Comparator/Display";
import Menu from "../components/Comparator/Menu";

// An axios instance that fetches data and cache it for long duration
const fetchJsonPerm = axios.create({
  baseURL: "/res",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": `max-age=31536000, immutable`,
  },
});

interface transListProps {
  [key: string]: { url: string };
}

const transList: transListProps = {
  "Muhammad Asad": { url: "/trans/Muhammad Asad.json" },
  "The Monotheist Group": { url: "/trans/The Monotheist Group.json" },
};

function Comparator() {
  const { absoluteQuran } = useQuran();
  const [stateLoading, setStateLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState("1");
  const [currentVerse, setCurrentVerse] = useState("");

  interface translationsProps {
    [key: string]: verseProps[];
  }

  const [stateTrans, setStateTrans] = useState<translationsProps>({});

  useEffect(() => {
    let clientLeft = false;

    async function fetchData() {
      const transData: translationsProps = {};

      for (const key of Object.keys(transList)) {
        const response = await fetchJsonPerm.get(transList[key].url);

        transData[key] = response.data;
      }

      if (clientLeft) return;

      setStateTrans(transData);

      setStateLoading(false);
    }

    fetchData();

    return () => {
      clientLeft = true;
    };
  }, []);

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

  if (stateLoading) return <LoadingSpinner />;

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
