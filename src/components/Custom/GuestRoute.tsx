import { Navigate } from "react-router";

import { useUserStore } from "@/store/global/userStore";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { useTranslation } from "react-i18next";

import { useBackend } from "@/hooks/useBackend";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { t } = useTranslation();

  const isBackendEnabled = useBackend();

  const isLogged = useUserStore((state) => state.isLogged);

  const isPending = useUserStore((state) => state.isPending);

  if (!isBackendEnabled) {
    return (
      <>
        <Navigate to="/" replace />
      </>
    );
  }

  if (isPending) {
    return <LoadingSpinner text={t("auth.checking")} />;
  }

  if (isLogged) {
    return (
      <>
        <LoadingSpinner text={t("auth.redirecting")} />
        <Navigate to="/" replace />
      </>
    );
  }

  return <>{children}</>;
};

export default GuestRoute;
