import { useTranslation } from "react-i18next";

import { useSearcherPageStore } from "@/store/zustand/searcherPage";

import PanelQuran from "@/components/Custom/PanelQuran";
import { Sidebar } from "@/components/Generic/Sidebar";

import { Flex, Tabs } from "@chakra-ui/react";

import SearcherDisplay from "@/components/Pages/Searcher/SearcherDisplay";
import SearcherSide from "@/components/Pages/Searcher/SearcherSide";
import { usePageNav } from "@/hooks/usePageNav";

const Searcher = () => {
  usePageNav("nav.searcher");
  const { t } = useTranslation();
  const tabIndex = useSearcherPageStore((state) => state.tabIndex);
  const verseTab = useSearcherPageStore((state) => state.verseTab);
  const scrollKey = useSearcherPageStore((state) => state.scrollKey);
  const setScrollKey = useSearcherPageStore((state) => state.setScrollKey);
  const setTabIndex = useSearcherPageStore((state) => state.setTabIndex);
  const showSearchPanel = useSearcherPageStore(
    (state) => state.showSearchPanel
  );
  const showSearchPanelMobile = useSearcherPageStore(
    (state) => state.showSearchPanelMobile
  );
  const setSearchPanel = useSearcherPageStore((state) => state.setSearchPanel);

  return (
    <Tabs.Root
      colorPalette={"blue"}
      value={tabIndex}
      onValueChange={(e) => setTabIndex(e.value)}
      bgColor={"brand.bg"}
      overflow="hidden"
      maxH="100%"
      h="100%"
      display={"flex"}
      flexDirection={"column"}
      lazyMount
      unmountOnExit
    >
      <Tabs.List>
        <Tabs.Trigger value="searcherTab">{t("searcher_search")}</Tabs.Trigger>

        <Tabs.Trigger value="verseTab" hidden={!verseTab}>
          {verseTab}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content
        overflow="hidden"
        maxH="100%"
        h="100%"
        display={"flex"}
        flexDirection={"column"}
        value="searcherTab"
      >
        <Flex gap={"5px"} overflow={"hidden"} maxH={"100%"} h={"100%"}>
          <Sidebar
            isOpenMobile={showSearchPanelMobile}
            isOpenDesktop={showSearchPanel}
            setOpenState={setSearchPanel}
          >
            <SearcherSide />
          </Sidebar>
          <SearcherDisplay />
        </Flex>
      </Tabs.Content>

      <Tabs.Content
        overflow="hidden"
        maxH="100%"
        h="100%"
        display={"flex"}
        flexDirection={"column"}
        value="verseTab"
      >
        <PanelQuran
          verseKey={verseTab}
          scrollKey={scrollKey}
          setScrollKey={setScrollKey}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default Searcher;
