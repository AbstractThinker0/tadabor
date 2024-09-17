import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { ynPageActions } from "@/store/slices/pages/yourNotes";

import { Tab, TabList } from "@chakra-ui/react";

import {
  TabContent,
  TabsContainer,
  TabsPanels,
} from "@/components/Generic/Tabs";

import RootNotes from "@/components/Pages/YourNotes/RootNotes";
import VerseNotes from "@/components/Pages/YourNotes/VerseNotes";
import TransNotes from "@/components/Pages/YourNotes/TransNotes";

const YourNotes = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const currentTab = useAppSelector((state) => state.ynPage.currentTab);

  const onChangeTab = (index: number) => {
    dispatch(ynPageActions.setCurrentTab(index));
  };

  return (
    <TabsContainer
      onChange={onChangeTab}
      index={currentTab}
      isLazy
      overflowY={"scroll"}
      flex={1}
      px={2}
      pb={2}
      display={"block"}
    >
      <TabList justifyContent={"center"}>
        <Tab>{t("notes_verses")}</Tab>

        <Tab>{t("notes_roots")}</Tab>

        <Tab>{t("notes_trans")}</Tab>
      </TabList>
      <TabsPanels>
        <TabContent>
          <VerseNotes />
        </TabContent>

        <TabContent>
          <RootNotes />
        </TabContent>

        <TabContent>
          <TransNotes />
        </TabContent>
      </TabsPanels>
    </TabsContainer>
  );
};

export default YourNotes;
