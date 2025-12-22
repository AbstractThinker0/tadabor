import useQuran from "@/context/useQuran";
import { useEffect, useState } from "react";

export const useRootsLoaded = () => {
  const quranService = useQuran();

  const [rootsLoaded, setRootsLoaded] = useState(
    quranService.isRootsDataLoaded
  );

  useEffect(() => {
    const handleRootsLoaded = () => {
      setRootsLoaded(true);
    };

    quranService.onRootsLoaded(handleRootsLoaded);

    return () => {
      quranService.onRootsLoaded(() => {}); // Reset callback
    };
  }, [quranService]);

  return rootsLoaded;
};
