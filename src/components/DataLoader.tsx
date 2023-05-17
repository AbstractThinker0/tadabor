import { PropsWithChildren, useEffect, useState } from "react";
import { dbFuncs } from "../util/db";
import { useAppDispatch } from "../store";
import { UserNotesType, notesDirectionType } from "../types";
import { notesActions } from "../store/notesReducer";
import LoadingSpinner from "./LoadingSpinner";

function DataLoader({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let clientLeft = false;

    fetchData();

    async function fetchData() {
      const userNotes = await dbFuncs.loadNotes();
      const userNotesDir = await dbFuncs.loadNotesDir();

      if (clientLeft) return;

      const extractNotesDir: notesDirectionType = {};

      userNotesDir.forEach((note) => {
        extractNotesDir[note.id] = note.dir;
      });

      const fetchedNotes: UserNotesType = {};

      userNotes.forEach((note) => {
        fetchedNotes[note.id] = {
          text: note.text,
          dir: extractNotesDir[note.id],
        };
      });

      dispatch(notesActions.notesLoaded(fetchedNotes));
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
