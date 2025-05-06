import { useState, useEffect, PropsWithChildren, useMemo } from "react";

import { useAppSelector } from "@/store";

import { fetchChapters, fetchQuran, fetchRoots } from "@/util/fetchData";

import { quranClass } from "quran-tools";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { QuranContext } from "@/context/QuranContext";

export const QuranProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const quranInstance = useMemo(() => new quranClass(), []);

  const isLogged = useAppSelector((state) => state.user.isLogged);

  const isLocalNotesLoading = useAppSelector(
    (state) => state.localNotes.loading
  );
  const isCloudNotesLoading = useAppSelector(
    (state) => state.cloudNotes.loading
  );

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

  if (isLocalNotesLoading || (isLogged && isCloudNotesLoading)) {
    return <LoadingSpinner text="Loading notes.." />;
  }

  return (
    <QuranContext.Provider value={quranInstance}>
      {children}
    </QuranContext.Provider>
  );
};
