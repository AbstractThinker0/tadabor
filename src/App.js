import axios from "axios";

import { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";

import About from "./components/About";
import LoadingSpinner from "./components/LoadingSpinner";
import QuranBrowser from "./components/QuranBrowser";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DataLoader />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<DataLoader />} />
    </Routes>
  );
}

const DataLoader = () => {
  const [loadingState, setLoadingState] = useState(true);

  let allQuranText = useRef(null);
  let absoluteQuran = useRef([]);
  let chapterNames = useRef(null);
  let quranRoots = useRef([]);

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      let res;

      if (chapterNames.current === null) {
        res = await axios.get("/res/chapters.json");

        if (res.error || clientLeft) return;

        chapterNames.current = res.data;
      }

      if (allQuranText.current === null) {
        res = await axios.get("/res/quran.json");

        if (res.error || clientLeft) return;

        allQuranText.current = res.data;
      }

      if (absoluteQuran.current.length === 0) {
        allQuranText.current.forEach((sura) => {
          sura.verses.forEach((verse) => {
            absoluteQuran.current.push(verse);
          });
        });
      }

      let index = 0;
      if (quranRoots.current.length === 0) {
        res = await axios.get("/res/quran-root.txt");

        if (res.error || clientLeft) return;

        let arrayOfLines = res.data.split("\n");

        arrayOfLines.forEach((line) => {
          if (line[0] === "#" || line[0] === "\r") {
            return;
          }

          let lineArgs = line.split(/[\r\n\t]+/g);

          let occurences = lineArgs[2].split(";");

          quranRoots.current.push({
            id: index,
            name: lineArgs[0],
            count: lineArgs[1],
            occurences: occurences,
          });

          index++;
        });
      }

      setLoadingState(false);
    }

    return () => {
      clientLeft = true;
    };
  }, []);

  if (loadingState) return <LoadingSpinner />;

  return (
    <QuranBrowser
      allQuranText={allQuranText.current}
      absoluteQuran={absoluteQuran.current}
      chapterNames={chapterNames.current}
      quranRoots={quranRoots.current}
    />
  );
};

export default App;
