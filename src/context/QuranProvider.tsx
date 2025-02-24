import {
  useState,
  useEffect,
  PropsWithChildren,
  useRef,
  createContext,
} from "react";

import { fetchChapters, fetchQuran, fetchRoots } from "@/util/fetchData";
import quranClass from "@/util/quranService";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

export const QuranContext = createContext<quranClass | null>(null);

export const QuranProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const quranInstance = useRef(new quranClass());

  useEffect(() => {
    let clientLeft = false;

    async function fetchData() {
      try {
        let response = await fetchChapters();

        if (clientLeft) return;

        quranInstance.current.setChapters(response);

        response = await fetchQuran();

        if (clientLeft) return;

        quranInstance.current.setQuran(response);

        setIsLoading(false);

        response = await fetchRoots();

        if (clientLeft) return;

        quranInstance.current.setRoots(response);
      } catch (error) {
        fetchData();
        return;
      }
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
