import { useCallback } from "react";
import type { verseProps } from "quran-tools";

import useQuran from "@/context/useQuran";
import useAudioPlayerContext from "@/context/useAudioPlayer";
import { useAudioPlayerStore } from "@/store/global/audioPlayerStore";
import { getVerseAudioURL } from "@/util/audioData";

/**
 * Audio player hook that consumes the AudioPlayerProvider
 * Provides audio playback controls and state
 */
export const useAudioPlayer = () => {
  const quranService = useQuran();
  const { audioElement: audio } = useAudioPlayerContext();

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
      audio.src = getVerseAudioURL(verse.rank, currentReciter);
      setCurrentVerse(verse);
      setPlayerVisible(true);
      audio.play();
      setIsPlaying(true);
    },
    [audio, currentReciter, setCurrentVerse, setPlayerVisible, setIsPlaying]
  );

  // Play next or previous verse
  const playNextVerse = useCallback(
    (reverse: boolean = false) => {
      const verseRank = currentVerse ? currentVerse.rank : -1;

      if (verseRank !== -1) {
        const nextRank = verseRank + (reverse ? -1 : 1);
        const nextVerse = quranService.absoluteQuran[nextRank];

        if (nextVerse) {
          audio.src = getVerseAudioURL(nextRank, currentReciter);
          setCurrentVerse(nextVerse);
          audio.play();
          setIsPlaying(true);
          return true;
        }
      }

      return false;
    },
    [
      audio,
      currentVerse,
      currentReciter,
      quranService.absoluteQuran,
      setCurrentVerse,
      setIsPlaying,
    ]
  );

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  }, [audio, isPlaying, setIsPlaying]);

  // Handle time slider change
  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      audio.currentTime = value;
      setCurrentTime(value);
    },
    [audio, setCurrentTime]
  );

  // Handle auto-play toggle
  const handleChangeAutoPlay = (checked: boolean) => {
    setAutoPlay(checked);
  };

  // Handle close button
  const handleClose = useCallback(() => {
    audio.pause();
    setIsPlaying(false);
    setPlayerVisible(false);
    setCurrentVerse(null);
  }, [audio, setIsPlaying, setPlayerVisible, setCurrentVerse]);

  // Handle minimize toggle
  const handleToggleMinimize = () => {
    setMinimized(!isMinimized);
  };

  return {
    audioElement: audio,
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
