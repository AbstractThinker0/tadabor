import { useEffect, useEffectEvent, useRef, useState } from "react";

import useQuran from "@/context/useQuran";
import { useAudioPageStore } from "@/store/pages/audioPage";

import { getVerseAudioURL } from "@/util/audioData";
import type { verseProps } from "quran-tools";

import ChaptersList from "@/components/Custom/ChaptersList";
import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";
import ReciterSelect from "@/components/Pages/Audio/ReciterSelect";

import { Sidebar } from "@/components/Generic/Sidebar";
import { ChapterHeader } from "@/components/Custom/ChapterHeader";

import { Box, HStack, Flex, Button } from "@chakra-ui/react";

import { Checkbox } from "@/components/ui/checkbox";

import { useTranslation } from "react-i18next";
import { usePageNav } from "@/hooks/usePageNav";

/**
 * Custom hook to prefetch audio for upcoming verses
 * @param currentRank - The rank of the currently playing verse
 * @param maxRank - The maximum rank in the current chapter (to avoid prefetching across chapters)
 * @param reciterId - The ID of the current reciter
 * @param count - Number of verses to prefetch ahead (default: 5)
 */
const useAudioPrefetch = (
  currentRank: number,
  maxRank: number,
  reciterId: string,
  count: number = 5
) => {
  const prefetchedAudio = useRef<Map<string, HTMLAudioElement>>(new Map());

  useEffect(() => {
    if (currentRank < 0) return;

    // Clamp count to not exceed chapter boundary
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
  }, [currentRank, maxRank, reciterId, count]);
};

const Audio = () => {
  usePageNav("nav.audio");
  const { i18n } = useTranslation();
  const direction = i18n.dir();

  const quranService = useQuran();
  const currentChapter = useAudioPageStore((state) => state.currentChapter);
  const currentVerse = useAudioPageStore((state) => state.currentVerse);
  const currentReciter = useAudioPageStore((state) => state.currentReciter);
  const isPlaying = useAudioPageStore((state) => state.isPlaying);
  const autoPlay = useAudioPageStore((state) => state.autoPlay);
  const duration = useAudioPageStore((state) => state.duration);
  const currentTime = useAudioPageStore((state) => state.currentTime);
  const setCurrentChapter = useAudioPageStore(
    (state) => state.setCurrentChapter
  );
  const setCurrentVerse = useAudioPageStore((state) => state.setCurrentVerse);
  const setIsPlaying = useAudioPageStore((state) => state.setIsPlaying);
  const setDuration = useAudioPageStore((state) => state.setDuration);
  const setCurrentTime = useAudioPageStore((state) => state.setCurrentTime);
  const setAutoPlaying = useAudioPageStore((state) => state.setAutoPlaying);

  const refAudio = useRef<HTMLAudioElement>(null);

  const [displayVerses, setDisplayVerses] = useState(
    quranService.getVerses(currentChapter)
  );

  // Calculate max rank for current chapter (last verse rank)
  const maxRankInChapter =
    displayVerses.length > 0 ? displayVerses[displayVerses.length - 1].rank : 0;

  // Prefetch next 5 verses audio
  useAudioPrefetch(currentVerse?.rank ?? -1, maxRankInChapter, currentReciter);

  const handleChapterChange = (chapter: string) => {
    setCurrentChapter(chapter);
    setDisplayVerses(quranService.getVerses(chapter));
  };

  const onClickAudio = (verse: verseProps) => {
    if (!refAudio.current) return;

    refAudio.current.src = getVerseAudioURL(verse.rank, currentReciter);
    setCurrentVerse(verse);
    refAudio.current.play();
    setIsPlaying(true);
  };

  const onLoadedMetadata = () => {
    if (!refAudio.current) return;

    setDuration(refAudio.current.duration);
  };

  const onTimeUpdate = () => {
    if (!refAudio.current) return;

    setCurrentTime(refAudio.current.currentTime);
  };

  const togglePlayPause = () => {
    if (!refAudio.current) return;

    if (isPlaying) {
      refAudio.current.pause();
    } else {
      refAudio.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!refAudio.current) return;

    const value = Number(e.target.value);
    refAudio.current.currentTime = value;
    setCurrentTime(value);
  };

  const playNextVerse = (reverse: boolean = false) => {
    // Check if a next verse is available
    const verseRank = currentVerse ? currentVerse.rank : -1;

    if (verseRank !== -1) {
      const nextRank = verseRank + (reverse ? -1 : 1);
      const nextVerse = quranService.absoluteQuran[nextRank];

      if (nextVerse && nextVerse.suraid === currentVerse?.suraid) {
        if (refAudio.current) {
          refAudio.current.src = getVerseAudioURL(nextRank, currentReciter);
          setCurrentVerse(nextVerse);
          refAudio.current.play();
          setIsPlaying(true);
          return true;
        }
      }
    }

    return false;
  };

  const onEnded = () => {
    if (autoPlay) {
      if (playNextVerse()) {
        return;
      }
    }

    setIsPlaying(false);
  };

  const onChapterChange = useEffectEvent(() => {
    if (!refAudio.current) return;

    const verseRank = quranService.getVerses(currentChapter)[0].rank;

    refAudio.current.src = getVerseAudioURL(verseRank, currentReciter);

    setCurrentVerse(displayVerses[0]);
    setIsPlaying(false);
  });

  useEffect(() => {
    onChapterChange();
  }, [currentChapter]);

  // Update audio source when reciter changes
  const onReciterChange = useEffectEvent(() => {
    if (!refAudio.current || !currentVerse) return;

    const wasPlaying = isPlaying;
    refAudio.current.src = getVerseAudioURL(currentVerse.rank, currentReciter);

    if (wasPlaying) {
      refAudio.current.play();
    }
  });

  useEffect(() => {
    onReciterChange();
  }, [currentReciter]);

  const onChangeAutoPlay = (checked: boolean) => {
    setAutoPlaying(checked);
    localStorage.setItem("audioAutoPlay", checked ? "true" : "false");
  };

  const onClickPrev = () => {
    playNextVerse(true);
  };

  const onClickNext = () => {
    playNextVerse();
  };

  const showSearchPanel = useAudioPageStore((state) => state.showSearchPanel);

  const showSearchPanelMobile = useAudioPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useAudioPageStore((state) => state.setSearchPanel);

  return (
    <Flex
      bgColor="brand.bg"
      flexWrap="nowrap"
      maxHeight="100%"
      height="100%"
      overflow="hidden"
    >
      <Sidebar
        isOpenMobile={showSearchPanelMobile}
        isOpenDesktop={showSearchPanel}
        setOpenState={setSearchPanel}
      >
        <Box paddingTop="8px" paddingInlineStart="8px" paddingInlineEnd="4px">
          <ChaptersList
            selectChapter={currentChapter}
            handleChapterChange={handleChapterChange}
          />
        </Box>
      </Sidebar>
      <Flex
        flexDirection="column"
        width="100%"
        height="100%"
        overflowY="hidden"
      >
        <ChapterDisplay
          verseKey={currentVerse?.key}
          displayVerses={displayVerses}
          onClickAudio={onClickAudio}
        />
        <Flex
          flexDirection="column"
          alignSelf="center"
          justifyContent="center"
          alignItems="center"
          dir="ltr"
          pt={1}
        >
          <audio
            ref={refAudio}
            src={getVerseAudioURL(0, currentReciter)}
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
            preload="auto"
          />
          <HStack>
            <input
              type="range"
              min="0"
              step={0.1}
              max={duration}
              value={currentTime}
              onChange={handleSliderChange}
            />

            <Checkbox
              direction={direction}
              gap="0.1rem"
              checked={autoPlay}
              onCheckedChange={(e) => onChangeAutoPlay(!!e.checked)}
            >
              🔁
            </Checkbox>
          </HStack>
          <HStack mt={1} gap="4px" paddingBottom="5px">
            <Button fontWeight="normal" onClick={onClickPrev}>
              prev
            </Button>
            <Button fontWeight="normal" onClick={togglePlayPause}>
              {isPlaying ? "Pause" : "Play"} [{currentVerse?.suraid}:
              {currentVerse?.verseid}]
            </Button>
            <Button fontWeight="normal" onClick={onClickNext}>
              next
            </Button>
            <ReciterSelect />
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
};

const ListTitle = () => {
  const selectChapter = useAudioPageStore((state) => state.currentChapter);

  const showSearchPanel = useAudioPageStore((state) => state.showSearchPanel);

  const showSearchPanelMobile = useAudioPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useAudioPageStore((state) => state.setSearchPanel);

  const onTogglePanel = (state: boolean) => {
    setSearchPanel(state);
  };

  return (
    <ChapterHeader
      chapterID={Number(selectChapter)}
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
    />
  );
};

interface ChapterDisplayProps {
  displayVerses: verseProps[];
  verseKey: string | undefined;
  onClickAudio: (verse: verseProps) => void;
}

const ChapterDisplay = ({
  displayVerses,
  verseKey,
  onClickAudio,
}: ChapterDisplayProps) => {
  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
      paddingTop="5px"
      paddingLeft="5px"
      paddingRight="5px"
      overflowY="hidden"
    >
      <ListTitle />
      <Box
        overflowY="scroll"
        padding="0.5rem"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="gray.emphasized"
        flexGrow={1}
        dir="rtl"
      >
        {displayVerses.map((verse) => (
          <VerseItem
            isSelected={verse.key === verseKey}
            key={verse.key}
            onClickAudio={onClickAudio}
            verse={verse}
          />
        ))}
      </Box>
    </Flex>
  );
};

interface VerseItemProps {
  verse: verseProps;
  isSelected: boolean;
  onClickAudio: (verse: verseProps) => void;
}

const VerseItem = ({ verse, isSelected, onClickAudio }: VerseItemProps) => {
  return (
    <BaseVerseItem
      verseKey={verse.key}
      isSelected={isSelected}
      rootProps={{ _selected: { bgColor: "green.emphasized" } }}
      endElement={
        <Button
          background="none"
          border="none"
          onClick={() => onClickAudio(verse)}
          width={"6px"}
          height={"36px"}
        >
          🔊
        </Button>
      }
    >
      {verse.versetext} ({verse.verseid}){" "}
    </BaseVerseItem>
  );
};

export default Audio;
