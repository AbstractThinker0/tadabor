import { useTranslationPageStore } from "@/store/pages/translationPage";

import { Box, Flex } from "@chakra-ui/react";

import { Sidebar } from "@/components/Generic/Sidebar";

import ChaptersList from "@/components/Custom/ChaptersList";
import DisplayPanel from "@/components/Pages/Translation/DisplayPanel";

import { usePageNav } from "@/hooks/usePageNav";

const Translation = () => {
  usePageNav("nav.translation");
  const currentChapter = useTranslationPageStore(
    (state) => state.currentChapter
  );
  const setCurrentChapter = useTranslationPageStore(
    (state) => state.setCurrentChapter
  );
  const showSearchPanel = useTranslationPageStore(
    (state) => state.showSearchPanel
  );
  const showSearchPanelMobile = useTranslationPageStore(
    (state) => state.showSearchPanelMobile
  );
  const setSearchPanel = useTranslationPageStore(
    (state) => state.setSearchPanel
  );

  const handleChapterChange = (chapter: string) => {
    setCurrentChapter(chapter);
  };

  const setOpenState = (state: boolean) => {
    setSearchPanel(state);
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
