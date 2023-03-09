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
