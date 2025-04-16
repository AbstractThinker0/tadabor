import { useTranslation } from "react-i18next";

import {
  Button,
  ButtonProps,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";

import { TbSelect } from "react-icons/tb";
import { MdOutlineMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";

const ButtonSave = (props: ButtonProps) => {
  const { t } = useTranslation();
  const { ...rest } = props;

  return (
    <Button
      type="submit"
      colorPalette="green"
      size="sm"
      fontWeight={"normal"}
      {...rest}
    >
      {t("text_save")}
    </Button>
  );
};

const ButtonEdit = (props: ButtonProps) => {
  const { t } = useTranslation();
  const { ...rest } = props;

  return (
    <Button colorPalette="blue" size="sm" fontWeight={"normal"} {...rest}>
      {t("text_edit")}
    </Button>
  );
};

const ButtonExpand = (props: ButtonProps) => {
  return (
    <IconButton variant="ghost" aria-label="Expand" {...props}>
      <TbSelect />
    </IconButton>
  );
};

const ButtonVerse = (props: ButtonProps) => {
  const { children, ...rest } = props;

  return (
    <Button
      userSelect="text"
      variant="ghost"
      fontSize={"inherit"}
      _hover={{ color: "cornflowerblue" }}
      {...rest}
    >
      {children}
    </Button>
  );
};

interface ButtonSidebarProps {
  isOpenMobile: boolean;
  isOpenDesktop: boolean;
  onTogglePanel: (state: boolean) => void;
}

const ButtonSidebar = ({
  isOpenMobile,
  isOpenDesktop,
  onTogglePanel,
}: ButtonSidebarProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const isOpen = isMobile ? isOpenMobile : isOpenDesktop;

  const handlePanelToggle = () => {
    onTogglePanel(!isOpen);
  };

  return (
    <Button
      onClick={handlePanelToggle}
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

export { ButtonSave, ButtonEdit, ButtonExpand, ButtonVerse, ButtonSidebar };
