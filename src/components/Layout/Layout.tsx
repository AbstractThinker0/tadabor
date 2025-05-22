import { type PropsWithChildren, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";

import { fetchLocalNotes } from "@/store/slices/global/localNotes";

import { QuranProvider } from "@/context/QuranProvider";

import Navbar from "@/components/Layout/Navbar";
import AlertMessage from "@/components/Layout/AlertMessage";

import { Flex } from "@chakra-ui/react";

import UserProvider from "@/components/Custom/UserProvider";
import NotesProvider from "@/components/Custom/NotesProvider";

import LoadingSpinner from "@/components//Generic/LoadingSpinner";

import { HookResizeEvent } from "@/hooks/useScreenSize";

function Layout({ children }: PropsWithChildren) {
  const refMain = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    dispatch(fetchLocalNotes());
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
          <QuranProvider>
            <PageBody>{children}</PageBody>
          </QuranProvider>
          <HookResizeEvent />
        </Flex>
      </NotesProvider>
    </UserProvider>
  );
}

const PageBody = ({ children }: PropsWithChildren) => {
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const isLoggedOffline = useAppSelector((state) => state.user.isLoggedOffline);
  const isLoginPending = useAppSelector((state) => state.user.isPending);

  const isLocalNotesLoading = useAppSelector(
    (state) => state.localNotes.loading
  );
  const isCloudNotesLoading = useAppSelector(
    (state) => state.cloudNotes.loading
  );

  if (
    isLocalNotesLoading ||
    ((isLogged || isLoggedOffline) && isCloudNotesLoading)
  ) {
    return <LoadingSpinner text="Loading notes.." />;
  }

  if (isLoginPending) {
    return <LoadingSpinner text="Pending login.." />;
  }

  return <>{children}</>;
};

export default Layout;
