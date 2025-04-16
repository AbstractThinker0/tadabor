import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { useAppDispatch, useAppSelector } from "@/store";
import { searcherPageActions } from "@/store/slices/pages/searcher";

const ButtonSidebar = () => {
  const dispatch = useAppDispatch();
  const showSearchPanel = useAppSelector(
    (state) => state.searcherPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.searcherPage.showSearchPanelMobile
  );

  const onTogglePanel = (state: boolean) => {
    dispatch(searcherPageActions.setSearchPanel(state));
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
