import { type LetterRoleType } from "@/util/consts";
import type { ICloudNote, ILocalNote } from "@/util/db";

import type { verseProps } from "quran-tools";

export interface translationsProps {
  [key: string]: verseProps[];
}

export interface selectedChaptersType {
  [key: string]: boolean;
}

interface NoteSaveProps {
  saved?: boolean;
  preSave?: string;
}

// used for state
export interface CloudNoteProps extends ICloudNote, NoteSaveProps {
  isSynced?: boolean;
}

// used for state
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

export interface ChangeNoteDirPayload {
  name: string;
  value: string;
}

export interface MarkSavedPayload<T> {
  saveData: T;
}

interface LetterType {
  name: string;
  definition: string;
  dir?: string;
  preset_id?: string;
}

export interface LettersDefinitionType {
  [key: string]: LetterType;
}

export interface LetterDataType {
  letter_key: string;
  letter_role: LetterRoleType;
  def_id: string;
}

export interface LetterDataByVerseType {
  [key: string]: LetterDataType;
}

export interface LettersDataByVerseType {
  [key: string]: LetterDataByVerseType;
}

export interface LettersPresetsType {
  [key: string]: string;
}
