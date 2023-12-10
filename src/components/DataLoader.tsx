import { PropsWithChildren, useEffect, useState } from "react";
import { dbFuncs } from "@/util/db";
import { useAppDispatch } from "@/store/index";
import { UserNotesType, translationsType } from "@/types";
import { notesActions } from "@/store/notesReducer";
import { translationsActions } from "@/store/translationsReducer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { rootNotesActions } from "@/store/rootNotesReducer";

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

      dispatch(notesActions.notesLoaded(fetchedNotes));

      const userTranslations = await dbFuncs.loadTranslations();

      if (clientLeft) return;

      const extractTranslations: translationsType = {};

      userTranslations.forEach((trans) => {
        extractTranslations[trans.id] = trans.text;
      });

      dispatch(translationsActions.translationsLoaded(extractTranslations));

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
