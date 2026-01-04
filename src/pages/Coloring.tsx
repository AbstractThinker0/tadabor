import { useEffect } from "react";

import { useColoringPageStore } from "@/store/zustand/coloringPage";

import { Sidebar } from "@/components/Generic/Sidebar";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import VersesSide from "@/components/Pages/Coloring/VersesSide";
import ChaptersSide from "@/components/Pages/Coloring/ChaptersSide";
import { Flex } from "@chakra-ui/react";
import { usePageNav } from "@/hooks/usePageNav";
import { ErrorRefresh } from "@/components/Generic/ErrorRefresh";

function Coloring() {
  usePageNav("nav.coloring");

  const complete = useColoringPageStore((state) => state.complete);
  const error = useColoringPageStore((state) => state.error);
  const initializeColors = useColoringPageStore(
    (state) => state.initializeColors
  );

  useEffect(() => {
    initializeColors();
  }, [initializeColors]);

  const showSearchPanel = useColoringPageStore(
    (state) => state.showSearchPanel
  );

  const showSearchPanelMobile = useColoringPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useColoringPageStore((state) => state.setSearchPanel);

  const setOpenState = (state: boolean) => {
    setSearchPanel(state);
  };

  if (error) return <ErrorRefresh message="Failed to load coloring data." />;

  if (!complete) return <LoadingSpinner text="Loading colors data.." />;

  return (
    <Flex overflow={"hidden"} maxH={"100%"} h={"100%"} bgColor={"brand.bg"}>
      <Sidebar
        isOpenMobile={showSearchPanelMobile}
        isOpenDesktop={showSearchPanel}
        setOpenState={setOpenState}
      >
        <ChaptersSide />
      </Sidebar>
      <VersesSide />
    </Flex>
  );
}

export default Coloring;
