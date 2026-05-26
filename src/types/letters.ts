import type { LetterRoleType } from "@/util/consts";

interface LetterDefinition {
  name: string;
  definition: string;
  dir?: string;
  preset_id?: string;
}

export interface LettersDefinitionType {
  [key: string]: LetterDefinition;
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