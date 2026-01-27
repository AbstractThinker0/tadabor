import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { usePageSidebarPanel } from "@/hooks/usePageSidebarPanel";
import { useSearcherPageStore } from "@/store/pages/searcherPage";

const ButtonSidebar = () => {
  const { showSearchPanel, showSearchPanelMobile, onTogglePanel } =
    usePageSidebarPanel(useSearcherPageStore);

  return (
    <ButtonSidebarGeneric
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
    />
  );
};

export { ButtonSidebar };
