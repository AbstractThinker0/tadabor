import { useAppDispatch, useAppSelector } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";

const ButtonSidebar = () => {
  const dispatch = useAppDispatch();
  const showSearchPanel = useAppSelector(
    (state) => state.tagsPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.tagsPage.showSearchPanelMobile
  );

  const onTogglePanel = (state: boolean) => {
    dispatch(tagsPageActions.setSearchPanel(state));
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
