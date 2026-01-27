import { useState } from "react";
import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import type { verseProps } from "quran-tools";
import { useTranslation } from "react-i18next";

import ReciterSelect from "@/components/Pages/Audio/ReciterSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { getVerseAudioURL } from "@/util/audioData";

interface AudioPlayerProps {
  refAudio: React.RefObject<HTMLAudioElement | null>;
  currentVerse: verseProps | null;
  currentReciter: string;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  autoPlay: boolean;
  onLoadedMetadata: () => void;
  onTimeUpdate: () => void;
  onEnded: () => void;
  onClickPrev: () => void;
  onClickNext: () => void;
  onTogglePlayPause: () => void;
  onSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeAutoPlay: (checked: boolean) => void;
}

const AudioPlayer = ({
  refAudio,
  currentVerse,
  currentReciter,
  isPlaying,
  duration,
  currentTime,
  autoPlay,
  onLoadedMetadata,
  onTimeUpdate,
  onEnded,
  onClickPrev,
  onClickNext,
  onTogglePlayPause,
  onSliderChange,
  onChangeAutoPlay,
}: AudioPlayerProps) => {
  const { i18n } = useTranslation();
  const direction = i18n.dir();
  const [isMinimized, setIsMinimized] = useState(false);

  const verseLabel = currentVerse
    ? `${currentVerse.suraid}:${currentVerse.verseid}`
    : "--";

  return (
    <Flex
      flexDirection="column"
      alignSelf="center"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      bottom="16px"
      insetEnd={isMinimized ? "16px" : "0%"}
      zIndex="toast"
      width={isMinimized ? "auto" : "100%"}
    >
      <Flex
        bgColor="bg"
        border="1px solid"
        borderColor="border"
        borderRadius="6px"
        boxShadow="md"
        p="8px"
        dir="ltr"
        flexDirection={"column"}
        flexGrow={1}
        alignSelf="center"
        justifyContent="center"
        alignItems="center"
        maxW="95vw"
        width={isMinimized ? "auto" : "100%"}
      >
        <audio
          ref={refAudio}
          src={getVerseAudioURL(0, currentReciter)}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          preload="auto"
        />
        {isMinimized && (
          <Flex alignItems="center" justifyContent="space-between" gap={1}>
            <Button fontWeight="normal" size="sm" onClick={onTogglePlayPause}>
              {isPlaying ? "Pause" : "Play"} [{verseLabel}]
            </Button>

            <Button fontWeight="normal" size="sm" onClick={onClickNext}>
              next
            </Button>

            <Button
              fontWeight="normal"
              size="sm"
              onClick={() => setIsMinimized(false)}
            >
              Expand
            </Button>
          </Flex>
        )}
        {!isMinimized && (
          <>
            <HStack justifyContent="space-between" width="100%">
              <Box></Box>
              <HStack>
                <input
                  type="range"
                  min="0"
                  step={0.1}
                  max={duration}
                  value={currentTime}
                  onChange={onSliderChange}
                />
                <Checkbox
                  direction={direction}
                  gap={0}
                  checked={autoPlay}
                  onCheckedChange={(e) => onChangeAutoPlay(!!e.checked)}
                >
                  🔁
                </Checkbox>
              </HStack>
              <Button
                fontWeight="normal"
                size="xs"
                onClick={() => setIsMinimized((prev) => !prev)}
              >
                Minimize
              </Button>
            </HStack>
            <HStack mt={2} gap="4px">
              <Button fontWeight="normal" size="sm" onClick={onClickPrev}>
                prev
              </Button>
              <Button fontWeight="normal" size="sm" onClick={onTogglePlayPause}>
                {isPlaying ? "Pause" : "Play"} [{verseLabel}]
              </Button>
              <Button fontWeight="normal" size="sm" onClick={onClickNext}>
                next
              </Button>
              <ReciterSelect />
            </HStack>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default AudioPlayer;
