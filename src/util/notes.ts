import type { CloudNoteProps, LocalNoteProps } from "@/types";
import { v4 as uuidv4 } from "uuid";
import type { ICloudNote } from "@/util/db";
import type { BackendNote } from "@/util/AppRouter";

interface CreateNewNoteParams {
  id: string;
  text?: string;
  dir?: string;
  authorId?: number;
}

export const createNewNote = ({
  id,
  text = "",
  dir = "",
  authorId,
}: CreateNewNoteParams) => {
  const [type, key] = id.split(":");
  const now = Date.now();
  return {
    uuid: uuidv4(),
    id,
    authorId,
    type,
    key,
    text,
    preSave: "",
    dir,
    saved: false,
    date_modified: now,
    date_created: now,
  };
};

// Converts from Redux (CloudNoteProps) to IndexDB (ICloudNote)
export const fromReduxToDexie = (note: CloudNoteProps): ICloudNote => {
  const {
    id,
    uuid,
    authorId,
    key,
    type,
    text,
    dir,
    date_created,
    date_modified,
    date_synced,
    isDeleted,
    isPublished,
  } = note;

  return {
    id,
    uuid,
    authorId,
    key,
    type,
    text,
    dir,
    date_created,
    date_modified,
    date_synced,
    isDeleted,
    isPublished,
  };
};

export type NoteUploadPayload = Pick<
  BackendNote,
  | "key"
  | "type"
  | "uuid"
  | "content"
  | "dateCreated"
  | "dateModified"
  | "direction"
>;

// Converts to backend payload (NoteProps)
export const fromDexieToBackend = (note: ICloudNote): NoteUploadPayload => ({
  uuid: note.uuid,
  key: note.key,
  type: note.type,
  content: note.text,
  direction: note.dir ?? null,
  dateCreated: note.date_created ?? 0,
  dateModified: note.date_modified ?? 0,
});

export const fromBackendToDexie = (note: BackendNote): ICloudNote => {
  return {
    id: note.id,
    uuid: note.uuid,
    authorId: note.authorId,
    key: note.key,
    type: note.type,
    text: note.content ?? "", // Normalize null to empty string
    dir: note.direction ?? undefined,
    date_created: note.dateCreated,
    date_modified: note.dateModified,
    date_synced: note.dateLastSynced,
    isDeleted: note.isDeleted ?? undefined,
    isPublished: note.isPublished ?? undefined,
  };
};

/**
 * Determine if the note's content changed compared to last persisted value.
 * Returns the new dateModified to persist alongside.
 */
export const computeDateModified = (note: LocalNoteProps) => {
  const now = Date.now();

  const shouldUpdate = note.text !== note.preSave;
  return shouldUpdate ? now : note.date_modified!;
};
