import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

const ButtonSidebar = () => {
  const dispatch = useAppDispatch();
  const showSearchPanel = useAppSelector(
    (state) => state.qbPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.qbPage.showSearchPanelMobile
  );

  const onTogglePanel = (state: boolean) => {
    dispatch(qbPageActions.setSearchPanel(state));
  };

  return (
    <ButtonSidebarGeneric
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
    />
  );
};

export { ButtonSidebar };
