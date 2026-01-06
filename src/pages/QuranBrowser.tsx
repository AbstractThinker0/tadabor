import { useQuranBrowserPageStore } from "@/store/zustand/quranBrowserPage";
import { Flex } from "@chakra-ui/react";

import SearchPanel from "@/components/Pages/QuranBrowser/SearchPanel";
import DisplayPanel from "@/components/Pages/QuranBrowser/DisplayPanel";

import { Sidebar } from "@/components/Generic/Sidebar";

import { usePageNav } from "@/hooks/usePageNav";

function QuranBrowser() {
  usePageNav("nav.browser");
  const showSearchPanel = useQuranBrowserPageStore(
    (state) => state.showSearchPanel
  );

  const showSearchPanelMobile = useQuranBrowserPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useQuranBrowserPageStore(
    (state) => state.setSearchPanel
  );

  return (
    <Flex bgColor="brand.bg" overflow="hidden" maxH="100%" h="100%">
      <Sidebar
        isOpenMobile={showSearchPanelMobile}
        isOpenDesktop={showSearchPanel}
        setOpenState={setSearchPanel}
      >
        <SearchPanel />
      </Sidebar>
      <DisplayPanel />
    </Flex>
  );
}

export default QuranBrowser;
