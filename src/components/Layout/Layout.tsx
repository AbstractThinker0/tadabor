import { PropsWithChildren, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

// Import all of Bootstrap's JS
import "bootstrap";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QuranProvider } from "@/context/QuranProvider";
import "@/styles/main.scss";

import Navbar from "./Navbar";
import AlertMessage from "./AlertMessage";
import SettingsModal from "./SettingsModal";
import { Flex } from "@chakra-ui/react";

function Layout({ children }: PropsWithChildren) {
  const refMain = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  useEffect(() => {
    if (refMain.current) {
      refMain.current.dir = i18n.dir();
    }
  }, [i18n.resolvedLanguage, i18n]);

  return (
    <Flex
      ref={refMain}
      flexDirection="column"
      height="100vh"
      fontFamily={`"Scheherazade New", serif`}
      fontSize="larger"
      lineHeight="normal"
    >
      <Navbar />
      <AlertMessage />
      <QuranProvider>{children}</QuranProvider>
      <SettingsModal />
      <ToastContainer
        position={`${isRtl ? "top-left" : "top-right"}`}
        rtl={isRtl}
      />
    </Flex>
  );
}

export default Layout;
