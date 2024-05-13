import { selectedChaptersType, verseProps } from "@/types";

export interface stateProps {
  currentChapter: number;
  colorsList: coloredProps;
  selectedColors: coloredProps;
  coloredVerses: coloredProps;
  currentVerse: verseProps | null;
  currentColor: colorProps | null;
  selectedChapters: selectedChaptersType;
  scrollKey: string;
}

export interface colorProps {
  colorID: string;
  colorCode: string;
  colorDisplay: string;
}

export interface coloredProps {
  [key: string]: colorProps;
}
