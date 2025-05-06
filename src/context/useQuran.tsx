import { useContext } from "react";

import { QuranContext } from "@/context/QuranContext";

const useQuran = () => {
  const quranInstance = useContext(QuranContext);

  if (!quranInstance) {
    throw new Error("useQuran must be used within a QuranProvider");
  }

  return quranInstance;
};

export default useQuran;
