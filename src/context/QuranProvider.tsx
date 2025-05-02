import {
  useState,
  useEffect,
  PropsWithChildren,
  useMemo,
  createContext,
} from "react";

import { useAppDispatch } from "@/store";
import { fetchRootNotes } from "@/store/slices/global/rootNotes";
import { fetchTransNotes } from "@/store/slices/global/transNotes";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";

import { fetchChapters, fetchQuran, fetchRoots } from "@/util/fetchData";

import { quranClass } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

export const QuranContext = createContext<quranClass | null>(null);

export const QuranProvider = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const quranInstance = useMemo(() => new quranClass(), []);

  useEffect(() => {
    let clientLeft = false;

    async function fetchData() {
      try {
        const [chapters, quran] = await Promise.all([
          fetchChapters(),
          fetchQuran(),
        ]);

        if (clientLeft) return;

        quranInstance.setChapters(chapters);
        quranInstance.setQuran(quran);

        setIsLoading(false);

        const roots = await fetchRoots();

        if (clientLeft) return;

        quranInstance.setRoots(roots);
      } catch (error) {
        fetchData();
        return;
      }
    }

    fetchData();

    dispatch(fetchRootNotes());
    dispatch(fetchVerseNotes());
    dispatch(fetchTransNotes());

    return () => {
      clientLeft = true;
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading Quran data.." />;
  }

  return (
    <QuranContext.Provider value={quranInstance}>
      {children}
    </QuranContext.Provider>
  );
};
