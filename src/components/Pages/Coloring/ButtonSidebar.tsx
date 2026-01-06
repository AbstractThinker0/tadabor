import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { useColoringPageStore } from "@/store/pages/coloringPage";

const ButtonSidebar = () => {
  const showSearchPanel = useColoringPageStore(
    (state) => state.showSearchPanel
  );

  const showSearchPanelMobile = useColoringPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useColoringPageStore((state) => state.setSearchPanel);

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
