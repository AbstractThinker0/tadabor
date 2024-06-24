import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { ynPageActions } from "@/store/slices/pages/yourNotes";

import {
  TabButton,
  TabContent,
  TabNavbar,
  TabPanel,
} from "@/components/Generic/Tabs";

import RootNotes from "@/components/Pages/YourNotes/RootNotes";
import VerseNotes from "@/components/Pages/YourNotes/VerseNotes";
import TransNotes from "@/components/Pages/YourNotes/TransNotes";

import { TAB } from "@/components/Pages/YourNotes/consts";

import "@/styles/pages/yournotes.scss";

function YourNotes() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const refButtonVerses = useRef<HTMLButtonElement>(null);
  const refButtonRoots = useRef<HTMLButtonElement>(null);
  const refButtonTrans = useRef<HTMLButtonElement>(null);

  const currentTab = useAppSelector((state) => state.ynPage.currentTab);

  useEffect(() => {
    //
    if (
      !refButtonVerses.current ||
      !refButtonRoots.current ||
      !refButtonTrans.current
    )
      return;

    let currentButton: HTMLButtonElement;

    if (currentTab == TAB.VERSES) {
      currentButton = refButtonVerses.current;
    } else if (currentTab == TAB.ROOTS) {
      currentButton = refButtonRoots.current;
    } else {
      currentButton = refButtonTrans.current;
    }

    if (currentButton.classList.contains("show")) return;

    currentButton.click();
  }, [currentTab]);

  const onClickButtonVerses = () => {
    dispatch(ynPageActions.setCurrentTab(TAB.VERSES));
  };

  const onClickButtonRoots = () => {
    dispatch(ynPageActions.setCurrentTab(TAB.ROOTS));
  };

  const onClickButtonTrans = () => {
    dispatch(ynPageActions.setCurrentTab(TAB.TRANS));
  };

  return (
    <div className="yournotes">
      <TabNavbar extraClass="justify-content-center">
        <TabButton
          text={t("notes_verses")}
          identifier="verses"
          extraClass="active"
          ariaSelected={true}
          refButton={refButtonVerses}
          handleClickTab={onClickButtonVerses}
        />
        <TabButton
          text={t("notes_roots")}
          identifier="roots"
          refButton={refButtonRoots}
          handleClickTab={onClickButtonRoots}
        />
        <TabButton
          text={t("notes_trans")}
          identifier="trans"
          refButton={refButtonTrans}
          handleClickTab={onClickButtonTrans}
        />
      </TabNavbar>
      <TabContent>
        <TabPanel identifier="verses" extraClass="show active">
          <VerseNotes />
        </TabPanel>
        <TabPanel identifier="roots">
          <RootNotes />
        </TabPanel>
        <TabPanel identifier="trans">
          <TransNotes />
        </TabPanel>
      </TabContent>
    </div>
  );
}

export default YourNotes;
