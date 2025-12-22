import {
  type PropsWithChildren,
  useEffect,
  useEffectEvent,
  useRef,
} from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch } from "@/store";

import { fetchLocalNotes } from "@/store/slices/global/localNotes";

import { QuranProvider } from "@/context/QuranProvider";

import Navbar from "@/components/Layout/Navbar";
import AlertMessage from "@/components/Layout/AlertMessage";

import { Flex } from "@chakra-ui/react";

import UserProvider from "@/components/Custom/UserProvider";
import NotesProvider from "@/components/Custom/NotesProvider";

import { HookResizeEvent } from "@/hooks/useScreenSize";
import { navigationActions } from "@/store/slices/global/navigation";
import LocalNotesProvider from "@/components/Custom/LocalNotesProvider";
import CloudNotesProvider from "@/components/Custom/CloudNotesProvider";

function Layout({ children }: PropsWithChildren) {
  const refMain = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const setDirection = useEffectEvent(() => {
    const dir = i18n.dir();
    window.document.dir = dir;
    dispatch(navigationActions.setPageDirection(dir));
  });

  useEffect(() => {
    setDirection();
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    dispatch(fetchLocalNotes());
  }, [dispatch]);

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
          <NotesProvider>
            <QuranProvider>
              <CloudNotesProvider>{children}</CloudNotesProvider>
            </QuranProvider>
          </NotesProvider>
        </LocalNotesProvider>
      </UserProvider>
      <HookResizeEvent />
    </Flex>
  );
}

export default Layout;
