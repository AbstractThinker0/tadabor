import { useTranslation } from "react-i18next";

import { useRootsBrowserPageStore } from "@/store/zustand/rootsBrowserPage";

import PanelRoots from "@/components/Pages/RootsBrowser/PanelRoots";

import PanelQuran from "@/components/Custom/PanelQuran";

import { Tabs } from "@chakra-ui/react";
import { usePageNav } from "@/hooks/usePageNav";

const RootsBrowser = () => {
  usePageNav("nav.roots");
  const { t } = useTranslation();
  const verseTab = useRootsBrowserPageStore((state) => state.verseTab);
  const scrollKey = useRootsBrowserPageStore((state) => state.scrollKey);
  const tabIndex = useRootsBrowserPageStore((state) => state.tabIndex);
  const setScrollKey = useRootsBrowserPageStore((state) => state.setScrollKey);
  const setTabIndex = useRootsBrowserPageStore((state) => state.setTabIndex);

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
        <Tabs.Trigger value="rootsTab">{t("searcher_search")}</Tabs.Trigger>

        <Tabs.Trigger value="verseTab" hidden={!verseTab}>
          {verseTab}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.ContentGroup>
        <Tabs.Content
          overflow="hidden"
          maxH="100%"
          h="100%"
          display={"flex"}
          flexDirection={"column"}
          value="rootsTab"
        >
          <PanelRoots />
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
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
};

export default RootsBrowser;
