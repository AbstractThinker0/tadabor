import { useRef, useEffect, memo } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { lettersPageActions } from "@/store/slices/pages/letters";

import PanelDefinitions from "@/components/Pages/Letters/PanelDefinitions";
import PanelQuran from "@/components/Pages/Letters/PanelQuran";

import {
  TabButton,
  TabContent,
  TabNavbar,
  TabPanel,
} from "@/components/Generic/Tabs";

import "@/styles/pages/letters.scss";

const Letters = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const showQuranTab = useAppSelector(
    (state) => state.lettersPage.showQuranTab
  );

  const refTabButtonQuran = useRef<HTMLButtonElement>(null);

  const handleClickDefTab = () => {
    dispatch(lettersPageActions.setShowQuranTab(false));
  };

  const handleClickQuranTab = () => {
    dispatch(lettersPageActions.setShowQuranTab(true));
  };

  useEffect(() => {
    if (!showQuranTab) return;

    if (!refTabButtonQuran.current) return;

    if (refTabButtonQuran.current.classList.contains("show")) return;

    refTabButtonQuran.current.click();
  }, [showQuranTab]);

  return (
    <div className="letters">
      <TabNavbar>
        <TabButton
          text={t("panel_definitions")}
          identifier="def"
          extraClass="active"
          ariaSelected={true}
          handleClickTab={handleClickDefTab}
        />
        <TabButton
          text={t("panel_display")}
          refButton={refTabButtonQuran}
          identifier="quran"
          handleClickTab={handleClickQuranTab}
        />
      </TabNavbar>

      <TabContent>
        <TabPanel identifier="def" extraClass="show active">
          <PanelDefinitions />
        </TabPanel>
        <TabPanel identifier="quran">
          <PanelQuran isVisible={showQuranTab} />
        </TabPanel>
      </TabContent>
    </div>
  );
});

Letters.displayName = "Letters";

export default Letters;
