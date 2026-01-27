import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { usePageSidebarPanel } from "@/hooks/usePageSidebarPanel";
import { useQuranBrowserPageStore } from "@/store/pages/quranBrowserPage";

const ButtonSidebar = () => {
  const { showSearchPanel, showSearchPanelMobile, onTogglePanel } =
    usePageSidebarPanel(useQuranBrowserPageStore);

  return (
    <ButtonSidebarGeneric
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
    />
  );
};

export { ButtonSidebar };
