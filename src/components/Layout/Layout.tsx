import { PropsWithChildren, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/store";
import { navigationActions } from "@/store/slices/global/navigation";
import { fetchLocalNotes } from "@/store/slices/global/localNotes";

import { QuranProvider } from "@/context/QuranProvider";

import Navbar from "@/components/Layout/Navbar";
import AlertMessage from "@/components/Layout/AlertMessage";

import { Flex } from "@chakra-ui/react";

import UserProvider from "@/components/Custom/UserProvider";
import NotesProvider from "@/components/Custom/NotesProvider";

function Layout({ children }: PropsWithChildren) {
  const refMain = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    dispatch(fetchLocalNotes());

    const handleResize = () => {
      const isSmall = window.innerWidth <= 768 || window.innerHeight <= 480;
      dispatch(navigationActions.setSmallScreen(isSmall));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <UserProvider>
      <NotesProvider>
        <Flex
          ref={refMain}
          flexDirection="column"
          height="100vh"
          fontFamily={`"Scheherazade New", serif`}
          fontSize="larger"
          lineHeight="normal"
          color={"brand.text"}
        >
          <Navbar />
          <AlertMessage />
          <QuranProvider>{children}</QuranProvider>
        </Flex>
      </NotesProvider>
    </UserProvider>
  );
}

export default Layout;
