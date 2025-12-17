import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { fetchLocalNotes } from "@/store/slices/global/localNotes";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

const LocalNotesProvider = ({ children }: { children: React.ReactNode }) => {
  const isLocalNotesLoading = useAppSelector(
    (state) => state.localNotes.loading
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchLocalNotes());
  }, [dispatch]);

  if (isLocalNotesLoading) {
    return <LoadingSpinner text="Loading local notes.." />;
  }

  return <>{children}</>;
};

export default LocalNotesProvider;
