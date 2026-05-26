export const NOTE_TYPES = ["verse", "root", "translation"] as const;

export type NoteType = (typeof NOTE_TYPES)[number];

export interface NoteIdentity {
  id: string;
  type: NoteType;
  key: string;
}

const NOTE_ID_SEPARATOR = ":";
const reportedInvalidNoteIds = new Set<string>();

export const isNoteType = (value: string): value is NoteType =>
  NOTE_TYPES.includes(value as NoteType);

export const buildNoteId = (type: NoteType, key: string) =>
  `${type}${NOTE_ID_SEPARATOR}${key}`;

export const parseNoteId = (id: string): NoteIdentity => {
  const separatorIndex = id.indexOf(NOTE_ID_SEPARATOR);

  if (separatorIndex <= 0 || separatorIndex === id.length - 1) {
    throw new Error(`Invalid note id: ${id}`);
  }

  const type = id.slice(0, separatorIndex);
  const key = id.slice(separatorIndex + 1);

  if (!isNoteType(type)) {
    throw new Error(`Invalid note type in note id: ${id}`);
  }

  return {
    id,
    type,
    key,
  };
};

export const resolveNoteIdentity = ({
  noteId,
  noteType,
  noteKey,
}: {
  noteId?: string;
  noteType?: NoteType;
  noteKey?: string;
}) => {
  if (noteId) {
    return parseNoteId(noteId);
  }

  if (!noteType || !noteKey) {
    throw new Error("A note requires either noteId or both noteType and noteKey");
  }

  return {
    id: buildNoteId(noteType, noteKey),
    type: noteType,
    key: noteKey,
  };
};

export const hasNoteType = (noteId: string, noteType: NoteType) => {
  try {
    return parseNoteId(noteId).type === noteType;
  } catch (error) {
    if (typeof window !== "undefined" && !reportedInvalidNoteIds.has(noteId)) {
      reportedInvalidNoteIds.add(noteId);
      const message = error instanceof Error ? error.message : "Unknown note ID parsing error";
      console.warn(`Ignoring malformed note ID while filtering notes: ${noteId}. ${message}`);
    }

    return false;
  }
};

export const getDefaultNoteDirection = (noteType: NoteType) =>
  noteType === "translation" ? "ltr" : "";

export const parseVerseAddressKey = (key: string) => {
  const [chapter = "0", verse = "0"] = key.split(/[-:]/);

  return {
    chapter: Number.parseInt(chapter, 10) || 0,
    verse: Number.parseInt(verse, 10) || 0,
  };
};