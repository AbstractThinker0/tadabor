import { Button, Flex, HStack, IconButton } from "@chakra-ui/react";

import { useTranslation } from "react-i18next";
import { LuX } from "react-icons/lu";

import ReciterSelect from "@/components/Pages/Audio/ReciterSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useAudioPlayerStore } from "@/store/global/audioPlayerStore";

const AudioPlayer = () => {
  const isPlayerVisible = useAudioPlayerStore((state) => state.isPlayerVisible);

  const currentVerse = useAudioPlayerStore((state) => state.currentVerse);
  const isPlaying = useAudioPlayerStore((state) => state.isPlaying);
  const autoPlay = useAudioPlayerStore((state) => state.autoPlay);
  const duration = useAudioPlayerStore((state) => state.duration);
  const currentTime = useAudioPlayerStore((state) => state.currentTime);
  const isMinimized = useAudioPlayerStore((state) => state.isMinimized);

  const {
    playPrevVerse,
    playNextVerse,
    togglePlayPause,
    handleSliderChange,
    handleChangeAutoPlay,
    handleClose,
    handleToggleMinimize,
  } = useAudioPlayer();
  const { i18n } = useTranslation();
  const direction = i18n.dir();

  const verseLabel = currentVerse
    ? `${currentVerse.suraid}:${currentVerse.verseid}`
    : "--";

  if (!isPlayerVisible) {
    return null;
  }

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
        {/* Audio element is now managed by useAudioPlayer hook as a singleton */}
        {isMinimized && (
          <Flex alignItems="center" justifyContent="space-between" gap={1}>
            <Button fontWeight="normal" size="sm" onClick={togglePlayPause}>
              {isPlaying ? "Pause" : "Play"} [{verseLabel}]
            </Button>

            <Button fontWeight="normal" size="sm" onClick={playNextVerse}>
              next
            </Button>

            <Button
              fontWeight="normal"
              size="sm"
              onClick={handleToggleMinimize}
            >
              Expand
            </Button>

            <IconButton
              size="sm"
              variant="ghost"
              onClick={handleClose}
              aria-label="Close player"
            >
              <LuX />
            </IconButton>
          </Flex>
        )}
        {!isMinimized && (
          <>
            <HStack justifyContent="space-between" width="100%">
              <IconButton
                size="xs"
                variant="ghost"
                onClick={handleClose}
                aria-label="Close player"
              >
                <LuX />
              </IconButton>
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
                  gap={0}
                  checked={autoPlay}
                  onCheckedChange={(e) => handleChangeAutoPlay(!!e.checked)}
                >
                  🔁
                </Checkbox>
              </HStack>
              <Button
                fontWeight="normal"
                size="xs"
                onClick={handleToggleMinimize}
              >
                Minimize
              </Button>
            </HStack>
            <HStack mt={2} gap="4px">
              <Button fontWeight="normal" size="sm" onClick={playPrevVerse}>
                prev
              </Button>
              <Button fontWeight="normal" size="sm" onClick={togglePlayPause}>
                {isPlaying ? "Pause" : "Play"} [{verseLabel}]
              </Button>
              <Button fontWeight="normal" size="sm" onClick={playNextVerse}>
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
