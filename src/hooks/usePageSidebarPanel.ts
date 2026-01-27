import type { StoreApi, UseBoundStore } from "zustand";

interface SidebarPanelState {
  showSearchPanel: boolean;
  showSearchPanelMobile: boolean;
  setSearchPanel: (state: boolean, mobile?: boolean) => void;
}

type PageStoreWithSidebar<T extends SidebarPanelState> = UseBoundStore<
  StoreApi<T>
>;

export const usePageSidebarPanel = <T extends SidebarPanelState>(
  usePageStore: PageStoreWithSidebar<T>
) => {
  const showSearchPanel = usePageStore((state) => state.showSearchPanel);
  const showSearchPanelMobile = usePageStore(
    (state) => state.showSearchPanelMobile
  );
  const setSearchPanel = usePageStore((state) => state.setSearchPanel);

  const onTogglePanel = (state: boolean) => {
    setSearchPanel(state);
  };

  return {
    showSearchPanel,
    showSearchPanelMobile,
    onTogglePanel,
  };
};
