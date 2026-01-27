import { getReciterById, DEFAULT_RECITER_ID } from "./reciters";

export const getVerseAudioURL = (verseRank: number, reciterId?: string) => {
  const id = reciterId || DEFAULT_RECITER_ID;
  const reciter = getReciterById(id);
  const quality = reciter?.quality || 128;

  return `https://cdn.islamic.network/quran/audio/${quality}/${id}/${
    verseRank + 1
  }.mp3`;
};
