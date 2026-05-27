import { useEffect, useEffectEvent } from "react";
import { useTranslation } from "react-i18next";
import { toORPCError } from "@orpc/client";

import { useUserStore } from "@/store/global/userStore";

import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/Generic/LoadingSpinner";
import { useUserRefresh } from "@/services/backend";

const HOUR_IN_MS = 60 * 60 * 1000;
const AUTH_REFRESH_INTERVAL_MS = Number(
  import.meta.env.VITE_AUTH_REFRESH_INTERVAL_MS
);
const refreshIntervalMs = Number.isFinite(AUTH_REFRESH_INTERVAL_MS)
  ? AUTH_REFRESH_INTERVAL_MS
  : HOUR_IN_MS;

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
  const tokenRotatedAt = useUserStore((state) => state.tokenRotatedAt);

  // Query for initial login attempt
  const userRefresh = useUserRefresh();

  const syncUserSession = useEffectEvent(
    (session: typeof userRefresh.data | undefined) => {
      if (!session?.user) {
        return;
      }

      if (!isLogged || isLoggedOffline) {
        confirmLogin({
          ...session,
          token: session.token || userToken,
        });

        return;
      }

      if (session.token) {
        useUserStore.getState().setToken(session.token, session.tokenRotatedAt);
      } else {
        useUserStore.getState().syncTokenRotatedAt(session.tokenRotatedAt);
      }
    }
  );

  const onUserSuccess = useEffectEvent(() => {
    if (!userRefresh.isSuccess) {
      return;
    }

    syncUserSession(userRefresh.data);
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

  const onScheduledRefresh = useEffectEvent(async () => {
    const result = await userRefresh.refetch();
    syncUserSession(result.data);
  });

  useEffect(() => {
    if (!isLogged || isLoggedOffline || userToken.length === 0) {
      return;
    }

    const delay = Math.max(tokenRotatedAt + refreshIntervalMs - Date.now(), 0);
    const timeoutId = window.setTimeout(() => {
      void onScheduledRefresh();
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isLogged, isLoggedOffline, tokenRotatedAt, userToken]);

  if (isLoginPending) {
    return <LoadingSpinner text={t("ui.state.pending_login")} />;
  }

  return <>{children}</>;
};

export { UserProvider };
