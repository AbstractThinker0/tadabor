import { PropsWithChildren, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { QuranProvider } from "@/context/QuranProvider";

import Navbar from "@/components/Layout/Navbar";
import AlertMessage from "@/components/Layout/AlertMessage";

import { Flex, ChakraProvider } from "@chakra-ui/react";

import "@/styles/main.css";

function Layout({ children }: PropsWithChildren) {
  const refMain = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  const direction = i18n.dir();
  const isRtl = direction === "rtl";

  useEffect(() => {
    document.dir = direction;
  }, [i18n.resolvedLanguage]);

  return (
    <ChakraProvider>
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
        <ToastContainer
          position={`${isRtl ? "top-left" : "top-right"}`}
          rtl={isRtl}
        />
      </Flex>
    </ChakraProvider>
  );
}

export default Layout;
