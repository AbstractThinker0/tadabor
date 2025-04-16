import { ButtonSidebar as ButtonSidebarGeneric } from "@/components/Generic/Buttons";
import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { useBreakpointValue } from "@chakra-ui/react";

const ButtonSidebar = () => {
  const dispatch = useAppDispatch();
  const showSearchPanel = useAppSelector(
    (state) => state.qbPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.qbPage.showSearchPanelMobile
  );

  const isMobile = useBreakpointValue({ base: true, md: false });
  const isOpen = isMobile ? showSearchPanelMobile : showSearchPanel;

  const onTogglePanel = () => {
    dispatch(qbPageActions.setSearchPanel(!isOpen));
  };

  return <ButtonSidebarGeneric isOpen={isOpen} onTogglePanel={onTogglePanel} />;
};

export { ButtonSidebar };
