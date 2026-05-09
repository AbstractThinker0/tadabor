import { useEffect, useState, useTransition } from "react";

import { useQuran } from "@/context/useQuran";
import { useAudioPageStore } from "@/store/pages/audioPage";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

import type { verseProps } from "quran-tools";

import { ChaptersList } from "@/components/Custom/ChaptersList";
import { BaseVerseItem } from "@/components/Custom/BaseVerseItem";

import { Sidebar } from "@/components/Generic/Sidebar";
import { LoadingSpinner } from "@/components/Generic/LoadingSpinner";
import { ChapterHeader } from "@/components/Custom/ChapterHeader";

import { Box, Flex, Button } from "@chakra-ui/react";

import { usePageNav } from "@/hooks/usePageNav";

const Audio = () => {
  usePageNav("nav.audio");

  const audioPlayer = useAudioPlayer();

  const currentChapter = useAudioPageStore((state) => state.currentChapter);
  const setCurrentChapter = useAudioPageStore(
    (state) => state.setCurrentChapter
  );

  const handleChapterChange = (chapter: string) => {
    setCurrentChapter(chapter);
  };

  const onClickAudio = (verse: verseProps) => {
    audioPlayer.playVerse(verse);
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
          currentChapter={currentChapter}
          verseKey={audioPlayer.currentVerse?.key}
          onClickAudio={onClickAudio}
        />
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
  currentChapter: string;
  verseKey: string | undefined;
  onClickAudio: (verse: verseProps) => void;
}

const ChapterDisplay = ({
  currentChapter,
  verseKey,
  onClickAudio,
}: ChapterDisplayProps) => {
  const quranService = useQuran();

  const [displayVerses, setDisplayVerses] = useState<verseProps[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setDisplayVerses(quranService.getVerses(currentChapter));
    });
  }, [currentChapter, quranService]);

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
      {isPending ? (
        <LoadingSpinner />
      ) : (
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
      )}
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
