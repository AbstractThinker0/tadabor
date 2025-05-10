import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

import { Button, Menu, Portal } from "@chakra-ui/react";

import { TbUserX } from "react-icons/tb";
import { TbUserCheck } from "react-icons/tb";

import { useAppSelector } from "@/store";
import { useBackend } from "@/hooks/useBackend";

import { CgProfile } from "react-icons/cg";
import { MdOutlineLogout } from "react-icons/md";

import { useAuth } from "@/hooks/useAuth";

const NavbarUser = () => {
  const { t } = useTranslation();

  const isBackendEnabled = useBackend();

  const { logout } = useAuth();

  const isMobile = useAppSelector((state) => state.navigation.isSmallScreen);

  const isPending = useAppSelector((state) => state.user.isPending);
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const isLoggedOffline = useAppSelector((state) => state.user.isLoggedOffline);

  const onClickLogout = () => {
    logout();
  };

  if (!isBackendEnabled) return <></>;

  if (isPending)
    return (
      <Button
        colorPalette={"gray"}
        marginEnd={"0.5rem"}
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
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            marginEnd="0.5rem"
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
            smDown={{
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
