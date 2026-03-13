import { useCallback } from "react";
import type { verseProps } from "quran-tools";

import { useQuran } from "@/context/useQuran";
import { useAudioPlayerContext } from "@/context/useAudioPlayer";
import { useAudioPlayerStore } from "@/store/global/audioPlayerStore";

/**
 * Audio player hook that consumes the AudioPlayerProvider
 * Provides audio playback controls and state
 */
export const useAudioPlayer = () => {
  const quranService = useQuran();
  const { pauseAudio, playAudio, seekAudio, setVerseAudio } =
    useAudioPlayerContext();

  // Global store selectors
  const currentVerse = useAudioPlayerStore((state) => state.currentVerse);
  const currentReciter = useAudioPlayerStore((state) => state.currentReciter);
  const isPlaying = useAudioPlayerStore((state) => state.isPlaying);
  const isMinimized = useAudioPlayerStore((state) => state.isMinimized);

  // Store actions
  const setCurrentVerse = useAudioPlayerStore((state) => state.setCurrentVerse);
  const setIsPlaying = useAudioPlayerStore((state) => state.setIsPlaying);
  const setCurrentTime = useAudioPlayerStore((state) => state.setCurrentTime);
  const setAutoPlay = useAudioPlayerStore((state) => state.setAutoPlay);
  const setPlayerVisible = useAudioPlayerStore(
    (state) => state.setPlayerVisible
  );
  const setMinimized = useAudioPlayerStore((state) => state.setMinimized);

  // Play a specific verse
  const playVerse = useCallback(
    (verse: verseProps) => {
      setVerseAudio(verse.rank, currentReciter);
      setCurrentVerse(verse);
      setPlayerVisible(true);
      playAudio();
      setIsPlaying(true);
    },
    [
      currentReciter,
      playAudio,
      setCurrentVerse,
      setIsPlaying,
      setPlayerVisible,
      setVerseAudio,
    ]
  );

  // Play next or previous verse
  const playNextVerse = useCallback(
    (reverse: boolean = false) => {
      const verseRank = currentVerse ? currentVerse.rank : -1;

      if (verseRank !== -1) {
        const nextRank = verseRank + (reverse ? -1 : 1);
        const nextVerse = quranService.absoluteQuran[nextRank];

        if (nextVerse) {
          setVerseAudio(nextRank, currentReciter);
          setCurrentVerse(nextVerse);
          playAudio();
          setIsPlaying(true);
          return true;
        }
      }

      return false;
    },
    [
      currentVerse,
      currentReciter,
      playAudio,
      quranService.absoluteQuran,
      setCurrentVerse,
      setIsPlaying,
      setVerseAudio,
    ]
  );

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseAudio();
    } else {
      void playAudio();
    }

    setIsPlaying(!isPlaying);
  }, [isPlaying, pauseAudio, playAudio, setIsPlaying]);

  // Handle time slider change
  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      seekAudio(value);
      setCurrentTime(value);
    },
    [seekAudio, setCurrentTime]
  );

  // Handle auto-play toggle
  const handleChangeAutoPlay = (checked: boolean) => {
    setAutoPlay(checked);
  };

  // Handle close button
  const handleClose = useCallback(() => {
    pauseAudio();
    setIsPlaying(false);
    setPlayerVisible(false);
    setCurrentVerse(null);
  }, [pauseAudio, setCurrentVerse, setIsPlaying, setPlayerVisible]);

  // Handle minimize toggle
  const handleToggleMinimize = () => {
    setMinimized(!isMinimized);
  };

  return {
    currentVerse,
    playVerse,
    playNextVerse: () => playNextVerse(false),
    playPrevVerse: () => playNextVerse(true),
    togglePlayPause,
    handleSliderChange,
    handleChangeAutoPlay,
    handleClose,
    handleToggleMinimize,
  };
};
