import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";

import { Button } from "@chakra-ui/react";

import { MdOutlineMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";

const ButtonSidebar = () => {
  const dispatch = useAppDispatch();
  const showSearchPanel = useAppSelector(
    (state) => state.qbPage.showSearchPanel
  );

  const onTogglePanel = () => {
    dispatch(qbPageActions.setSearchPanel(!showSearchPanel));
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
      {showSearchPanel ? <MdOutlineMenuOpen /> : <MdOutlineMenu />}
    </Button>
  );
};

export { ButtonSidebar };
