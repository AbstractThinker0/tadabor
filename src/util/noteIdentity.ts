import { parseNoteId, type NoteType } from "tadabor-shared";

const reportedInvalidNoteIds = new Set<string>();

export const hasNoteType = (noteId: string, noteType: NoteType) => {
  try {
    return parseNoteId(noteId).type === noteType;
  } catch (error) {
    if (typeof window !== "undefined" && !reportedInvalidNoteIds.has(noteId)) {
      reportedInvalidNoteIds.add(noteId);
      const message =
        error instanceof Error
          ? error.message
          : "Unknown note ID parsing error";
      console.warn(
        `Ignoring malformed note ID while filtering notes: ${noteId}. ${message}`
      );
    }

    return false;
  }
};
