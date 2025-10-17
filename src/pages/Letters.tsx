import { memo } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { lettersPageActions } from "@/store/slices/pages/letters";

import PanelDefinitions from "@/components/Pages/Letters/PanelDefinitions";
import PanelQuran from "@/components/Pages/Letters/PanelQuran";

import { Tabs } from "@chakra-ui/react";
import { usePageNav } from "@/hooks/usePageNav";

const Letters = memo(() => {
  usePageNav("nav.letters");
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const tabIndex = useAppSelector((state) => state.lettersPage.tabIndex);

  const onChangeTab = (index: string) => {
    dispatch(lettersPageActions.setTabIndex(index));
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
    >
      <Tabs.List>
        <Tabs.Trigger value="defTab">{t("panel_definitions")}</Tabs.Trigger>
        <Tabs.Trigger value="verseTab">{t("panel_display")}</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content
        overflow="hidden"
        maxH="100%"
        h="100%"
        display={"flex"}
        flexDirection={"column"}
        value="defTab"
      >
        <PanelDefinitions />
      </Tabs.Content>
      <Tabs.Content
        overflow="hidden"
        maxH="100%"
        h="100%"
        display={"flex"}
        flexDirection={"column"}
        value="verseTab"
      >
        <PanelQuran isVisible={tabIndex === "verseTab"} />
      </Tabs.Content>
    </Tabs.Root>
  );
});

Letters.displayName = "Letters";

export default Letters;
