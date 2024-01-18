import { PropsWithChildren, useEffect } from "react";
import { isDataLoading, useAppDispatch, useAppSelector } from "@/store/index";

import { fetchVerseNotes } from "@/store/slices/verseNotes";
import { fetchTransNotes } from "@/store/slices/transNotes";
import { fetchRootNotes } from "@/store/slices/rootNotes";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

function DataLoader({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(isDataLoading());

  useEffect(() => {
    dispatch(fetchVerseNotes());

    dispatch(fetchRootNotes());

    dispatch(fetchTransNotes());
  }, []);

  if (isLoading) {
    return (
      <div className="col h-75">
        <div className="h-100">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default DataLoader;
