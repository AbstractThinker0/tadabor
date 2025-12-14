import { useState, useMemo } from "react";
import type { CloudNoteProps, LocalNoteProps } from "@/types";

type SortOption = "rank" | "status" | "date";

interface UseNoteSortingParams {
  noteIDs: string[];
  userNotes: Record<string, CloudNoteProps | LocalNoteProps>;
  rankComparator: (a: string, b: string) => number;
}

export const useNoteSorting = ({
  noteIDs,
  userNotes,
  rankComparator,
}: UseNoteSortingParams) => {
  const [sortBy, setSortBy] = useState<SortOption>("date");

  const sortedNotesIDs = useMemo(() => {
    return noteIDs.sort((a, b) => {
      const noteA = userNotes[a];
      const noteB = userNotes[b];

      if (!noteA || !noteB) return 0;

      if (sortBy === "rank") {
        return rankComparator(a, b);
      } else if (sortBy === "status") {
        // Primary: Saved status (Pending first)
        if (noteA.saved !== noteB.saved) {
          return noteA.saved ? 1 : -1;
        }
        // Secondary: Modified Date (Newest first)
        return (noteB.date_modified || 0) - (noteA.date_modified || 0);
      } else if (sortBy === "date") {
        // Sort by date created, newest first
        return (noteB.date_created || 0) - (noteA.date_created || 0);
      }
      return 0;
    });
  }, [userNotes, sortBy, rankComparator, noteIDs]);

  return {
    sortBy,
    setSortBy,
    sortedNotesIDs,
  };
};
