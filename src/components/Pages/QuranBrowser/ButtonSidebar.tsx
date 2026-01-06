import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { useQuranBrowserPageStore } from "@/store/pages/quranBrowserPage";

const ButtonSidebar = () => {
  const showSearchPanel = useQuranBrowserPageStore(
    (state) => state.showSearchPanel
  );

  const showSearchPanelMobile = useQuranBrowserPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useQuranBrowserPageStore(
    (state) => state.setSearchPanel
  );

  const onTogglePanel = (state: boolean) => {
    setSearchPanel(state);
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
