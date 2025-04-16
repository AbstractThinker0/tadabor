import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

const ButtonSidebar = () => {
  const dispatch = useAppDispatch();
  const showSearchPanel = useAppSelector(
    (state) => state.coloringPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.coloringPage.showSearchPanelMobile
  );

  const onTogglePanel = (state: boolean) => {
    dispatch(coloringPageActions.setSearchPanel(state));
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
