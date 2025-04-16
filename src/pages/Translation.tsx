import { useEffect } from "react";

import { isTransNotesLoading, useAppDispatch, useAppSelector } from "@/store";
import { fetchTransNotes } from "@/store/slices/global/transNotes";
import { translationPageActions } from "@/store/slices/pages/translation";

import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import { Sidebar } from "@/components/Generic/Sidebar";

import ChaptersList from "@/components/Custom/ChaptersList";
import DisplayPanel from "@/components/Pages/Translation/DisplayPanel";

import { usePageNav } from "@/hooks/usePageNav";

const Translation = () => {
  usePageNav("nav_translation");
  const dispatch = useAppDispatch();

  const isTNotesLoading = useAppSelector(isTransNotesLoading());

  const currentChapter = useAppSelector(
    (state) => state.translationPage.currentChapter
  );

  useEffect(() => {
    dispatch(fetchTransNotes());
  }, []);

  const handleChapterChange = (chapter: string) => {
    dispatch(translationPageActions.setCurrentChapter(chapter));
  };

  const showSearchPanel = useAppSelector(
    (state) => state.translationPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.translationPage.showSearchPanelMobile
  );

  // Use Chakra's breakpoint to determine if it's mobile
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isOpen = isMobile ? showSearchPanelMobile : showSearchPanel;
  const setOpenState = (state: boolean) => {
    dispatch(translationPageActions.setSearchPanel(state));
  };

  return (
    <Flex
      bgColor={"brand.bg"}
      overflow={"hidden"}
      maxH={"100%"}
      height={"100%"}
    >
      <Sidebar isOpen={isOpen} setOpenState={setOpenState}>
        <Box padding={1}>
          <ChaptersList
            handleChapterChange={handleChapterChange}
            selectChapter={currentChapter}
          />
        </Box>
      </Sidebar>
      {isTNotesLoading ? <LoadingSpinner /> : <DisplayPanel />}
    </Flex>
  );
};

export default Translation;
