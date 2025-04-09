import { LetterRole } from "@/util/consts";
import { verseProps } from "quran-tools";

export interface translationsProps {
  [key: string]: verseProps[];
}

export interface selectedChaptersType {
  [key: string]: boolean;
}

export interface NoteProp {
  text: string;
  dir?: string;
}

export interface UserNotesType {
  [key: string]: NoteProp;
}

export interface TransNotesType {
  [key: string]: string;
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
