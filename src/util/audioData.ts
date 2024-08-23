export const getVerseAudioURL = (verseRank: number) => {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${
    verseRank + 1
  }.mp3`;
};
