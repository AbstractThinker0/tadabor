import { useRef } from "react";
import { Routes, Route } from "react-router-dom";

import About from "./components/About";
import Coloring from "./components/Coloring";
import LoadingSpinner from "./components/LoadingSpinner";
import QuranBrowser from "./components/QuranBrowser";
import RootsBrowser from "./components/RootsBrowser";
import YourNotes from "./components/YourNotes";
import useAxios from "./util/useAxios";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuranBrowserLoaded />} />
      <Route path="/roots" element={<RootsBrowser />} />
      <Route path="/notes" element={<YourNotes />} />
      <Route path="/coloring" element={<Coloring />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<QuranBrowserLoaded />} />
    </Routes>
  );
}

const withDataLoaded = (Component) => () => {
  const { isLoading: chaptersIsLoading, data: dataChapters } =
    useAxios("/res/chapters.json");

  const { isLoading: quranIsLoading, data: dataQuran } =
    useAxios("/res/quran_v2.json");

  const { isLoading: rootsIsLoading, data: dataRoots } = useAxios(
    "/res/quran-root.txt"
  );

  let absoluteQuran = useRef([]);
  let quranRoots = useRef([]);

  if (chaptersIsLoading || quranIsLoading || rootsIsLoading)
    return <LoadingSpinner />;

  if (absoluteQuran.current.length === 0) {
    dataQuran.forEach((sura) => {
      sura.verses.forEach((verse) => {
        absoluteQuran.current.push(verse);
      });
    });
  }

  if (quranRoots.current.length === 0) {
    let index = 0;
    let arrayOfLines = dataRoots.split("\n");

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

  return (
    <Component
      allQuranText={dataQuran}
      absoluteQuran={absoluteQuran.current}
      chapterNames={dataChapters}
      quranRoots={quranRoots.current}
    />
  );
};

const QuranBrowserLoaded = withDataLoaded(QuranBrowser);

export default App;
