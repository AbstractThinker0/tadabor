import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

import {
  Box,
  Badge,
  Flex,
  Button,
  useDisclosure,
  Portal,
  Image,
  IconButton,
  Drawer,
  CloseButton,
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

import { IoMdSettings } from "react-icons/io";

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
            <Flex
              minW={"8rem"}
              bgColor="bg"
              justifyContent={"center"}
              alignItems="center"
              borderRadius="sm"
              border="1px solid"
              borderColor="border.emphasized"
              py="5px"
              px={4}
              fontSize={"lg"}
              shadow={"sm"}
              lineHeight="short"
            >
              {t(currentPage)}
            </Flex>
          </Flex>

          {/* Buttons */}
          <Flex flex={1} justifyContent="flex-end" alignItems="center">
            {isBackendEnabled && <NavbarUser />}

            <IconButton
              aria-label="Settings"
              onClick={onOpen}
              variant="ghost"
              size="md"
              fontSize="2xl"
              colorPalette={"blue"}
              color="fg.muted"
              padding={0}
            >
              <IoMdSettings />
            </IconButton>
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
    <Drawer.Root placement={"start"}>
      <Drawer.Trigger asChild dir="inherit">
        <Button variant="ghost" px={2} gap={2} _hover={{ bg: "bg.emphasized" }}>
          <MdMenu size={24} />
          <Box>
            <Image borderRadius="2xl" boxSize="34px" src="/pwa-192x192.png" />
            <Badge
              position="absolute"
              top="0"
              insetEnd="-6"
              size="xs"
              colorPalette="orange"
              textTransform="lowercase"
            >
              beta
            </Badge>
          </Box>
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header
              padding={4}
              borderBottomWidth="1px"
              borderColor="border.emphasized"
            >
              <Flex justifyContent={"space-between"} alignItems="center">
                <Flex alignItems="center" gap={3}>
                  <Image
                    borderRadius="2xl"
                    boxSize="34px"
                    src="/pwa-192x192.png"
                  />
                  <Box
                    position="relative"
                    fontFamily={"Scheherazade New"}
                    fontWeight="bold"
                    fontSize="2xl"
                    color={"#0088aa"}
                  >
                    تدبر
                    <Badge
                      position="absolute"
                      top="-1"
                      insetEnd="-6"
                      size="xs"
                      colorPalette="orange"
                      textTransform="lowercase"
                    >
                      beta
                    </Badge>
                  </Box>
                </Flex>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Flex>
            </Drawer.Header>
            <Drawer.Body padding={2}>
              <Flex flexDirection={"column"} gap={1}>
                <MenuItem label={t("nav.browser")} to="/" />
                <MenuItem
                  label={t("nav.roots")}
                  to="/roots"
                  icon={<LuGitFork />}
                />
                <MenuItem
                  label={t("nav.translation")}
                  to="/translation"
                  icon={<SiGoogletranslate />}
                />
                <MenuItem
                  label={t("nav.notes")}
                  to="/notes"
                  icon={<TfiWrite />}
                />
                <MenuItem
                  label={t("nav.coloring")}
                  to="/coloring"
                  icon={<LuPalette />}
                />
                <MenuItem label={t("nav.tags")} to="/tags" icon={<LuTag />} />
                <MenuItem
                  label={t("nav.inspector")}
                  to="/inspector"
                  icon={<VscInspect />}
                />
                <MenuItem
                  label={t("nav.comparator")}
                  to="/comparator"
                  icon={<FaBalanceScale />}
                />
                <MenuItem
                  label={t("nav.searcher")}
                  to="/searcher"
                  icon={<LuScanSearch />}
                />
                <MenuItem
                  label={t("nav.searcher2")}
                  to="/searcher2"
                  icon={<LuTextSearch />}
                />
                <MenuItem
                  label={t("nav.letters")}
                  to="/letters"
                  icon={<FaRegPenToSquare />}
                />
                <MenuItem
                  label={t("nav.audio")}
                  to="/audio"
                  icon={<LuFileVolume />}
                />
                <MenuItem
                  label={t("nav.about")}
                  to="/about"
                  icon={<LuFileQuestion />}
                />

                {role === 1 && (
                  <MenuItem
                    label={t("nav.admin")}
                    to="/admin"
                    icon={<LuShield />}
                  />
                )}
              </Flex>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

interface MenuItemProps {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

const MenuItem = ({ label, to, icon }: MenuItemProps) => {
  const displayIcon = icon ? icon : <TbTableDashed />;

  return (
    <Button
      _currentPage={{ bgColor: "bg.emphasized" }}
      lineHeight={"normal"}
      fontSize="large"
      gap={3}
      justifyContent="flex-start"
      alignItems={"center"}
      padding={2}
      variant={"ghost"}
      asChild
    >
      <NavLink to={to}>
        {displayIcon}
        {label}
      </NavLink>
    </Button>
  );
};

export default Navbar;
