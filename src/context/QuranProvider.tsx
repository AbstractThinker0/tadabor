import { useState, useEffect, PropsWithChildren, useMemo } from "react";

import { fetchChapters, fetchQuran, fetchRoots } from "@/util/fetchData";

import { quranClass } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { QuranContext } from "@/context/QuranContext";

export const QuranProvider = ({ children }: PropsWithChildren) => {
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
