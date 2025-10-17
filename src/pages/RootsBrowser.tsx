import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";

import { rbPageActions } from "@/store/slices/pages/rootsBrowser";

import PanelRoots from "@/components/Pages/RootsBrowser/PanelRoots";

import PanelQuran from "@/components/Custom/PanelQuran";

import { Tabs } from "@chakra-ui/react";
import { usePageNav } from "@/hooks/usePageNav";

const RootsBrowser = () => {
  usePageNav("nav.roots");
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const verseTab = useAppSelector((state) => state.rbPage.verseTab);

  const scrollKey = useAppSelector((state) => state.rbPage.scrollKey);

  const tabIndex = useAppSelector((state) => state.rbPage.tabIndex);

  const setScrollKey = (key: string) => {
    dispatch(rbPageActions.setScrollKey(key));
  };

  const onChangeTab = (index: string) => {
    dispatch(rbPageActions.setTabIndex(index));
  };

  return (
    <Tabs.Root
      colorPalette={"blue"}
      value={tabIndex}
      onValueChange={(e) => onChangeTab(e.value)}
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
