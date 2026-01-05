import { memo, useCallback } from "react";

import { useLettersPageStore } from "@/store/zustand/lettersPage";

import Display from "@/components/Pages/Letters/Display";
import ChaptersList from "@/components/Custom/ChaptersList";

import { Sidebar } from "@/components/Generic/Sidebar";

import { Box, Flex } from "@chakra-ui/react";

interface PanelQuranProps {
  isVisible: boolean;
}

const PanelQuran = memo(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_props: PanelQuranProps) => {
    const currentChapter = useLettersPageStore((state) => state.currentChapter);
    const setCurrentChapter = useLettersPageStore(
      (state) => state.setCurrentChapter
    );
    const setScrollKey = useLettersPageStore((state) => state.setScrollKey);

    const handleSelectChapter = useCallback(
      (chapterID: string) => {
        setCurrentChapter(chapterID);
        setScrollKey("");
      },
      [setCurrentChapter, setScrollKey]
    );

    const showSearchPanel = useLettersPageStore(
      (state) => state.showSearchPanel
    );

    const showSearchPanelMobile = useLettersPageStore(
      (state) => state.showSearchPanelMobile
    );

    const setSearchPanel = useLettersPageStore((state) => state.setSearchPanel);

    const setOpenState = (state: boolean) => {
      setSearchPanel(state);
    };

    return (
      <Flex overflow={"hidden"} maxH={"100%"} height={"100%"}>
        <Sidebar
          isOpenMobile={showSearchPanelMobile}
          isOpenDesktop={showSearchPanel}
          setOpenState={setOpenState}
        >
          <Box padding={1}>
            <ChaptersList
              selectChapter={currentChapter}
              handleChapterChange={handleSelectChapter}
            />
          </Box>
        </Sidebar>
        <Display />
      </Flex>
    );
  },
  (prevProps, nextProps) => {
    if (
      nextProps.isVisible === false &&
      prevProps.isVisible === nextProps.isVisible
    ) {
      return true;
    }
    return false;
  }
);

PanelQuran.displayName = "PanelQuran";

export default PanelQuran;
