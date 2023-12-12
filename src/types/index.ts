export interface chapterProps {
  id: number;
  name: string;
  transliteration: string;
}

export type verseProps = {
  key: string;
  suraid: string;
  verseid: string;
  versetext: string;
};

export interface RankedVerseProps {
  key: string;
  suraid: string;
  verseid: string;
  versetext: string;
  rank: number;
}

export interface translationsProps {
  [key: string]: verseProps[];
}

export interface quranProps {
  id: number;
  verses: verseProps[];
}

export interface rootProps {
  id: number;
  name: string;
  count: string;
  occurences: string[];
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

export interface IMatch {
  text: string;
  isMatch: boolean;
}

export interface searchIndexProps {
  name: string;
  key: string;
  text: string;
  wordIndex: string;
}

export interface verseMatchResult {
  key: string;
  suraid: string;
  verseid: string;
  verseParts: IMatch[];
}
