import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { ynPageActions } from "@/store/slices/pages/yourNotes";

import { Tabs } from "@chakra-ui/react";

import RootNotes from "@/components/Pages/YourNotes/RootNotes";
import VerseNotes from "@/components/Pages/YourNotes/VerseNotes";
import TransNotes from "@/components/Pages/YourNotes/TransNotes";

const YourNotes = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const currentTab = useAppSelector((state) => state.ynPage.currentTab);

  const onChangeTab = (index: string) => {
    dispatch(ynPageActions.setCurrentTab(index));
  };

  return (
    <Tabs.Root
      onValueChange={(e) => onChangeTab(e.value)}
      value={currentTab}
      bgColor={"brand.bg"}
      overflowY={"scroll"}
      flex={1}
      px={2}
      pb={2}
      maxH="100%"
      h="100%"
      lazyMount
    >
      <Tabs.List justifyContent={"center"}>
        <Tabs.Trigger value="versesTab">{t("notes_verses")}</Tabs.Trigger>

        <Tabs.Trigger value="rootsTab">{t("notes_roots")}</Tabs.Trigger>

        <Tabs.Trigger value="transTab">{t("notes_trans")}</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content
        overflow="hidden"
        display={"flex"}
        flexDirection={"column"}
        value="versesTab"
      >
        <VerseNotes />
      </Tabs.Content>
      <Tabs.ContentGroup>
        <Tabs.Content
          overflow="hidden"
          display={"flex"}
          flexDirection={"column"}
          value="rootsTab"
        >
          <RootNotes />
        </Tabs.Content>

        <Tabs.Content
          overflow="hidden"
          display={"flex"}
          flexDirection={"column"}
          value="transTab"
        >
          <TransNotes />
        </Tabs.Content>
      </Tabs.ContentGroup>
    </Tabs.Root>
  );
};

export default YourNotes;
