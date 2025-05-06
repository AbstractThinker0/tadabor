import { useAppDispatch, useAppSelector } from "@/store";

import { translationPageActions } from "@/store/slices/pages/translation";

import { Box, Flex } from "@chakra-ui/react";

import { Sidebar } from "@/components/Generic/Sidebar";

import ChaptersList from "@/components/Custom/ChaptersList";
import DisplayPanel from "@/components/Pages/Translation/DisplayPanel";

import { usePageNav } from "@/hooks/usePageNav";

const Translation = () => {
  usePageNav("nav_translation");
  const dispatch = useAppDispatch();

  const currentChapter = useAppSelector(
    (state) => state.translationPage.currentChapter
  );

  const handleChapterChange = (chapter: string) => {
    dispatch(translationPageActions.setCurrentChapter(chapter));
  };

  const showSearchPanel = useAppSelector(
    (state) => state.translationPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.translationPage.showSearchPanelMobile
  );

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
      <Sidebar
        isOpenMobile={showSearchPanelMobile}
        isOpenDesktop={showSearchPanel}
        setOpenState={setOpenState}
      >
        <Box padding={1}>
          <ChaptersList
            handleChapterChange={handleChapterChange}
            selectChapter={currentChapter}
          />
        </Box>
      </Sidebar>
      <DisplayPanel />
    </Flex>
  );
};

export default Translation;
