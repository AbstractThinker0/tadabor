import { useEffect, useEffectEvent } from "react";
import { useTranslation } from "react-i18next";
import { toORPCError } from "@orpc/client";

import { useUserStore } from "@/store/global/userStore";

import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/Generic/LoadingSpinner";
import { useUserRefresh } from "@/services/backend";

interface UserProviderProps {
  children: React.ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const { t } = useTranslation();
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
        ...userRefresh.data,
        token: userRefresh.data.token || userToken,
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
      const isUnauthorized =
        toORPCError(userRefresh.error).code === "UNAUTHORIZED";

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
    return <LoadingSpinner text={t("ui.state.pending_login")} />;
  }

  return <>{children}</>;
};

export { UserProvider };
