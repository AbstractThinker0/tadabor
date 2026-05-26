import type { ICloudNote, ILocalNote } from "@/util/db";

interface NoteSaveProps {
  saved?: boolean;
  preSave?: string;
  preSaveDir?: string;
  hasPersistedVersion?: boolean;
}

export interface CloudNoteProps extends ICloudNote, NoteSaveProps {
  isSynced?: boolean;
}

export interface LocalNoteProps extends ILocalNote, NoteSaveProps {}

export interface NotesStateProps<T> {
  data: Record<string, T>;
  dataKeys: string[];
  dataLoading: Record<string, boolean>;
  dataComplete: Record<string, boolean>;

  loading: boolean;
  complete: boolean;
  error: boolean;
}

export interface ChangeNotePayload {
  name: string;
  value: string;
}

export interface MarkSavedPayload<T> {
  saveData: T;
}