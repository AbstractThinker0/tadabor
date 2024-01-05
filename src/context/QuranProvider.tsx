import {
  useState,
  useEffect,
  PropsWithChildren,
  useRef,
  createContext,
} from "react";

import fetchJsonPerm from "@/util/fetchJsonPerm";
import quranClass from "@/util/quranService";

import LoadingSpinner from "@/components/LoadingSpinner";

export const QuranContext = createContext<quranClass | null>(null);

export const QuranProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const quranInstance = useRef(new quranClass());

  useEffect(() => {
    let clientLeft = false;

    async function fetchData() {
      try {
        let response = await fetchJsonPerm.get("/chapters.json");

        if (clientLeft) return;

        quranInstance.current.setChapters(response.data);

        response = await fetchJsonPerm.get("/quran_v2.json");

        if (clientLeft) return;

        quranInstance.current.setQuran(response.data);

        response = await fetchJsonPerm.get("/quranRoots-0.0.7.json");

        if (clientLeft) return;

        quranInstance.current.setRoots(response.data);
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
    <QuranContext.Provider value={quranInstance.current}>
      {children}
    </QuranContext.Provider>
  );
};
