import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { fetchVerseNotes } from "@/store/slices/global/verseNotes";
import { searcherPageActions } from "@/store/slices/pages/searcher";

import PanelQuran from "@/components/Custom/PanelQuran";

import { Flex, Tab, TabList } from "@chakra-ui/react";

import {
  TabContent,
  TabsContainer,
  TabsPanels,
} from "@/components/Generic/Tabs";

import SearcherDisplay from "@/components/Pages/Searcher/SearcherDisplay";
import SearcherSide from "@/components/Pages/Searcher/SearcherSide";

const Searcher = () => {
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

  const onChangeTab = (index: number) => {
    dispatch(searcherPageActions.setTabIndex(index));
  };

  return (
    <TabsContainer onChange={onChangeTab} index={tabIndex} isLazy>
      <TabList>
        <Tab>{t("searcher_search")}</Tab>

        <Tab hidden={!verseTab}>{verseTab}</Tab>
      </TabList>
      <TabsPanels>
        <TabContent>
          <Flex gap={"10px"} overflow={"hidden"} maxH={"100%"} h={"100%"}>
            <SearcherSide />
            <SearcherDisplay />
          </Flex>
        </TabContent>
        <TabContent>
          <PanelQuran
            verseKey={verseTab}
            scrollKey={scrollKey}
            setScrollKey={setScrollKey}
          />
        </TabContent>
      </TabsPanels>
    </TabsContainer>
  );
};

export default Searcher;
