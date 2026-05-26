import type { verseProps } from "quran-tools";

export interface translationsProps {
  [key: string]: verseProps[];
}

export interface selectedChaptersType {
  [key: string]: boolean;
}
