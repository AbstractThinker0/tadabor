import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";

import { rbPageActions } from "@/store/slices/pages/rootsBrowser";

import PanelRoots from "@/components/Pages/RootsBrowser/PanelRoots";

import PanelQuran from "@/components/Custom/PanelQuran";

import { Tab, TabList } from "@chakra-ui/react";

import {
  TabContent,
  TabsContainer,
  TabsPanels,
} from "@/components/Generic/Tabs";

const RootsBrowser = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const verseTab = useAppSelector((state) => state.rbPage.verseTab);

  const scrollKey = useAppSelector((state) => state.rbPage.scrollKey);

  const tabIndex = useAppSelector((state) => state.rbPage.tabIndex);

  const setScrollKey = (key: string) => {
    dispatch(rbPageActions.setScrollKey(key));
  };

  const onChangeTab = (index: number) => {
    dispatch(rbPageActions.setTabIndex(index));
  };

  return (
    <TabsContainer onChange={onChangeTab} index={tabIndex} isLazy>
      <TabList>
        <Tab>{t("searcher_search")}</Tab>

        <Tab hidden={!verseTab}>{verseTab}</Tab>
      </TabList>

      <TabsPanels>
        <TabContent>
          <PanelRoots />
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

export default RootsBrowser;
