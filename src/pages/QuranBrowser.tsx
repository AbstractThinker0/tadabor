import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";
import { Flex, useBreakpointValue } from "@chakra-ui/react";

import SearchPanel from "@/components/Pages/QuranBrowser/SearchPanel";
import DisplayPanel from "@/components/Pages/QuranBrowser/DisplayPanel";

import { Sidebar } from "@/components/Generic/Sidebar";

import { usePageNav } from "@/hooks/usePageNav";

function QuranBrowser() {
  usePageNav("nav_browser");
  const dispatch = useAppDispatch();

  const showSearchPanel = useAppSelector(
    (state) => state.qbPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.qbPage.showSearchPanelMobile
  );

  // Use Chakra's breakpoint to determine if it's mobile
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isOpen = isMobile ? showSearchPanelMobile : showSearchPanel;
  const setOpenState = (state: boolean) => {
    dispatch(qbPageActions.setSearchPanel(state));
  };

  return (
    <Flex bgColor="brand.bg" overflow="hidden" maxH="100%" h="100%">
      <Sidebar isOpen={isOpen} setOpenState={setOpenState}>
        <SearchPanel />
      </Sidebar>
      <DisplayPanel />
    </Flex>
  );
}

export default QuranBrowser;
