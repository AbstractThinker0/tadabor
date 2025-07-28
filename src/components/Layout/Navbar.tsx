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

import SettingsModal from "@/components/Layout/SettingsModal";
import { NavbarUser } from "@/components/Layout/NavbarUser";

import { useAppSelector } from "@/store";
import { useBackend } from "@/hooks/useBackend";

const Navbar = () => {
  const { t } = useTranslation();

  const isBackendEnabled = useBackend();

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
        //_light={{ bgColor: "#f6f8fa" }}
        _light={{ bgColor: "#e5e7eb" }}
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
            <Image
              borderRadius="2xl"
              boxSize="34px"
              src="/pwa-192x192.png"
            ></Image>
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
                borderColor="gray.400"
                py="5px"
                fontSize={"lg"}
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

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          bgColor={"bg"}
          color={"fg"}
          size="sm"
          _hover={{ bg: "bg.emphasized" }}
          _expanded={{ bg: "bg.emphasized" }}
        >
          <MdMenu />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <MenuItem value="nav_browser" label={t("nav_browser")} to="/" />
            <MenuItem
              value="nav_roots"
              label={t("nav_roots")}
              to="/roots"
              icon={<LuGitFork />}
            />
            <MenuItem
              value="nav_translation"
              label={t("nav_translation")}
              to="/translation"
              icon={<SiGoogletranslate />}
            />
            <MenuItem
              value="nav_notes"
              label={t("nav_notes")}
              to="/notes"
              icon={<TfiWrite />}
            />
            <MenuItem
              value="nav_coloring"
              label={t("nav_coloring")}
              to="/coloring"
              icon={<LuPalette />}
            />
            <MenuItem
              value="nav_tags"
              label={t("nav_tags")}
              to="/tags"
              icon={<LuTag />}
            />
            <MenuItem
              value="nav_inspector"
              label={t("nav_inspector")}
              to="/inspector"
              icon={<VscInspect />}
            />
            <MenuItem
              value="nav_comparator"
              label={t("nav_comparator")}
              to="/comparator"
              icon={<FaBalanceScale />}
            />
            <MenuItem
              value="nav_searcher"
              label={t("nav_searcher")}
              to="/searcher"
              icon={<LuScanSearch />}
            />
            <MenuItem
              value="nav_searcher2"
              label={t("nav_searcher2")}
              to="/searcher2"
              icon={<LuTextSearch />}
            />
            <MenuItem
              value="nav_letters"
              label={t("nav_letters")}
              to="/letters"
              icon={<FaRegPenToSquare />}
            />
            <MenuItem
              value="nav_audio"
              label={t("nav_audio")}
              to="/audio"
              icon={<LuFileVolume />}
            />
            <MenuItem
              value="nav_about"
              label={t("nav_about")}
              to="/about"
              icon={<LuFileQuestion />}
            />
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
