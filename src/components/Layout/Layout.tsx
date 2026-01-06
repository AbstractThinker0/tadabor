import {
  type PropsWithChildren,
  useEffect,
  useEffectEvent,
  useRef,
} from "react";

import { useTranslation } from "react-i18next";

import { QuranProvider } from "@/context/QuranProvider";

import Navbar from "@/components/Layout/Navbar";
import AlertMessage from "@/components/Layout/AlertMessage";

import { Flex } from "@chakra-ui/react";

import UserProvider from "@/components/Custom/UserProvider";
import NotesProvider from "@/components/Custom/NotesProvider";

import { HookResizeEvent } from "@/hooks/useScreenSize";
import { useNavigationStore } from "@/store/global/navigationStore";
import LocalNotesProvider from "@/components/Custom/LocalNotesProvider";
import CloudNotesProvider from "@/components/Custom/CloudNotesProvider";

function Layout({ children }: PropsWithChildren) {
  const refMain = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const setPageDirection = useNavigationStore(
    (state) => state.setPageDirection
  );

  const setDirection = useEffectEvent(() => {
    const dir = i18n.dir();
    window.document.dir = dir;
    setPageDirection(dir);
  });

  useEffect(() => {
    setDirection();
  }, [i18n.resolvedLanguage]);

  return (
    <Flex
      ref={refMain}
      flexDirection="column"
      height="100vh"
      fontFamily={`Cairo, serif`}
      fontSize="larger"
      lineHeight="normal"
      color={"brand.text"}
    >
      <Navbar />
      <AlertMessage />
      <UserProvider>
        <LocalNotesProvider>
          <CloudNotesProvider>
            <NotesProvider>
              <QuranProvider>{children}</QuranProvider>
            </NotesProvider>
          </CloudNotesProvider>
        </LocalNotesProvider>
      </UserProvider>
      <HookResizeEvent />
    </Flex>
  );
}

export default Layout;
