import { memo, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/store";

import { lettersPageActions } from "@/store/slices/pages/letters";

import Display from "@/components/Pages/Letters/Display";
import ChaptersList from "@/components/Custom/ChaptersList";

import { Sidebar } from "@/components/Generic/Sidebar";

import { Box, Flex } from "@chakra-ui/react";

interface PanelQuranProps {
  isVisible: boolean;
}

const PanelQuran = memo(
  ({ isVisible }: PanelQuranProps) => {
    const dispatch = useAppDispatch();
    const currentChapter = useAppSelector(
      (state) => state.lettersPage.currentChapter
    );

    const handleSelectChapter = useCallback((chapterID: string) => {
      dispatch(lettersPageActions.setCurrentChapter(chapterID));
      dispatch(lettersPageActions.setScrollKey(""));
    }, []);

    const showSearchPanel = useAppSelector(
      (state) => state.lettersPage.showSearchPanel
    );

    const showSearchPanelMobile = useAppSelector(
      (state) => state.lettersPage.showSearchPanelMobile
    );

    const setOpenState = (state: boolean) => {
      dispatch(lettersPageActions.setSearchPanel(state));
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
