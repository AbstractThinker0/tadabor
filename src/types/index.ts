import { LetterRole } from "@/util/consts";
import { ICloudNote, ILocalNote } from "@/util/db";

import { verseProps } from "quran-tools";

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

export interface CloudNoteProps extends ICloudNote, NoteSaveProps {
  isSynced?: boolean;
}

export interface LocalNoteProps extends ILocalNote, NoteSaveProps {}

export interface ChangeNotePayload {
  name: string;
  value: string;
}

export interface ChangeNoteDirPayload {
  name: string;
  value: string;
}

export interface MarkSavedPayload {
  id: string;
  dateModified: number;
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
  letter_role: LetterRole;
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
