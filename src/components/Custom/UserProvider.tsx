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

  const userToken = useAppSelector((state) => state.user.token);

  const hasShownToast = useRef(false);

  const trpc = useTRPC();

  const userLogin = useQuery({
    ...trpc.auth.refresh.queryOptions(),
    enabled: !isLogged && userToken.length > 0, // Only fetch if needed
    retry: false,
  });

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

  return <>{children}</>;
};

export default UserProvider;
