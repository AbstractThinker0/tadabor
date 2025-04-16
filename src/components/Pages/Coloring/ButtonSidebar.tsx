import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { useBreakpointValue } from "@chakra-ui/react";

const ButtonSidebar = () => {
  const dispatch = useAppDispatch();
  const showSearchPanel = useAppSelector(
    (state) => state.coloringPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.coloringPage.showSearchPanelMobile
  );

  const isMobile = useBreakpointValue({ base: true, md: false });
  const isOpen = isMobile ? showSearchPanelMobile : showSearchPanel;

  const onTogglePanel = () => {
    dispatch(coloringPageActions.setSearchPanel(!isOpen));
  };

  return <ButtonSidebarGeneric isOpen={isOpen} onTogglePanel={onTogglePanel} />;
};

export { ButtonSidebar };
