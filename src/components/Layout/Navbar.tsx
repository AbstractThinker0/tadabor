import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

import {
  Box,
  Flex,
  Button,
  useDisclosure,
  Menu,
  Portal,
} from "@chakra-ui/react";

import { MdMenu } from "react-icons/md";

import { TbTableDashed } from "react-icons/tb";

import SettingsModal from "@/components/Layout/SettingsModal";
import { useAppSelector } from "@/store";

const Navbar = () => {
  const { t } = useTranslation();
  const currentPage = useAppSelector((state) => state.navigation.currentPage);
  const { open, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    async function storagePersist() {
      if (
        !navigator.storage ||
        !navigator.storage.persisted ||
        !navigator.storage.persist
      )
        return;

      const isPersisted = await navigator.storage.persisted();

      if (!isPersisted) {
        navigator.storage.persist();
      }
    }

    storagePersist();
  }, []);

  return (
    <>
      <Box
        as="nav"
        role="navigation"
        _light={{ bgColor: "#f6f8fa" }} // old #1A202C
        _dark={{ bgColor: "#151a23" }}
        px={2}
        py={1}
        borderBottom={"1px solid"}
        borderColor={"border.emphasized"}
      >
        <Flex justifyContent="space-between" alignItems={"center"}>
          <NavMenu />
          <Box
            textAlign={"center"}
            minW={"8rem"}
            px={"0.5px"}
            py={"0.5px"}
            borderRadius={"sm"}
            bgColor={"border.emphasized"}
            lineHeight={"short"}
          >
            <Flex
              minW={"8rem"}
              bgColor={"bg"}
              justifySelf={"center"}
              alignSelf={"center"}
              justifyContent={"center"}
              alignContent={"center"}
              alignItems={"center"}
              borderRadius={"sm"}
              border={"1px solid"}
              borderColor={"fg.subtle"}
              py={"5px"}
            >
              {t(currentPage)}
            </Flex>
          </Box>
          <Flex>
            <Button
              aria-label="Settings"
              onClick={onOpen}
              variant="ghost"
              fontSize="large"
              padding={0}
            >
              ⚙️
            </Button>
          </Flex>
        </Flex>
      </Box>
      <SettingsModal isOpen={open} onClose={onClose} />
    </>
  );
};

const NavMenu = () => {
  const { t } = useTranslation();

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button bgColor={"bg"} color={"fg"} size="sm">
          <MdMenu />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <MenuItem value="nav_browser" label={t("nav_browser")} to="/" />
            <MenuItem value="nav_roots" label={t("nav_roots")} to="/roots" />
            <MenuItem
              value="nav_translation"
              label={t("nav_translation")}
              to="/translation"
            />
            <MenuItem value="nav_notes" label={t("nav_notes")} to="/notes" />
            <MenuItem
              value="nav_coloring"
              label={t("nav_coloring")}
              to="/coloring"
            />
            <MenuItem value="nav_tags" label={t("nav_tags")} to="/tags" />
            <MenuItem
              value="nav_inspector"
              label={t("nav_inspector")}
              to="/inspector"
            />
            <MenuItem
              value="nav_comparator"
              label={t("nav_comparator")}
              to="/comparator"
            />
            <MenuItem
              value="nav_searcher"
              label={t("nav_searcher")}
              to="/searcher"
            />
            <MenuItem
              value="nav_searcher2"
              label={t("nav_searcher2")}
              to="/searcher2"
            />
            <MenuItem
              value="nav_letters"
              label={t("nav_letters")}
              to="/letters"
            />
            <MenuItem value="nav_audio" label={t("nav_audio")} to="/audio" />
            <MenuItem value="nav_about" label={t("nav_about")} to="/about" />
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

interface MenuItemProps {
  value: string;
  label: string;
  to: string;
}

const MenuItem = ({ value, label, to }: MenuItemProps) => {
  return (
    <Menu.Item
      _currentPage={{ bgColor: "bg.emphasized" }}
      lineHeight={"normal"}
      fontSize="large"
      value={value}
      asChild
    >
      <NavLink to={to}>
        <TbTableDashed />
        {label}
      </NavLink>
    </Menu.Item>
  );
};

export default Navbar;
