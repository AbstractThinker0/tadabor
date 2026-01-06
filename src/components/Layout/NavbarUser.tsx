import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

import { Button, Menu, Portal } from "@chakra-ui/react";

import { TbUserX } from "react-icons/tb";
import { TbUserCheck } from "react-icons/tb";

import { useNavigationStore } from "@/store/global/navigationStore";
import { useUserStore } from "@/store/global/userStore";
import { useBackend } from "@/hooks/useBackend";

import { CgProfile } from "react-icons/cg";
import { MdOutlineLogout } from "react-icons/md";

import { FaUserPlus } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";

import { useAuth } from "@/hooks/useAuth";

const NavbarUser = () => {
  const { t } = useTranslation();

  const isBackendEnabled = useBackend();

  const { logout } = useAuth();

  const isMobile = useNavigationStore((state) => state.isSmallScreen);

  const isPending = useUserStore((state) => state.isPending);
  const isLogged = useUserStore((state) => state.isLogged);
  const isLoggedOffline = useUserStore((state) => state.isLoggedOffline);

  const onClickLogout = () => {
    logout({ clearOldNotes: true });
  };

  if (!isBackendEnabled) return <></>;

  if (isPending)
    return (
      <Button
        colorPalette={"gray"}
        marginEnd={"0.5rem"}
        smDown={{ marginInline: "0" }}
        size={"sm"}
        borderRadius={"l3"}
        boxShadow={"md"}
        loading={true}
      >
        <TbUserCheck />
      </Button>
    );

  return (
    <>
      {isLogged ? (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              colorPalette={isLoggedOffline ? "orange" : "green"}
              marginEnd={"0.5rem"}
              smDown={{ marginInline: "0" }}
              size={"sm"}
              borderRadius={"l3"}
              boxShadow={"md"}
            >
              <TbUserCheck />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="user_profile" asChild>
                  <NavLink to={"/profile"}>
                    <CgProfile /> {t("auth.profile")}
                  </NavLink>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item
                  value="user_logout"
                  color="fg.error"
                  _hover={{ bg: "bg.error", color: "fg.error" }}
                  onClick={onClickLogout}
                >
                  <MdOutlineLogout />
                  {t("auth.logout")}
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ) : isMobile ? (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              bgColor={"white"}
              color={"black"}
              marginEnd={"0.5rem"}
              smDown={{ marginInline: "0" }}
              size={"sm"}
              borderRadius={"l3"}
              boxShadow={"md"}
              _hover={{ bg: "bg.emphasized" }}
              _expanded={{ bg: "bg.emphasized" }}
            >
              <TbUserX />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="user_login" asChild>
                  <NavLink to={"/login"}>
                    <IoMdLogIn /> {t("auth.login")}
                  </NavLink>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item value="user_register" asChild>
                  <NavLink to={"/register"}>
                    <FaUserPlus /> {t("auth.register")}
                  </NavLink>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            marginEnd={"0.5rem"}
            smDown={{ marginInline: "0" }}
            backgroundColor={"bg"}
            _hover={{ backgroundColor: "bg.muted" }}
            height={!isMobile ? "fit" : undefined}
            py={!isMobile ? "5px" : undefined}
            borderRadius={"l3"}
            boxShadow={"md"}
            asChild
          >
            <NavLink to="/login">
              {isMobile ? <TbUserX /> : t("auth.login")}
            </NavLink>
          </Button>
          <Button
            size="sm"
            marginEnd="0.25rem"
            mdDown={{
              display: "none",
              marginEnd: 0,
              padding: "0.2rem",
            }}
            height={"fit"}
            py={"5px"}
            borderRadius={"l3"}
            boxShadow={"md"}
            asChild
          >
            <NavLink to="/register">{t("auth.register")}</NavLink>
          </Button>
        </>
      )}
    </>
  );
};

export { NavbarUser };
