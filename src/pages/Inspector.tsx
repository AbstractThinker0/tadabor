import { useInspectorPageStore } from "@/store/pages/inspectorPage";

import ChaptersList from "@/components/Custom/ChaptersList";

import { Sidebar } from "@/components/Generic/Sidebar";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import Display from "@/components/Pages/Inspector/Display";

import { Box, Flex } from "@chakra-ui/react";
import { usePageNav } from "@/hooks/usePageNav";
import { useRootsLoaded } from "@/hooks/useRootsLoaded";

function Inspector() {
  usePageNav("nav.inspector");
  const currentChapter = useInspectorPageStore((state) => state.currentChapter);
  const setCurrentChapter = useInspectorPageStore(
    (state) => state.setCurrentChapter
  );
  const setScrollKey = useInspectorPageStore((state) => state.setScrollKey);
  const showSearchPanel = useInspectorPageStore(
    (state) => state.showSearchPanel
  );
  const showSearchPanelMobile = useInspectorPageStore(
    (state) => state.showSearchPanelMobile
  );
  const setSearchPanel = useInspectorPageStore((state) => state.setSearchPanel);

  const rootsLoaded = useRootsLoaded();

  function handleSelectChapter(chapterID: string) {
    setCurrentChapter(chapterID);
    setScrollKey("");
  }

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
        setOpenState={setSearchPanel}
      >
        <Box px={"5px"} paddingTop={"8px"}>
          <ChaptersList
            selectChapter={currentChapter}
            handleChapterChange={handleSelectChapter}
          />
        </Box>
      </Sidebar>
      {!rootsLoaded ? (
        <LoadingSpinner text="Loading data.." />
      ) : (
        <Display currentChapter={currentChapter} />
      )}
    </Flex>
  );
}

export default Inspector;
