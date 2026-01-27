import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { usePageSidebarPanel } from "@/hooks/usePageSidebarPanel";
import { useTagsPageStore } from "@/store/pages/tagsPage";

const ButtonSidebar = () => {
  const { showSearchPanel, showSearchPanelMobile, onTogglePanel } =
    usePageSidebarPanel(useTagsPageStore);

  return (
    <ButtonSidebarGeneric
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
    />
  );
};

export { ButtonSidebar };
