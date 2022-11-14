import axios from "axios";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  ReactNode,
} from "react";
import LoadingSpinner from "../components/LoadingSpinner";

interface Props {
  children?: ReactNode;
}

const QuranContext = createContext({});

export const QuranProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  const chapterNames = useRef([]);
  const allQuranText = useRef([]);
  const quranRoots = useRef<any>([]);
  const absoluteQuran = useRef<any>([]);

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
          allQuranText.current.forEach((sura: any) => {
            sura.verses.forEach((verse: any) => {
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
          let arrayOfLines = response.data.split("\n");

          arrayOfLines.forEach((line: string) => {
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
