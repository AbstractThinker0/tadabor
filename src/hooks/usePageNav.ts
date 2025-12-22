import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { navigationActions } from "@/store/slices/global/navigation";

export function usePageNav(navKey: string) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(navigationActions.setCurrentPage(navKey));
  }, [dispatch, navKey]);
}
