import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { Box, Flex, Button, useDisclosure } from "@chakra-ui/react";

import SettingsModal from "@/components/Layout/SettingsModal";

const Navbar = () => {
  const { t } = useTranslation();

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
    <Box as="nav" role="navigation" bgColor="gray.800" px={2} py={1}>
      <Flex justifyContent="space-between">
        <Flex flexWrap="wrap" gap={1.5}>
          <NavItem to="/" label={t("nav_browser")} />
          <NavItem to="/roots" label={t("nav_roots")} />
          <NavItem to="/translation" label={t("nav_translation")} />
          <NavItem to="/notes" label={t("nav_notes")} />
          <NavItem to="/coloring" label={t("nav_coloring")} />
          <NavItem to="/tags" label={t("nav_tags")} />
          <NavItem to="/inspector" label={t("nav_inspector")} />
          <NavItem to="/comparator" label={t("nav_comparator")} />
          <NavItem to="/searcher" label={t("nav_searcher")} />
          <NavItem to="/searcher2" label={`${t("nav_searcher")}  2`} />
          <NavItem to="/letters" label={t("nav_letters")} />
          <NavItem to="/audio" label={t("nav_audio")} />
          <NavItem to="/about" label={t("nav_about")} />
        </Flex>
        <Flex>
          <SettingsButton />
        </Flex>
      </Flex>
    </Box>
  );
};

interface NavItemProps {
  label: string;
  to: string;
}

const NavItem = ({ label, to }: NavItemProps) => {
  return (
    <Button
      _activeLink={{ bgColor: "var(--color-primary)" }}
      bgColor={"#bdb8c6"}
      px={1}
      py={0}
      fontWeight="400"
      fontSize="large"
      lineHeight={1}
      as={NavLink}
      to={to}
    >
      {label}
    </Button>
  );
};

const SettingsButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        aria-label="Settings"
        onClick={onOpen}
        variant="ghost"
        fontSize="large"
        padding={0}
      >
        ⚙️
      </Button>
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Navbar;
