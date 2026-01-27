import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { usePageSidebarPanel } from "@/hooks/usePageSidebarPanel";
import { useColoringPageStore } from "@/store/pages/coloringPage";

const ButtonSidebar = () => {
  const { showSearchPanel, showSearchPanelMobile, onTogglePanel } =
    usePageSidebarPanel(useColoringPageStore);

  return (
    <ButtonSidebarGeneric
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
    />
  );
};

export { ButtonSidebar };
