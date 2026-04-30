import { useState, useEffect, type PropsWithChildren, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { fetchChapters, fetchQuran, fetchRoots } from "@/util/fetchData";

import { quranClass } from "quran-tools";

import { LoadingSpinner } from "@/components/Generic/LoadingSpinner";
import { QuranContext } from "@/context/QuranContext";

import { ErrorRefresh } from "@/components/Generic/ErrorRefresh";

const MAX_RETRIES = 3;

export const QuranProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const quranInstance = useMemo(() => new quranClass(), []);

  useEffect(() => {
    let clientLeft = false;
    let retryCount = 0;

    async function fetchData() {
      try {
        if (retryCount >= MAX_RETRIES) {
          setError(true);
          setIsLoading(false);
          return;
        }

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

        // Reset error state if successful
        setError(false);
      } catch (error) {
        console.error("Error fetching Quran data:", error);
        retryCount++;

        // Add exponential backoff for retries
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);

        if (!clientLeft) {
          setTimeout(() => {
            if (!clientLeft) fetchData();
          }, backoffTime);
        }
        return;
      }
    }

    fetchData();

    return () => {
      clientLeft = true;
    };
  }, [quranInstance]);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(false);
  };

  if (isLoading) {
    return <LoadingSpinner text={t("ui.state.loading_quran_data")} />;
  }

  if (error) {
    return (
      <ErrorRefresh
        message={t("ui.state.failed_load_quran_data")}
        handleRefresh={handleRefresh}
      />
    );
  }

  return (
    <QuranContext.Provider value={quranInstance}>
      {children}
    </QuranContext.Provider>
  );
};
