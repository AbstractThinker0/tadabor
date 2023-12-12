import {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  PropsWithChildren,
} from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { chapterProps, quranProps, rootProps, verseProps } from "@/types";
import fetchJsonPerm from "@/util/fetchJsonPerm";

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

    async function fetchData() {
      try {
        let response = await fetchJsonPerm.get("/chapters.json");

        if (clientLeft) return;

        if (!chapterNames.current.length) {
          chapterNames.current = response.data;
        }

        response = await fetchJsonPerm.get("/quran_v2.json");

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

        response = await fetchJsonPerm.get("/quranRoots-0.0.7.json");

        if (clientLeft) return;

        if (!quranRoots.current.length) {
          quranRoots.current = response.data;
        }
      } catch (error) {
        fetchData();
        return;
      }

      setIsLoading(false);
    }

    fetchData();

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
