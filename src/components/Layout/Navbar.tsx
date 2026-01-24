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
  Image,
} from "@chakra-ui/react";

import { MdMenu } from "react-icons/md";

import { TbTableDashed } from "react-icons/tb";
import { LuGitFork } from "react-icons/lu";
import { LuTag } from "react-icons/lu";
import { FaBalanceScale } from "react-icons/fa";

import { TfiWrite } from "react-icons/tfi";
import { FaRegPenToSquare } from "react-icons/fa6";

import { LuFileQuestion } from "react-icons/lu";
import { LuTextSearch } from "react-icons/lu";
import { LuScanSearch } from "react-icons/lu";
import { LuPalette } from "react-icons/lu";
import { SiGoogletranslate } from "react-icons/si";
import { VscInspect } from "react-icons/vsc";
import { LuFileVolume } from "react-icons/lu";

import { LuShield } from "react-icons/lu";

import SettingsModal from "@/components/Layout/SettingsModal";
import { NavbarUser } from "@/components/Layout/NavbarUser";

import { useNavigationStore } from "@/store/global/navigationStore";
import { useUserStore } from "@/store/global/userStore";
import { useBackend } from "@/hooks/useBackend";

const Navbar = () => {
  const { t } = useTranslation();

  const isBackendEnabled = useBackend();

  const currentPage = useNavigationStore((state) => state.currentPage);

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
        const granted = await navigator.storage.persist();

        if (granted) {
          console.log("✅ Storage is now persistent.");
        } else {
          console.log(
            "❌ Storage persistence was denied, try installing as PWA or bookmarking the website."
          );
        }
      }
    }

    storagePersist();
  }, []);

  return (
    <>
      <Box
        as="nav"
        role="navigation"
        _light={{ bgColor: "#f2f3f5" }}
        _dark={{ bgColor: "#151a23" }}
        px={2}
        smDown={{ px: "4px" }}
        py={1}
        borderBottom="1px solid"
        borderColor="border.emphasized"
      >
        <Flex justifyContent="space-between" alignItems="center">
          {/* NavMenu */}
          <Flex
            flex={1}
            gap={"5px"}
            justifyContent="flex-start"
            alignItems="center"
          >
            <NavMenu />
          </Flex>

          {/* Centered currentPage */}
          <Flex flex={1} justifyContent="center" alignItems="center">
            <Box
              textAlign="center"
              px="0.5px"
              py="0.5px"
              borderRadius="sm"
              lineHeight="short"
            >
              <Flex
                minW={"8rem"}
                bgColor="bg"
                justifyContent={"center"}
                alignItems="center"
                borderRadius="sm"
                border="1px solid"
                //borderColor="gray.400"
                borderColor={"#e5e7eb"}
                py="5px"
                fontSize={"lg"}
                shadow={"sm"}
              >
                {t(currentPage)}
              </Flex>
            </Box>
          </Flex>

          {/* Buttons */}
          <Flex flex={1} justifyContent="flex-end" alignItems="center">
            {isBackendEnabled && <NavbarUser />}

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

  const role = useUserStore((state) => state.role);

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          bgColor={"bg"}
          color={"fg"}
          _hover={{ bg: "bg.emphasized" }}
          _expanded={{ bg: "bg.emphasized" }}
          px={1}
        >
          <MdMenu />
          <Image borderRadius="2xl" boxSize="34px" src="/pwa-192x192.png" />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <MenuItem value="nav_browser" label={t("nav.browser")} to="/" />
            <MenuItem
              value="nav_roots"
              label={t("nav.roots")}
              to="/roots"
              icon={<LuGitFork />}
            />
            <MenuItem
              value="nav_translation"
              label={t("nav.translation")}
              to="/translation"
              icon={<SiGoogletranslate />}
            />
            <MenuItem
              value="nav_notes"
              label={t("nav.notes")}
              to="/notes"
              icon={<TfiWrite />}
            />
            <MenuItem
              value="nav_coloring"
              label={t("nav.coloring")}
              to="/coloring"
              icon={<LuPalette />}
            />
            <MenuItem
              value="nav_tags"
              label={t("nav.tags")}
              to="/tags"
              icon={<LuTag />}
            />
            <MenuItem
              value="nav_inspector"
              label={t("nav.inspector")}
              to="/inspector"
              icon={<VscInspect />}
            />
            <MenuItem
              value="nav_comparator"
              label={t("nav.comparator")}
              to="/comparator"
              icon={<FaBalanceScale />}
            />
            <MenuItem
              value="nav_searcher"
              label={t("nav.searcher")}
              to="/searcher"
              icon={<LuScanSearch />}
            />
            <MenuItem
              value="nav_searcher2"
              label={t("nav.searcher2")}
              to="/searcher2"
              icon={<LuTextSearch />}
            />
            <MenuItem
              value="nav_letters"
              label={t("nav.letters")}
              to="/letters"
              icon={<FaRegPenToSquare />}
            />
            <MenuItem
              value="nav_audio"
              label={t("nav.audio")}
              to="/audio"
              icon={<LuFileVolume />}
            />
            <MenuItem
              value="nav_about"
              label={t("nav.about")}
              to="/about"
              icon={<LuFileQuestion />}
            />

            {role === 1 && (
              <MenuItem
                value="nav_admin"
                label={t("nav.admin")}
                to="/admin"
                icon={<LuShield />}
              />
            )}
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
  icon?: React.ReactNode;
}

const MenuItem = ({ value, label, to, icon }: MenuItemProps) => {
  const displayIcon = icon ? icon : <TbTableDashed />;

  return (
    <Menu.Item
      _currentPage={{ bgColor: "bg.emphasized" }}
      lineHeight={"normal"}
      fontSize="large"
      value={value}
      asChild
    >
      <NavLink to={to}>
        {displayIcon}
        {label}
      </NavLink>
    </Menu.Item>
  );
};

export default Navbar;
