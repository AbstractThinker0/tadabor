import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { useSearcherPageStore } from "@/store/pages/searcherPage";

const ButtonSidebar = () => {
  const setSearchPanel = useSearcherPageStore((state) => state.setSearchPanel);
  const showSearchPanel = useSearcherPageStore(
    (state) => state.showSearchPanel
  );

  const showSearchPanelMobile = useSearcherPageStore(
    (state) => state.showSearchPanelMobile
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
