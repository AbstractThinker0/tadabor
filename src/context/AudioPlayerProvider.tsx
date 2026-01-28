import { useRef, useEffect, type PropsWithChildren } from "react";

import { AudioPlayerContext } from "@/context/AudioPlayerContext";
import useQuran from "@/context/useQuran";
import { useAudioPlayerStore } from "@/store/global/audioPlayerStore";
import { getVerseAudioURL } from "@/util/audioData";
import AudioPlayer from "@/components/Pages/Audio/AudioPlayer";

/**
 * Custom hook to prefetch audio for upcoming verses
 */
const useAudioPrefetch = (
  currentRank: number,
  reciterId: string,
  count: number = 5
) => {
  const prefetchedAudio = useRef<Map<string, HTMLAudioElement>>(new Map());
  const quranService = useQuran();

  useEffect(() => {
    if (currentRank < 0) return;

    const maxRank = quranService.absoluteQuran.length - 1;
    const effectiveCount = Math.min(count, maxRank - currentRank);

    // Prefetch audio for upcoming verses
    for (let i = 1; i <= effectiveCount; i++) {
      const rank = currentRank + i;
      const cacheKey = `${reciterId}-${rank}`;
      if (!prefetchedAudio.current.has(cacheKey)) {
        const audio = new window.Audio();
        audio.preload = "auto";
        audio.src = getVerseAudioURL(rank, reciterId);
        prefetchedAudio.current.set(cacheKey, audio);
      }
    }

    // Cleanup: remove audio that's too far behind or ahead or different reciter
    const minKeep = currentRank - 2;
    const maxKeep = currentRank + count + 2;

    prefetchedAudio.current.forEach((audio, cacheKey) => {
      const [cachedReciter, rankStr] = cacheKey.split("-");
      const rank = parseInt(rankStr, 10);
      if (cachedReciter !== reciterId || rank < minKeep || rank > maxKeep) {
        audio.src = "";
        prefetchedAudio.current.delete(cacheKey);
      }
    });
  }, [currentRank, reciterId, count, quranService.absoluteQuran.length]);
};

export const AudioPlayerProvider = ({ children }: PropsWithChildren) => {
  const quranService = useQuran();

  // Create and store the audio element in a ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element once
  if (!audioRef.current && typeof window !== "undefined") {
    audioRef.current = new Audio();
    audioRef.current.preload = "auto";
  }

  const audio = audioRef.current!;

  // Global store selectors
  const currentVerse = useAudioPlayerStore((state) => state.currentVerse);
  const currentReciter = useAudioPlayerStore((state) => state.currentReciter);
  const isPlaying = useAudioPlayerStore((state) => state.isPlaying);
  const autoPlay = useAudioPlayerStore((state) => state.autoPlay);

  // Store actions
  const setCurrentVerse = useAudioPlayerStore((state) => state.setCurrentVerse);
  const setIsPlaying = useAudioPlayerStore((state) => state.setIsPlaying);
  const setDuration = useAudioPlayerStore((state) => state.setDuration);
  const setCurrentTime = useAudioPlayerStore((state) => state.setCurrentTime);

  // Prefetch upcoming audio
  useAudioPrefetch(currentVerse?.rank ?? -1, currentReciter);

  // Setup audio event listeners
  useEffect(() => {
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (autoPlay) {
        const verseRank = currentVerse ? currentVerse.rank : -1;
        if (verseRank !== -1) {
          const nextRank = verseRank + 1;
          const nextVerse = quranService.absoluteQuran[nextRank];
          if (nextVerse) {
            audio.src = getVerseAudioURL(nextRank, currentReciter);
            setCurrentVerse(nextVerse);
            audio.play();
            setIsPlaying(true);
            return;
          }
        }
      }
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [
    audio,
    autoPlay,
    currentVerse,
    currentReciter,
    quranService.absoluteQuran,
    setDuration,
    setCurrentTime,
    setCurrentVerse,
    setIsPlaying,
  ]);

  // Update audio source when reciter changes
  useEffect(() => {
    if (!currentVerse) return;

    const wasPlaying = isPlaying;
    audio.src = getVerseAudioURL(currentVerse.rank, currentReciter);

    if (wasPlaying) {
      audio.play();
    }
  }, [audio, currentReciter, currentVerse, isPlaying]);

  return (
    <AudioPlayerContext.Provider value={{ audioElement: audio }}>
      {children}
      <AudioPlayer />
    </AudioPlayerContext.Provider>
  );
};
