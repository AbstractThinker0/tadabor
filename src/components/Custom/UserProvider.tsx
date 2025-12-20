import { useEffect, useEffectEvent } from "react";

import { useAppSelector } from "@/store";

import { useTRPC } from "@/util/trpc";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const { confirmLogin, logout, loginOffline } = useAuth();

  const isLoginPending = useAppSelector((state) => state.user.isPending);
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const isLoggedOffline = useAppSelector((state) => state.user.isLoggedOffline);
  const userToken = useAppSelector((state) => state.user.token);

  const trpc = useTRPC();

  // Query for initial login attempt
  const userLogin = useQuery({
    ...trpc.auth.refresh.queryOptions(),
    enabled: (!isLogged || isLoggedOffline) && userToken.length > 0, // Only fetch if needed
    retry: false,
    refetchInterval: isLoggedOffline ? 60000 : false, // Retry every 60 seconds when offline
  });

  const onUserSuccess = useEffectEvent(() => {
    if (
      userLogin.isSuccess &&
      userLogin.data.user &&
      (!isLogged || isLoggedOffline)
    ) {
      confirmLogin({
        id: userLogin.data.user.id,
        email: userLogin.data.user.email,
        username: userLogin.data.user.username,
        token: userLogin.data.newToken || userToken,
        role: userLogin.data.user.role,
      });
    }
  });

  useEffect(() => {
    if (userLogin.isSuccess) {
      onUserSuccess();
    }
  }, [userLogin.isSuccess]);

  const onUserError = useEffectEvent(() => {
    if (userLogin.isError) {
      const isUnauthorized = userLogin.error.data?.code === "UNAUTHORIZED";

      if (isUnauthorized) {
        logout({ message: "auth.sessionExpired" });
      } else if (!isLoggedOffline && userToken.length > 0) {
        loginOffline();
      }
    }
  });

  useEffect(() => {
    if (userLogin.isError) {
      onUserError();
    }
  }, [userLogin.isError]);

  if (isLoginPending) {
    return <LoadingSpinner text="Pending login.." />;
  }

  return <>{children}</>;
};

export default UserProvider;
