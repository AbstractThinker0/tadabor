import { useEffect } from "react";
import { useNavigationStore } from "@/store/global/navigationStore";

export function usePageNav(navKey: string) {
  const setCurrentPage = useNavigationStore((state) => state.setCurrentPage);
  useEffect(() => {
    setCurrentPage(navKey);
  }, [setCurrentPage, navKey]);
}
