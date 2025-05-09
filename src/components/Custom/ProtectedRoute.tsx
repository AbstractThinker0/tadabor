import { Navigate } from "react-router";

import { useAppSelector } from "@/store";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useBackend } from "@/hooks/useBackend";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { t } = useTranslation();

  const isLogged = useAppSelector((state) => state.user.isLogged);

  const isPending = useAppSelector((state) => state.user.isPending);

  const isBackendEnabled = useBackend();

  if (!isBackendEnabled) {
    return (
      <>
        <Navigate to="/" replace />
      </>
    );
  }

  if (isPending) {
    return <LoadingSpinner text={t("auth.attemptingLogin")} />;
  }

  if (!isLogged) {
    return (
      <>
        <LoadingSpinner text={t("auth.redirecting")} />
        <Navigate to="/" replace />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
