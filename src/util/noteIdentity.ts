export const NOTE_TYPES = ["verse", "root", "translation"] as const;

export type NoteType = (typeof NOTE_TYPES)[number];

export interface NoteIdentity {
  id: string;
  type: NoteType;
  key: string;
}

const NOTE_ID_SEPARATOR = ":";

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
  noteID,
  noteType,
  noteKey,
}: {
  noteID?: string;
  noteType?: NoteType;
  noteKey?: string;
}) => {
  if (noteID) {
    return parseNoteId(noteID);
  }

  if (!noteType || !noteKey) {
    throw new Error("A note requires either noteID or both noteType and noteKey");
  }

  return {
    id: buildNoteId(noteType, noteKey),
    type: noteType,
    key: noteKey,
  };
};

export const hasNoteType = (noteID: string, noteType: NoteType) =>
  parseNoteId(noteID).type === noteType;

export const getDefaultNoteDirection = (noteType: NoteType) =>
  noteType === "translation" ? "ltr" : "";

export const parseVerseAddressKey = (key: string) => {
  const [chapter = "0", verse = "0"] = key.split(/[-:]/);

  return {
    chapter: Number.parseInt(chapter, 10) || 0,
    verse: Number.parseInt(verse, 10) || 0,
  };
};