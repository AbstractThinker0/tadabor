import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { searcherPageActions } from "@/store/slices/pages/searcher";

import PanelQuran from "@/components/Custom/PanelQuran";

import { Flex, Tabs } from "@chakra-ui/react";

import SearcherDisplay from "@/components/Pages/Searcher/SearcherDisplay";
import SearcherSide from "@/components/Pages/Searcher/SearcherSide";
import { usePageNav } from "@/hooks/usePageNav";

const Searcher = () => {
  usePageNav("nav_searcher");
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const tabIndex = useAppSelector((state) => state.searcherPage.tabIndex);

  const verseTab = useAppSelector((state) => state.searcherPage.verseTab);

  const scrollKey = useAppSelector((state) => state.searcherPage.scrollKey);

  useEffect(() => {
    dispatch(fetchVerseNotes());
  }, []);

  const setScrollKey = (key: string) => {
    dispatch(searcherPageActions.setScrollKey(key));
  };

  const onChangeTab = (index: string) => {
    dispatch(searcherPageActions.setTabIndex(index));
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
          <SearcherSide />
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
