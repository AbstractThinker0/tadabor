import { useEffect, useRef, useState } from "react";

import useQuran from "@/context/useQuran";

import { useAppSelector, useAppDispatch } from "@/store";
import { audioPageActions } from "@/store/slices/pages/audio";

import { getVerseAudioURL } from "@/util/audioData";
import { verseProps } from "@/types";

import ChaptersList from "@/components/Custom/ChaptersList";
import VerseContainer from "@/components/Custom/VerseContainer";

import { ButtonExpand } from "@/components/Generic/Buttons";

import { Box, HStack, Flex, Heading, Button } from "@chakra-ui/react";

import { Checkbox } from "@/components/ui/checkbox";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";

import { useBoolean } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { usePageNav } from "@/components/Custom/usePageNav";

const Audio = () => {
  usePageNav("nav_audio");
  const { i18n } = useTranslation();
  const direction = i18n.dir();

  const dispatch = useAppDispatch();

  const quranService = useQuran();

  const currentChapter = useAppSelector(
    (state) => state.audioPage.currentChapter
  );

  const currentVerse = useAppSelector((state) => state.audioPage.currentVerse);

  const isPlaying = useAppSelector((state) => state.audioPage.isPlaying);

  const autoPlay = useAppSelector((state) => state.audioPage.autoPlay);

  const duration = useAppSelector((state) => state.audioPage.duration);

  const currentTime = useAppSelector((state) => state.audioPage.currentTime);

  const refAudio = useRef<HTMLAudioElement>(null);

  const [displayVerses, setDisplayVerses] = useState(
    quranService.getVerses(currentChapter)
  );

  const handleChapterChange = (chapter: string) => {
    dispatch(audioPageActions.setCurrentChapter(chapter));
    dispatch(audioPageActions.setCurrentVerse(displayVerses[0]));
  };

  const onClickAudio = (verse: verseProps) => {
    if (!refAudio.current) return;

    refAudio.current.src = getVerseAudioURL(verse.rank);
    dispatch(audioPageActions.setCurrentVerse(verse));
    refAudio.current.play();
    dispatch(audioPageActions.setIsPlaying(true));
  };

  const onLoadedMetadata = () => {
    if (!refAudio.current) return;

    dispatch(audioPageActions.setDuration(refAudio.current.duration));
  };

  const onTimeUpdate = () => {
    if (!refAudio.current) return;

    dispatch(audioPageActions.setCurrentTime(refAudio.current.currentTime));
  };

  const togglePlayPause = () => {
    if (!refAudio.current) return;

    if (isPlaying) {
      refAudio.current.pause();
    } else {
      refAudio.current.play();
    }

    dispatch(audioPageActions.setIsPlaying(!isPlaying));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!refAudio.current) return;

    const value = Number(e.target.value);
    refAudio.current.currentTime = value;
    dispatch(audioPageActions.setCurrentTime(value));
  };

  const playNextVerse = (reverse: boolean = false) => {
    // Check if a next verse is available
    const verseRank = currentVerse ? currentVerse.rank : -1;

    if (verseRank !== -1) {
      const nextRank = verseRank + (reverse ? -1 : 1);
      const nextVerse = quranService.absoluteQuran[nextRank];

      if (nextVerse && nextVerse.suraid === currentVerse?.suraid) {
        if (refAudio.current) {
          refAudio.current.src = getVerseAudioURL(nextRank);
          dispatch(audioPageActions.setCurrentVerse(nextVerse));
          refAudio.current.play();
          dispatch(audioPageActions.setIsPlaying(true));
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

    dispatch(audioPageActions.setIsPlaying(false));
  };

  useEffect(() => {
    setDisplayVerses(quranService.getVerses(currentChapter));
    if (!refAudio.current) return;

    const verseRank = quranService.getVerses(currentChapter)[0].rank;

    refAudio.current.src = getVerseAudioURL(verseRank);

    dispatch(audioPageActions.setCurrentVerse(displayVerses[0]));
    dispatch(audioPageActions.setIsPlaying(false));
  }, [currentChapter]);

  const onChangeAutoPlay = (checked: boolean) => {
    dispatch(audioPageActions.setAutoPlaying(checked));
    localStorage.setItem("audioAutoPlay", checked ? "true" : "false");
  };

  const onClickPrev = () => {
    playNextVerse(true);
  };

  const onClickNext = () => {
    playNextVerse();
  };

  return (
    <Flex
      bgColor="brand.bg"
      flexWrap="nowrap"
      maxHeight="100%"
      height="100%"
      overflow="hidden"
    >
      <Flex paddingTop="8px" paddingInlineStart="8px" paddingInlineEnd="4px">
        <ChaptersList
          selectChapter={currentChapter}
          handleChapterChange={handleChapterChange}
        />
      </Flex>
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
          currentChapter={currentChapter}
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
            src={getVerseAudioURL(0)}
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
          <Flex mt={1} gap="4px" paddingBottom="5px">
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
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

interface ChapterDisplayProps {
  currentChapter: string;
  displayVerses: verseProps[];
  verseKey: string | undefined;
  onClickAudio: (verse: verseProps) => void;
}

const ChapterDisplay = ({
  currentChapter,
  displayVerses,
  verseKey,
  onClickAudio,
}: ChapterDisplayProps) => {
  const quranService = useQuran();

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
      paddingTop="5px"
      paddingLeft="5px"
      paddingRight="5px"
      overflowY="hidden"
      dir="rtl"
    >
      <Heading
        fontSize="x-large"
        color="purple.fg"
        bgColor="gray.subtle"
        borderRadius="0.3rem"
        borderStyle="solid"
        borderWidth="1px"
        borderColor="gray.emphasized"
        borderBottomRadius={"unset"}
        textAlign="center"
        marginBottom="0"
        padding={2}
      >
        سورة {quranService.getChapterName(currentChapter)}
      </Heading>
      <Box
        overflowY="scroll"
        padding="0.5rem"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="gray.emphasized"
        flexGrow={1}
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
  const { value: isOpen, toggle: setOpen } = useBoolean();

  return (
    <Box
      padding="5px"
      borderBottom="1px solid"
      borderColor={"gray.emphasized"}
      aria-selected={isSelected}
      _selected={{ bgColor: "green.emphasized" }}
    >
      <VerseContainer>
        {verse.versetext} ({verse.verseid}){" "}
        <Button
          background="none"
          border="none"
          onClick={() => onClickAudio(verse)}
        >
          🔊
        </Button>
        <ButtonExpand onClick={setOpen} />
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verse.key} />
    </Box>
  );
};

export default Audio;
