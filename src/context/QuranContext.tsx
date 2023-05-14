import axios from "axios";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  PropsWithChildren,
} from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { chapterProps, quranProps, rootProps, verseProps } from "../types";

type QuranContent = {
  chapterNames: chapterProps[];
  allQuranText: quranProps[];
  quranRoots: rootProps[];
  absoluteQuran: verseProps[];
};

const QuranContext = createContext<QuranContent>({
  chapterNames: [],
  allQuranText: [],
  quranRoots: [],
  absoluteQuran: [],
});

export const QuranProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);

  const chapterNames = useRef<chapterProps[]>([]);
  const allQuranText = useRef<quranProps[]>([]);
  const quranRoots = useRef<rootProps[]>([]);
  const absoluteQuran = useRef<verseProps[]>([]);

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      try {
        let response = await axios.get("/res/chapters.json", {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": `max-age=31536000, immutable`,
          },
        });

        if (clientLeft) return;

        if (!chapterNames.current.length) {
          chapterNames.current = response.data;
        }

        response = await axios.get("/res/quran_v2.json", {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": `max-age=31536000, immutable`,
          },
        });

        if (clientLeft) return;

        if (!allQuranText.current.length) {
          allQuranText.current = response.data;
        }

        if (!absoluteQuran.current.length) {
          allQuranText.current.forEach((sura) => {
            sura.verses.forEach((verse) => {
              absoluteQuran.current.push(verse);
            });
          });
        }

        response = await axios.get("/res/quran-root.txt", {
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": `max-age=31536000, immutable`,
          },
        });

        if (clientLeft) return;

        if (!quranRoots.current.length) {
          let index = 0;
          const arrayOfLines = response.data.split("\n");

          arrayOfLines.forEach((line: string) => {
            if (line[0] === "#" || line[0] === "\r") {
              return;
            }

            const lineArgs = line.split(/[\r\n\t]+/g);

            const occurences = lineArgs[2].split(";");

            quranRoots.current.push({
              id: index,
              name: lineArgs[0],
              count: lineArgs[1],
              occurences: occurences,
            });

            index++;
          });
        }
      } catch (error) {
        fetchData();
        return;
      }

      setIsLoading(false);
    }

    return () => {
      clientLeft = true;
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <QuranContext.Provider
      value={{
        allQuranText: allQuranText.current,
        chapterNames: chapterNames.current,
        quranRoots: quranRoots.current,
        absoluteQuran: absoluteQuran.current,
      }}
    >
      {children}
    </QuranContext.Provider>
  );
};

const useQuran = () => useContext(QuranContext);

export default useQuran;
