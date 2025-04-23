import { PropsWithChildren, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/store";
import { navigationActions } from "@/store/slices/global/navigation";

import { QuranProvider } from "@/context/QuranProvider";

import Navbar from "@/components/Layout/Navbar";
import AlertMessage from "@/components/Layout/AlertMessage";

import { Flex } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/ToasterProvider";
import ReloadPrompt from "@/components/Generic/ReloadPrompt";

function Layout({ children }: PropsWithChildren) {
  const refMain = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
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
    <Provider>
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
        <Toaster />
        <ReloadPrompt />
      </Flex>
    </Provider>
  );
}

export default Layout;
