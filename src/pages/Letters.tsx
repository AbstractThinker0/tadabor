import { memo } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { lettersPageActions } from "@/store/slices/pages/letters";

import PanelDefinitions from "@/components/Pages/Letters/PanelDefinitions";
import PanelQuran from "@/components/Pages/Letters/PanelQuran";

import { Tab, TabList } from "@chakra-ui/react";

import {
  TabContent,
  TabsContainer,
  TabsPanels,
} from "@/components/Generic/Tabs";

const Letters = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const tabIndex = useAppSelector((state) => state.lettersPage.tabIndex);

  const onChangeTab = (index: number) => {
    dispatch(lettersPageActions.setTabIndex(index));
  };

  return (
    <TabsContainer onChange={onChangeTab} index={tabIndex} isLazy>
      <TabList>
        <Tab>{t("panel_definitions")}</Tab>
        <Tab>{t("panel_display")}</Tab>
      </TabList>
      <TabsPanels>
        <TabContent>
          <PanelDefinitions />
        </TabContent>
        <TabContent>
          <PanelQuran isVisible={tabIndex === 1} />
        </TabContent>
      </TabsPanels>
    </TabsContainer>
  );
});

Letters.displayName = "Letters";

export default Letters;
