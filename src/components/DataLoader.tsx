import { PropsWithChildren, useEffect, useState } from "react";
import { dbFuncs } from "@/util/db";
import { useAppDispatch } from "@/store/index";
import { UserNotesType, TransNotesType } from "@/types";

import { verseNotesActions } from "@/store/slices/verseNotes";
import { transNotesActions } from "@/store/slices/transNotes";
import { rootNotesActions } from "@/store/slices/rootNotes";

import LoadingSpinner from "@/components/LoadingSpinner";

function DataLoader({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      const userNotes = await dbFuncs.loadNotes();

      if (clientLeft) return;

      const fetchedNotes: UserNotesType = {};

      userNotes.forEach((note) => {
        fetchedNotes[note.id] = {
          text: note.text,
          dir: note.dir,
        };
      });

      dispatch(verseNotesActions.notesLoaded(fetchedNotes));

      const userTranslations = await dbFuncs.loadTranslations();

      if (clientLeft) return;

      const extractTranslations: TransNotesType = {};

      userTranslations.forEach((trans) => {
        extractTranslations[trans.id] = trans.text;
      });

      dispatch(transNotesActions.translationsLoaded(extractTranslations));

      const userRootNotes = await dbFuncs.loadRootNotes();

      if (clientLeft) return;

      const fetchedRootNotes: UserNotesType = {};

      userRootNotes.forEach((note) => {
        fetchedRootNotes[note.id] = {
          text: note.text,
          dir: note.dir,
        };
      });

      dispatch(rootNotesActions.rootNotesLoaded(fetchedRootNotes));

      setIsLoading(false);
    }

    return () => {
      clientLeft = true;
    };
  }, [dispatch]);

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
