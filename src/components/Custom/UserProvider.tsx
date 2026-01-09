import { useEffect, useEffectEvent } from "react";

import { useUserStore } from "@/store/global/userStore";

import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { useUserRefresh } from "@/services/backend";

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const { confirmLogin, logout, loginOffline } = useAuth();

  const isLoginPending = useUserStore((state) => state.isPending);
  const isLogged = useUserStore((state) => state.isLogged);
  const isLoggedOffline = useUserStore((state) => state.isLoggedOffline);
  const userToken = useUserStore((state) => state.token);

  // Query for initial login attempt
  const userRefresh = useUserRefresh();

  const onUserSuccess = useEffectEvent(() => {
    if (
      userRefresh.isSuccess &&
      userRefresh.data.user &&
      (!isLogged || isLoggedOffline)
    ) {
      confirmLogin({
        id: userRefresh.data.user.id,
        email: userRefresh.data.user.email,
        username: userRefresh.data.user.username,
        token: userRefresh.data.newToken || userToken,
        role: userRefresh.data.user.role,
        avatarSeed:
          userRefresh.data.user.avatarSeed ||
          userRefresh.data.user.id.toString(),
        description: userRefresh.data.user.description || "",
      });
    }
  });

  useEffect(() => {
    if (userRefresh.isSuccess) {
      onUserSuccess();
    }
  }, [userRefresh.isSuccess]);

  const onUserError = useEffectEvent(() => {
    if (userRefresh.isError) {
      const isUnauthorized = userRefresh.error.data?.code === "UNAUTHORIZED";

      if (isUnauthorized) {
        logout({ message: "auth.sessionExpired" });
      } else if (!isLoggedOffline && userToken.length > 0) {
        loginOffline();
      }
    }
  });

  useEffect(() => {
    if (userRefresh.isError) {
      onUserError();
    }
  }, [userRefresh.isError]);

  if (isLoginPending) {
    return <LoadingSpinner text="Pending login.." />;
  }

  return <>{children}</>;
};

export default UserProvider;
