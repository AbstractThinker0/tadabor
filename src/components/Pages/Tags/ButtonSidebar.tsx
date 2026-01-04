import { useTagsPageStore } from "@/store/zustand/tagsPage";

import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";

const ButtonSidebar = () => {
  const showSearchPanel = useTagsPageStore(
    (state) => state.showSearchPanel
  );

  const showSearchPanelMobile = useTagsPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useTagsPageStore((state) => state.setSearchPanel);

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
