import { useEffect, useRef } from "react";

import { useAppSelector } from "@/store";

import { useTRPC } from "@/util/trpc";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const { confirmLogin, logout, loginOffline } = useAuth();

  const isLogged = useAppSelector((state) => state.user.isLogged);
  const isLoggedOffline = useAppSelector((state) => state.user.isLoggedOffline);
  const userToken = useAppSelector((state) => state.user.token);
  const email = useAppSelector((state) => state.user.email);
  const username = useAppSelector((state) => state.user.username);

  const hasShownToast = useRef(false);

  const trpc = useTRPC();

  // Query for initial login attempt
  const userLogin = useQuery({
    ...trpc.auth.refresh.queryOptions(),
    enabled: !isLogged && userToken.length > 0, // Only fetch if needed
    retry: false,
  });

  // Query for checking connection when offline
  const connectionCheck = useQuery({
    ...trpc.auth.refresh.queryOptions(),
    enabled: isLoggedOffline && userToken.length > 0,
    retry: false,
    refetchInterval: 60000, // Check every 60 seconds
  });

  // Handle initial login attempt
  useEffect(() => {
    if (hasShownToast.current) return;

    if (userLogin.isSuccess && userLogin.data.user && !isLogged) {
      hasShownToast.current = true;

      confirmLogin({
        email: userLogin.data.user.email,
        username: userLogin.data.user.username,
        token: userToken,
      });
    }

    if (userLogin.isError) {
      hasShownToast.current = true;

      const isUnauthorized = userLogin.error.data?.code === "UNAUTHORIZED";

      if (isUnauthorized) {
        logout({ message: "auth.sessionExpired" });
      } else {
        loginOffline();
      }
    }
  }, [
    userLogin.isSuccess,
    userLogin.isError,
    userLogin.data,
    isLogged,
    userToken,
  ]);

  // Handle connection check results
  useEffect(() => {
    if (
      !isLoggedOffline ||
      !connectionCheck.isSuccess ||
      !connectionCheck.data?.user
    )
      return;

    // If we successfully connected to the backend while in offline mode,
    // transition to regular logged in state
    confirmLogin({
      email: email,
      username: username,
      token: userToken,
    });
  }, [connectionCheck.isSuccess, connectionCheck.data, isLoggedOffline]);

  useEffect(() => {
    if (connectionCheck.isError) {
      const isUnauthorized =
        connectionCheck.error.data?.code === "UNAUTHORIZED";

      if (isUnauthorized) {
        logout({ message: "auth.sessionExpired" });
      }
    }
  }, [connectionCheck.isError]);

  return <>{children}</>;
};

export default UserProvider;
