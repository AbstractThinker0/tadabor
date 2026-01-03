import type { LetterRoleType } from "@/util/consts";

export interface IBaseNote {
  id: string;
  uuid: string;
  authorId?: number;
  key: string;
  type: string;
  text: string;
  dir?: string;
  date_created?: number;
  date_modified?: number;
}

export interface ICloudProps {
  date_synced?: number;
  isDeleted?: boolean;
  isPublished?: boolean;
}

// Prefer a type alias with IBaseNote on the left so base fields show first in IntelliSense
export type ICloudNote = IBaseNote & ICloudProps;

export type ILocalNote = IBaseNote;

// Common fields
export interface ISyncable {
  uuid?: string;
}

// Specific interfaces
export interface IColor extends ISyncable {
  id: string;
  name: string;
  code: string;
}

export interface IVerseColor extends ISyncable {
  verse_key: string;
  color_id: string;
}

export interface ITag extends ISyncable {
  id: string;
  name: string;
}

export interface IVerseTags extends ISyncable {
  verse_key: string;
  tags_ids: string[];
}

export interface ILetterDefinition extends ISyncable {
  id: string;
  name: string;
  definition: string;
  preset_id: string;
  dir?: string;
}

export interface ILettersPreset extends ISyncable {
  id: string;
  name: string;
}

export interface ILetterData extends ISyncable {
  letter_key: string;
  letter_role: LetterRoleType;
  def_id: string;
}
