import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { Button, useBreakpointValue } from "@chakra-ui/react";

import { MdOutlineMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";

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

  return (
    <Button
      onClick={onTogglePanel}
      size="sm"
      fontSize="xl"
      borderRadius="full"
      bgColor="blue.500"
      color="white"
      _hover={{ bgColor: "blue.600" }}
      _active={{ bgColor: "blue.700" }}
      boxShadow="md"
    >
      {isOpen ? <MdOutlineMenuOpen /> : <MdOutlineMenu />}
    </Button>
  );
};

export { ButtonSidebar };
